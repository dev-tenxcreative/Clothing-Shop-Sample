"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Columns2, Columns3, Columns4, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/data/types";
import { SIZES } from "@/data/types";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  applyFilters,
  colourFamilies,
  colourFamilyOf,
  effectivePrice,
  emptyFilters,
  sortProducts,
  type Filters,
  type SortKey,
} from "@/lib/products";
import { cn, formatPrice } from "@/lib/utils";
import { useMounted, usePrefs } from "@/store";
import { PriceRange } from "./PriceRange";

const PAGE = 12;

const SORTS: { key: SortKey; label: string }[] = [
  { key: "featured", label: "Featured" },
  { key: "newest", label: "Newest" },
  { key: "popular", label: "Most popular" },
  { key: "price-asc", label: "Price: low to high" },
  { key: "price-desc", label: "Price: high to low" },
];

type ListKey = "sizes" | "colours" | "fabrics" | "occasions" | "lengths" | "subs";

const PARAM: Record<ListKey, string> = {
  sizes: "size",
  colours: "colour",
  fabrics: "fabric",
  occasions: "occasion",
  lengths: "length",
  subs: "sub",
};

function readFilters(sp: URLSearchParams): Filters {
  const list = (k: string) =>
    sp
      .getAll(k)
      .flatMap((v) => v.split(","))
      .filter(Boolean);
  const price = sp.get("price")?.split("-").map(Number);
  return {
    sizes: list("size"),
    colours: list("colour"),
    fabrics: list("fabric"),
    occasions: list("occasion"),
    lengths: list("length"),
    subs: list("sub"),
    price: price && price.length === 2 && price.every((n) => !Number.isNaN(n)) ? [price[0], price[1]] : null,
    onlyNew: sp.get("new") === "1",
    onlySale: sp.get("sale") === "1",
  };
}

