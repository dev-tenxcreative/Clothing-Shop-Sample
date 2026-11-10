"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, Search, TrendingUp, X } from "lucide-react";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Price } from "@/components/ui/Bits";
import { SmartImage } from "@/components/ui/SmartImage";
import { categories } from "@/data/catalog";
import { getBestSellers, searchProducts } from "@/lib/products";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { useMounted, useSearchHistory, useUI } from "@/store";

const POPULAR = ["Linen", "Midi frock", "Satin", "Wide-leg", "Office blouse", "Maxi dress", "White"];
const ease = [0.22, 1, 0.36, 1] as const;

export function SearchOverlay() {
  const { searchOpen, setSearch } = useUI();
  const mounted = useMounted();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const { terms, add, clear } = useSearchHistory();

  const results = useMemo(() => searchProducts(deferred, 8), [deferred]);
  const trending = useMemo(() => getBestSellers(4), []);

  // "/" shortcut opens search; Cmd/Ctrl+K too.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k")) {
        e.preventDefault();
        setSearch(true);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [setSearch]);

  useEffect(() => {
    if (!searchOpen) return;
    lockScroll();
    const t = window.setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setSearch(false);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      unlockScroll();
      document.removeEventListener("keydown", onKey);
    };
  }, [searchOpen, setSearch]);

  const close = () => setSearch(false);
  const go = (term: string) => {
    add(term);
    close();
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className="bg-ivory fixed inset-0 z-[85] overflow-y-auto"
          data-lenis-prevent
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.65, ease }}
        >
          <div className="container-velora pt-6 pb-20 md:pt-10">
            <div className="flex justify-end">
              <button
                onClick={close}
                aria-label="Close search"
                className="hover:bg-ink/5 grid h-11 w-11 place-items-center rounded-full transition hover:rotate-90"
              >
                <X className="h-6 w-6" strokeWidth={1.3} />
              </button>
            </div>
            <motion.form
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.2 }}
              onSubmit={(e) => {
                e.preventDefault();
                if (query.trim()) go(query);
              }}
              className="mx-auto mt-4 max-w-4xl"
              role="search"
            >
              <label htmlFor="site-search" className="eyebrow text-ink-muted mb-4 block">
                What are you looking for?
              </label>
              <div className="border-ink flex items-center gap-4 border-b pb-3">
                <Search className="text-ink-muted h-7 w-7 shrink-0" strokeWidth={1.2} />
                <input
                  ref={inputRef}
                  id="site-search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search frocks, linen, satin…"
                  autoComplete="off"
                  className="placeholder:text-ink/25 min-w-0 flex-1 bg-transparent font-serif text-3xl outline-none md:text-6xl"
                  aria-controls="search-results"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-ink-muted hover:text-ink text-xs tracking-[0.2em] uppercase"
                  >
                    Clear
                  </button>
                )}
              </div>
            </motion.form>

            <div id="search-results" className="mx-auto mt-12 max-w-6xl" aria-live="polite">
              {!deferred.trim() ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.35 }}
                  className="grid gap-12 md:grid-cols-[1fr_2fr]"
                >
                  <div className="space-y-10">
                    {terms.length > 0 && (
                      <div>
                        <div className="mb-4 flex items-center justify-between">
                          <p className="eyebrow text-ink-muted">Recent searches</p>
                          <button onClick={clear} className="text-ink-muted text-xs underline underline-offset-4">
                            Clear
                          </button>
                        </div>
                        <ul className="space-y-2">
                          {terms.map((t) => (
                            <li key={t}>
                              <button onClick={() => go(t)} className="hover:text-rose inline-flex items-center gap-2 text-[0.95rem]">
                                <Clock className="text-ink-muted h-3.5 w-3.5" /> {t}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <p className="eyebrow text-ink-muted mb-4">Popular searches</p>
                      <div className="flex flex-wrap gap-2">
                        {POPULAR.map((t) => (
                          <button
                            key={t}
                            onClick={() => setQuery(t)}
                            className="border-line hover:border-ink inline-flex h-9 items-center gap-1.5 rounded-full border px-4 text-sm transition"
                          >
                            <TrendingUp className="text-rose h-3.5 w-3.5" /> {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="eyebrow text-ink-muted mb-4">Categories</p>
                      <ul className="space-y-2">
                        {categories.map((c) => (
                          <li key={c.slug}>
                            <Link href={`/shop/${c.slug}`} onClick={close} className="hover:text-rose font-serif text-2xl">
                              {c.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div>
                    <p className="eyebrow text-ink-muted mb-4">Trending now</p>
                    <ResultsGrid products={trending} onPick={close} />
                  </div>
                </motion.div>
              ) : results.length ? (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-ink-muted text-sm">
                      {results.length} result{results.length === 1 ? "" : "s"} for “{deferred}”
                    </p>
                    <button
                      onClick={() => go(deferred)}
                      className="hover:text-rose inline-flex items-center gap-2 text-[0.7rem] font-semibold tracking-[0.2em] uppercase"
                    >
                      View all <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <ResultsGrid
                    products={results}
                    onPick={() => {
                      add(deferred);
                      close();
                    }}
                  />
                </div>
              ) : (
                <div className="text-center">
                  <p className="font-serif text-4xl">Nothing found for “{deferred}”</p>
                  <p className="text-ink-soft mt-3 text-sm">Check the spelling, or try one of these:</p>
                  <div className="mt-6 flex flex-wrap justify-center gap-2">
                    {POPULAR.slice(0, 5).map((t) => (
                      <button
                        key={t}
                        onClick={() => setQuery(t)}
                        className="border-line hover:border-ink h-9 rounded-full border px-4 text-sm transition"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="mx-auto mt-14 max-w-4xl text-left">
                    <p className="eyebrow text-ink-muted mb-4">You might like</p>
                    <ResultsGrid products={trending} onPick={close} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function ResultsGrid({ products, onPick }: { products: ReturnType<typeof getBestSellers>; onPick: () => void }) {
  return (
    <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-4">
      {products.map((p, i) => (
        <motion.li
          key={p.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease, delay: i * 0.04 }}
        >
          <Link href={`/product/${p.slug}`} onClick={onPick} className="group block">
            <span className="bg-blush-soft relative block aspect-[3/4] overflow-hidden">
              <SmartImage
                src={p.colours[0].images[0].src}
                alt={p.colours[0].images[0].alt}
                fill
                sizes="(min-width: 640px) 22vw, 45vw"
                className="object-cover transition duration-700 group-hover:scale-105"
              />
            </span>
            <span className="group-hover:text-rose mt-3 block truncate text-sm">{p.name}</span>
            <Price price={p.price} salePrice={p.salePrice} className="text-ink-muted text-xs" />
          </Link>
        </motion.li>
      ))}
    </ul>
  );
}
