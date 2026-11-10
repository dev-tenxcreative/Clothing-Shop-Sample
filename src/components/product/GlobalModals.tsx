"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { CategorySlug, Size } from "@/data/types";
import { columnLabels, measureGuide, sizeTables } from "@/data/sizes";
import { Modal } from "@/components/ui/Modal";
import { Price, Stars } from "@/components/ui/Bits";
import { SmartImage } from "@/components/ui/SmartImage";
import { getProduct } from "@/lib/products";
import { useUI } from "@/store";
import { cn } from "@/lib/utils";
import { PurchasePanel } from "./PurchasePanel";

export function QuickView() {
  const { quickViewSlug, openQuickView } = useUI();
  const product = quickViewSlug ? getProduct(quickViewSlug) : undefined;
  const [colour, setColour] = useState(0);
  const [size, setSize] = useState<Size | null>(null);
  const [img, setImg] = useState(0);
  const mediaRef = useRef<HTMLDivElement>(null);

  const [prevSlug, setPrevSlug] = useState(quickViewSlug);
  if (quickViewSlug !== prevSlug) {
    setPrevSlug(quickViewSlug);
    setColour(0);
    setSize(null);
    setImg(0);
  }

  const close = () => openQuickView(null);
  const images = product?.colours[colour].images ?? [];

  return (
    <Modal open={Boolean(product)} onClose={close} width={980} labelledBy="qv-title" placement="center">
      {product && (
        <div className="grid md:grid-cols-2">
          <div ref={mediaRef} className="bg-blush-soft relative aspect-[3/4] md:aspect-auto md:min-h-[600px]">
            {images[img] && (
              <SmartImage
                key={images[img].src}
                src={images[img].src}
                alt={images[img].alt}
                fill
                sizes="(min-width: 768px) 490px, 92vw"
                className="object-cover"
              />
            )}
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImg(i)}
                  aria-label={`Show image ${i + 1}`}
                  className={cn("h-1.5 rounded-full transition-all", i === img ? "bg-ink w-8" : "bg-ink/30 w-1.5")}
                />
              ))}
            </div>
          </div>
          <div className="p-6 md:p-10">
            <p className="eyebrow text-rose mb-3">{product.category}</p>
            <h2 id="qv-title" className="font-serif text-4xl leading-none">
              {product.name}
            </h2>
            <div className="mt-4 flex items-center gap-4 text-sm">
              <Price price={product.price} salePrice={product.salePrice} className="text-lg" />
              <span className="text-ink-muted flex items-center gap-2">
                <Stars rating={product.rating} /> ({product.reviewCount})
              </span>
            </div>
            <p className="text-ink-soft mt-5 text-sm leading-relaxed">{product.description}</p>
            <div className="mt-8">
              <PurchasePanel
                compact
                product={product}
                colourIndex={colour}
                onColourChange={(i) => {
                  setColour(i);
                  setImg(0);
                }}
                size={size}
                onSizeChange={setSize}
                mediaRef={mediaRef}
              />
            </div>
            <Link
              href={`/product/${product.slug}`}
              onClick={close}
              className="link-underline mt-8 inline-block pb-1 text-[0.7rem] font-semibold tracking-[0.2em] uppercase"
            >
              View full details
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}

export function SizeGuideTable({ category }: { category: CategorySlug }) {
  const t = sizeTables[category];
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <caption className="sr-only">{t.title} size chart in centimetres</caption>
          <thead>
            <tr className="border-ink/20 border-b">
              {t.columns.map((c) => (
                <th key={c} scope="col" className="eyebrow text-ink-muted py-3 pr-4 text-[0.6rem]">
                  {columnLabels[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r.size} className="border-line hover:bg-blush-soft/50 border-b transition-colors">
                {t.columns.map((c, i) =>
                  i === 0 ? (
                    <th key={c} scope="row" className="py-3 pr-4 font-medium">
                      {r[c]}
                    </th>
                  ) : (
                    <td key={c} className="text-ink-soft py-3 pr-4 tabular-nums">
                      {r[c] ?? "—"}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-ink-muted mt-3 text-xs">{t.note}</p>
    </div>
  );
}

export function SizeGuideModal() {
  const { sizeGuideCategory, openSizeGuide } = useUI();
  const [tab, setTab] = useState<CategorySlug>("frocks");
  const [prevCat, setPrevCat] = useState(sizeGuideCategory);
  if (sizeGuideCategory !== prevCat) {
    setPrevCat(sizeGuideCategory);
    if (sizeGuideCategory && sizeGuideCategory in sizeTables) setTab(sizeGuideCategory as CategorySlug);
  }

  return (
    <Modal
      open={Boolean(sizeGuideCategory)}
      onClose={() => openSizeGuide(null)}
      title="Size guide"
      placement="right"
      className="max-w-[640px]!"
    >
      <div className="flex-1 overflow-y-auto p-6" data-lenis-prevent>
        <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto" role="tablist" aria-label="Category">
          {(Object.keys(sizeTables) as CategorySlug[]).map((k) => (
            <button
              key={k}
              role="tab"
              aria-selected={tab === k}
              onClick={() => setTab(k)}
              className={cn(
                "h-9 shrink-0 rounded-full border px-4 text-xs capitalize transition",
                tab === k ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink",
              )}
            >
              {k}
            </button>
          ))}
        </div>
        <SizeGuideTable category={tab} />
        <h3 className="mt-10 font-serif text-2xl">How to measure</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-[140px_1fr]">
          <MeasureIllustration />
          <ul className="space-y-4">
            {measureGuide.map((m) => (
              <li key={m.title}>
                <p className="text-sm font-medium">{m.title}</p>
                <p className="text-ink-soft text-sm">{m.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/size-guide"
          onClick={() => openSizeGuide(null)}
          className="link-underline mt-8 inline-block pb-1 text-[0.7rem] font-semibold tracking-[0.2em] uppercase"
        >
          Full size guide
        </Link>
      </div>
    </Modal>
  );
}

/** Minimal line illustration of a dress form with measurement lines. */
export function MeasureIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 140 240"
      className={cn("text-ink h-auto w-full max-w-[160px]", className)}
      role="img"
      aria-label="Illustration showing where to measure bust, waist and hip"
    >
      <path d="M70 14c-8 0-12 6-12 12s4 10 12 10 12-4 12-10-4-12-12-12Z" fill="none" stroke="currentColor" strokeWidth="1" />
      <path d="M62 36v8M78 36v8" stroke="currentColor" strokeWidth="1" />
      <path
        d="M40 52c10-6 50-6 60 0l6 30c-4 10-6 18-8 28 6 14 12 36 14 70H28c2-34 8-56 14-70-2-10-4-18-8-28l6-30Z"
        fill="var(--color-blush-soft)"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path d="M70 180v46M58 226h24" stroke="currentColor" strokeWidth="1" />
      {[
        { y: 74, w: 66, label: "Bust" },
        { y: 108, w: 54, label: "Waist" },
        { y: 140, w: 72, label: "Hip" },
      ].map((l) => (
        <g key={l.label}>
          <ellipse cx="70" cy={l.y} rx={l.w / 2} ry="4" fill="none" stroke="var(--color-rose)" strokeDasharray="3 3" strokeWidth="1.2" />
          <text x="70" y={l.y - 7} textAnchor="middle" fontSize="8" fill="var(--color-rose-deep)" style={{ letterSpacing: "1px" }}>
            {l.label.toUpperCase()}
          </text>
        </g>
      ))}
    </svg>
  );
}