function writeUrl(f: Filters, sort: SortKey, q: string) {
  const sp = new URLSearchParams();
  if (q) sp.set("q", q);
  (Object.keys(PARAM) as ListKey[]).forEach((k) => f[k].length && sp.set(PARAM[k], f[k].join(",")));
  if (f.price) sp.set("price", `${f.price[0]}-${f.price[1]}`);
  if (f.onlyNew) sp.set("new", "1");
  if (f.onlySale) sp.set("sale", "1");
  if (sort !== "featured") sp.set("sort", sort);
  const qs = sp.toString();
  window.history.replaceState(window.history.state, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
}

export function ProductListing({
  products,
  showCategory = false,
  hideSaleToggle = false,
  hideNewToggle = false,
}: {
  products: Product[];
  showCategory?: boolean;
  hideSaleToggle?: boolean;
  hideNewToggle?: boolean;
}) {
  const sp = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => readFilters(new URLSearchParams(sp.toString())));
  const [sort, setSort] = useState<SortKey>(() => (sp.get("sort") as SortKey) || "featured");
  const [query, setQuery] = useState(() => sp.get("q") ?? "");
  const mounted = useMounted();
  const savedCols = usePrefs((s) => s.gridCols);
  const setCols = usePrefs((s) => s.setGridCols);
  const cols = mounted ? savedCols : 3;
  const [visible, setVisible] = useState(PAGE);
  const [loading, setLoading] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebar, setSidebar] = useState(true);
  const sentinel = useRef<HTMLDivElement>(null);

  // Re-read when the URL changes through navigation (e.g. mega-menu links).
  const spKey = sp.toString();
  const [prevSp, setPrevSp] = useState(spKey);
  if (spKey !== prevSp) {
    setPrevSp(spKey);
    const next = new URLSearchParams(spKey);
    setFilters(readFilters(next));
    setSort((next.get("sort") as SortKey) || "featured");
    setQuery(next.get("q") ?? "");
    setVisible(PAGE);
  }

  const searched = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      `${p.name} ${p.category} ${p.subcategory} ${p.fabricFamily} ${p.colours.map((c) => c.name).join(" ")} ${p.tags.join(" ")}`
        .toLowerCase()
        .includes(q),
    );
  }, [products, query]);

  const results = useMemo(() => sortProducts(applyFilters(searched, filters), sort), [searched, filters, sort]);
  const shown = results.slice(0, visible);

  const bounds = useMemo<[number, number]>(() => {
    const prices = products.map(effectivePrice);
    return [Math.floor(Math.min(...prices) / 500) * 500, Math.ceil(Math.max(...prices) / 500) * 500];
  }, [products]);

  const facets = useMemo(() => {
    const uniq = <T,>(arr: T[]) => [...new Set(arr)];
    return {
      subs: uniq(products.map((p) => p.subcategory)).sort(),
      fabrics: uniq(products.map((p) => p.fabricFamily)).sort(),
      occasions: uniq(products.flatMap((p) => p.occasion)).sort(),
      lengths: uniq(products.map((p) => p.length)),
      colours: colourFamilies.filter((f) => products.some((p) => p.colours.some((c) => colourFamilyOf(c.name) === f.name))),
    };
  }, [products]);

  const update = useCallback(
    (next: Filters, nextSort = sort) => {
      setFilters(next);
      setVisible(PAGE);
      writeUrl(next, nextSort, query);
    },
    [sort, query],
  );

  const toggle = (key: ListKey, value: string) => {
    const has = filters[key].includes(value);
    update({ ...filters, [key]: has ? filters[key].filter((v) => v !== value) : [...filters[key], value] });
  };

  const loadMore = useCallback(() => {
    if (loading || visible >= results.length) return;
    setLoading(true);
    window.setTimeout(() => {
      setVisible((v) => v + PAGE);
      setLoading(false);
    }, 450);
  }, [loading, visible, results.length]);

  // Infinite scroll after the first manual "load more".
  const [auto, setAuto] = useState(false);
  useEffect(() => {
    if (!auto || !sentinel.current) return;
    const io = new IntersectionObserver((e) => e[0].isIntersecting && loadMore(), { rootMargin: "600px" });
    io.observe(sentinel.current);
    return () => io.disconnect();
  }, [auto, loadMore]);

  const chips: { label: string; clear: () => void }[] = [
    ...(Object.keys(PARAM) as ListKey[]).flatMap((k) =>
      filters[k].map((v) => ({ label: k === "sizes" ? `Size ${v}` : v, clear: () => toggle(k, v) })),
    ),
    ...(filters.price
      ? [{ label: `${formatPrice(filters.price[0])} – ${formatPrice(filters.price[1])}`, clear: () => update({ ...filters, price: null }) }]
      : []),
    ...(filters.onlyNew ? [{ label: "New in", clear: () => update({ ...filters, onlyNew: false }) }] : []),
    ...(filters.onlySale ? [{ label: "On sale", clear: () => update({ ...filters, onlySale: false }) }] : []),
    ...(query
      ? [
          {
            label: `“${query}”`,
            clear: () => {
              setQuery("");
              writeUrl(filters, sort, "");
            },
          },
        ]
      : []),
  ];
  const activeCount = chips.length;

  const panel = (
    <FilterPanel
      filters={filters}
      facets={facets}
      bounds={bounds}
      toggle={toggle}
      update={update}
      showCategory={showCategory}
      hideSaleToggle={hideSaleToggle}
      hideNewToggle={hideNewToggle}
    />
  );

  const gridCols = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-3 xl:grid-cols-4" }[cols];

  return (
    <div className="container-velora pb-24">
      {/* Toolbar */}
      <div className="border-line bg-ivory/90 sticky top-0 z-20 -mx-4 mb-6 flex items-center justify-between gap-3 border-b px-4 py-3 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:backdrop-blur-none">
        <div className="flex items-center gap-4">
          <button
            onClick={() => (window.matchMedia("(min-width: 1024px)").matches ? setSidebar((s) => !s) : setMobileOpen(true))}
            className="border-ink/20 hover:border-ink inline-flex h-10 items-center gap-2 border px-4 text-[0.68rem] font-semibold tracking-[0.18em] uppercase transition"
            aria-expanded={sidebar}
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span className="hidden sm:inline lg:hidden">Filter</span>
            <span className="hidden lg:inline">{sidebar ? "Hide filters" : "Show filters"}</span>
            {activeCount > 0 && (
              <span className="bg-rose grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.6rem] text-white">{activeCount}</span>
            )}
          </button>
          <p className="text-ink-muted text-sm" aria-live="polite">
            <span className="text-ink font-medium">{results.length}</span> {results.length === 1 ? "piece" : "pieces"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 md:flex" role="group" aria-label="Grid density">
            {([2, 3, 4] as const).map((n) => {
              const Icon = n === 2 ? Columns2 : n === 3 ? Columns3 : Columns4;
              return (
                <button
                  key={n}
                  aria-pressed={cols === n}
                  aria-label={`${n} columns`}
                  onClick={() => setCols(n)}
                  className={cn("grid h-10 w-10 place-items-center transition", cols === n ? "text-ink" : "text-ink/35 hover:text-ink")}
                >
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.4} />
                </button>
              );
            })}
          </div>
          <label className="relative">
            <span className="sr-only">Sort by</span>
            <select
              value={sort}
              onChange={(e) => {
                const s = e.target.value as SortKey;
                setSort(s);
                writeUrl(filters, s, query);
              }}
              className="border-ink/20 hover:border-ink focus:border-ink h-10 appearance-none border bg-transparent pr-9 pl-4 text-[0.8rem] transition outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <svg className="pointer-events-none absolute top-1/2 right-3 h-3 w-3 -translate-y-1/2" viewBox="0 0 12 12" aria-hidden>
              <path d="M2 4l4 4 4-4" stroke="currentColor" fill="none" strokeWidth="1.4" />
            </svg>
          </label>
        </div>
      </div>

      {/* Active chips */}
      <AnimatePresence>
        {chips.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 flex flex-wrap items-center gap-2 overflow-hidden"
          >
            {chips.map((c) => (
              <motion.button
                layout
                key={c.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={c.clear}
                className="bg-ink text-ivory hover:bg-rose inline-flex h-8 items-center gap-2 rounded-full px-3.5 text-xs transition"
                aria-label={`Remove filter ${c.label}`}
              >
                {c.label} <X className="h-3 w-3" />
              </motion.button>
            ))}
            <button
              onClick={() => {
                setQuery("");
                update(emptyFilters);
                writeUrl(emptyFilters, sort, "");
              }}
              className="text-ink-muted hover:text-ink ml-1 text-xs underline underline-offset-4"
            >
              Clear all
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex gap-10">
        <AnimatePresence initial={false}>
          {sidebar && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 260, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="hidden shrink-0 overflow-hidden lg:block"
              aria-label="Filters"
            >
              <div className="sticky top-28 max-h-[calc(100vh-8rem)] w-[260px] overflow-y-auto pr-2 pb-10" data-lenis-prevent>
                {panel}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        <div className="min-w-0 flex-1">
          {results.length === 0 ? (
            <EmptyState
              onReset={() => {
                setQuery("");
                update(emptyFilters);
                writeUrl(emptyFilters, sort, "");
              }}
            />
          ) : (
            <>
              <motion.ul layout className={cn("grid grid-cols-2 gap-x-3 gap-y-10 md:gap-x-5 md:gap-y-14", gridCols)}>
                {shown.map((p, i) => (
                  <motion.li
                    key={p.id}
                    layout="position"
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (i % PAGE) * 0.03 }}
                  >
                    <ProductCard
                      product={p}
                      priority={i < 4}
                      sizes={
                        cols === 2
                          ? "(min-width: 768px) 40vw, 50vw"
                          : cols === 3
                            ? "(min-width: 768px) 28vw, 50vw"
                            : "(min-width: 1280px) 20vw, 50vw"
                      }
                    />
                  </motion.li>
                ))}
                {loading &&
                  Array.from({ length: Math.min(PAGE, results.length - visible) }).map((_, i) => (
                    <li key={`sk-${i}`}>
                      <ProductCardSkeleton />
                    </li>
                  ))}
              </motion.ul>
              <div ref={sentinel} className="mt-16 flex flex-col items-center gap-4">
                <p className="text-ink-muted text-xs">
                  Showing {Math.min(visible, results.length)} of {results.length}
                </p>
                <div className="bg-line h-px w-48">
                  <div
                    className="bg-ink h-px transition-all duration-500"
                    style={{ width: `${(Math.min(visible, results.length) / results.length) * 100}%` }}
                  />
                </div>
                {visible < results.length && !auto && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAuto(true);
                      loadMore();
                    }}
                  >
                    Load more
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Modal open={mobileOpen} onClose={() => setMobileOpen(false)} placement="left" title="Filter & sort">
        <div className="flex-1 overflow-y-auto px-6 py-4" data-lenis-prevent>
          {panel}
        </div>
        <div className="border-line grid grid-cols-2 gap-3 border-t p-4">
          <Button
            variant="outline"
            onClick={() => {
              update(emptyFilters);
            }}
          >
            Clear
          </Button>
          <Button variant="dark" onClick={() => setMobileOpen(false)}>
            Show {results.length}
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function FilterGroup({
  title,
  children,
  defaultOpen = true,
  count,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-line border-b py-5">
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center justify-between text-left">
        <span className="eyebrow text-[0.64rem]">
          {title}
          {count ? <span className="text-rose ml-2">({count})</span> : null}
        </span>
        <span className={cn("text-lg leading-none transition-transform duration-300", open && "rotate-45")}>+</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckList({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (v: string) => void }) {
  return (
    <ul className="space-y-2.5">
      {options.map((o) => (
        <li key={o}>
          <label className="text-ink-soft hover:text-ink flex cursor-pointer items-center gap-3 text-sm transition">
            <input type="checkbox" checked={selected.includes(o)} onChange={() => onToggle(o)} className="accent-ink h-4 w-4" />
            {o}
          </label>
        </li>
      ))}
    </ul>
  );
}

function FilterPanel({
  filters,
  facets,
  bounds,
  toggle,
  update,
  hideSaleToggle,
  hideNewToggle,
}: {
  filters: Filters;
  facets: { subs: string[]; fabrics: string[]; occasions: string[]; lengths: string[]; colours: typeof colourFamilies };
  bounds: [number, number];
  toggle: (k: ListKey, v: string) => void;
  update: (f: Filters) => void;
  showCategory: boolean;
  hideSaleToggle: boolean;
  hideNewToggle: boolean;
}) {
  return (
    <div>
      {(!hideNewToggle || !hideSaleToggle) && (
        <div className="flex flex-wrap gap-2 pb-5">
          {!hideNewToggle && (
            <button
              onClick={() => update({ ...filters, onlyNew: !filters.onlyNew })}
              aria-pressed={filters.onlyNew}
              className={cn(
                "h-9 rounded-full border px-4 text-xs transition",
                filters.onlyNew ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink",
              )}
            >
              New in
            </button>
          )}
          {!hideSaleToggle && (
            <button
              onClick={() => update({ ...filters, onlySale: !filters.onlySale })}
              aria-pressed={filters.onlySale}
              className={cn(
                "h-9 rounded-full border px-4 text-xs transition",
                filters.onlySale ? "border-rose bg-rose text-white" : "border-line hover:border-rose",
              )}
            >
              On sale
            </button>
          )}
        </div>
      )}
      <FilterGroup title="Size" count={filters.sizes.length}>
        <div className="grid grid-cols-3 gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggle("sizes", s)}
              aria-pressed={filters.sizes.includes(s)}
              className={cn(
                "h-10 border text-xs font-medium transition",
                filters.sizes.includes(s) ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Colour" count={filters.colours.length}>
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          {facets.colours.map((c) => (
            <button
              key={c.name}
              onClick={() => toggle("colours", c.name)}
              aria-pressed={filters.colours.includes(c.name)}
              className="group text-ink-soft flex items-center gap-2.5 text-left text-xs"
            >
              <span
                className={cn(
                  "border-ink/15 ring-offset-ivory h-6 w-6 shrink-0 rounded-full border ring-offset-2 transition",
                  filters.colours.includes(c.name) ? "ring-ink ring-1" : "group-hover:ring-ink/30 group-hover:ring-1",
                )}
                style={{ background: c.hex }}
              />
              <span className={cn(filters.colours.includes(c.name) && "text-ink font-medium")}>{c.name}</span>
            </button>
          ))}
        </div>
      </FilterGroup>
      <FilterGroup title="Price">
        <PriceRange
          min={bounds[0]}
          max={bounds[1]}
          value={filters.price ?? bounds}
          onCommit={(v) => update({ ...filters, price: v[0] === bounds[0] && v[1] === bounds[1] ? null : v })}
        />
      </FilterGroup>
      {facets.subs.length > 1 && (
        <FilterGroup title="Style" count={filters.subs.length}>
          <CheckList options={facets.subs} selected={filters.subs} onToggle={(v) => toggle("subs", v)} />
        </FilterGroup>
      )}
      <FilterGroup title="Fabric" count={filters.fabrics.length} defaultOpen={false}>
        <CheckList options={facets.fabrics} selected={filters.fabrics} onToggle={(v) => toggle("fabrics", v)} />
      </FilterGroup>
      <FilterGroup title="Occasion" count={filters.occasions.length} defaultOpen={false}>
        <CheckList options={facets.occasions} selected={filters.occasions} onToggle={(v) => toggle("occasions", v)} />
      </FilterGroup>
      <FilterGroup title="Length" count={filters.lengths.length} defaultOpen={false}>
        <CheckList options={facets.lengths} selected={filters.lengths} onToggle={(v) => toggle("lengths", v)} />
      </FilterGroup>
    </div>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center py-24 text-center">
      <svg viewBox="0 0 80 80" className="text-rose h-20 w-20" fill="none" aria-hidden>
        <path d="M24 18h32l6 12-8 4v32H26V34l-8-4 6-12Z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M32 18c0 5 3.6 8 8 8s8-3 8-8" stroke="currentColor" strokeWidth="1.2" />
        <path d="M33 46l14 10M47 46L33 56" stroke="currentColor" strokeWidth="1.2" />
      </svg>
      <h2 className="mt-6 font-serif text-4xl">No pieces match — yet</h2>
      <p className="text-ink-soft mt-3 max-w-sm text-sm">Try removing a filter or two. New arrivals land every week.</p>
      <Button variant="dark" className="mt-8" onClick={onReset}>
        Clear all filters
      </Button>
    </div>
  );
}

export function ListingSkeleton() {
  return (
    <div className="container-velora pb-24">
      <div className="border-line mb-6 flex items-center justify-between border-b py-3">
        <div className="skeleton h-10 w-40" />
        <div className="skeleton h-10 w-44" />
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
