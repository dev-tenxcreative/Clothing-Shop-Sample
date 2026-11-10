"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Ruler, Truck } from "lucide-react";
import { useState, type RefObject } from "react";
import type { Product, Size } from "@/data/types";
import { Button } from "@/components/ui/Button";
import { QuantityInput } from "@/components/ui/Bits";
import { siteConfig } from "@/config/site";
import { useUI } from "@/store";
import { cn, deliveryWindow } from "@/lib/utils";
import { addProductToCart } from "./actions";
import { WishlistButton } from "./WishlistButton";

export function ColourSelector({ product, value, onChange }: { product: Product; value: number; onChange: (i: number) => void }) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm">
        <span className="text-ink-muted">Colour:</span> <span className="font-medium">{product.colours[value].name}</span>
      </legend>
      <div className="flex flex-wrap gap-2.5">
        {product.colours.map((c, i) => (
          <button
            key={c.name}
            type="button"
            onClick={() => onChange(i)}
            aria-pressed={i === value}
            aria-label={c.name}
            title={c.name}
            className={cn(
              "border-ink/15 ring-offset-ivory h-9 w-9 rounded-full border ring-offset-[3px] transition",
              i === value ? "ring-ink ring-1" : "hover:ring-ink/30 hover:ring-1",
            )}
            style={{ backgroundColor: c.hex }}
          />
        ))}
      </div>
    </fieldset>
  );
}

export function SizeSelector({
  product,
  value,
  onChange,
  error,
}: {
  product: Product;
  value: Size | null;
  onChange: (s: Size) => void;
  error?: boolean;
}) {
  const openSizeGuide = useUI((s) => s.openSizeGuide);
  const selected = product.sizes.find((s) => s.size === value);
  return (
    <fieldset>
      <div className="mb-3 flex items-center justify-between">
        <legend className="text-sm">
          <span className="text-ink-muted">Size:</span> <span className="font-medium">{value ?? "Select a size"}</span>
        </legend>
        <button
          type="button"
          onClick={() => openSizeGuide(product.category)}
          className="text-ink-soft hover:text-ink inline-flex items-center gap-1.5 text-xs underline underline-offset-4"
        >
          <Ruler className="h-3.5 w-3.5" strokeWidth={1.5} /> Size guide
        </button>
      </div>
      <motion.div className="grid grid-cols-6 gap-2" animate={error ? { x: [0, -8, 8, -5, 5, 0] } : {}} transition={{ duration: 0.45 }}>
        {product.sizes.map((s) => (
          <button
            key={s.size}
            type="button"
            disabled={s.stock === 0}
            onClick={() => onChange(s.size)}
            aria-pressed={value === s.size}
            aria-label={`${s.size}${s.stock === 0 ? ", sold out" : s.stock <= siteConfig.commerce.lowStockThreshold ? `, only ${s.stock} left` : ""}`}
            className={cn(
              "relative h-12 border text-[0.8rem] font-medium transition",
              value === s.size ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink bg-white/40",
              s.stock === 0 && "text-ink/25 hover:border-line cursor-not-allowed",
              error && !value && "border-rose/60",
            )}
          >
            {s.size}
            {s.stock === 0 && <span aria-hidden className="bg-ink/25 absolute inset-0 m-auto h-px w-[70%] -rotate-[28deg]" />}
            {s.stock > 0 && s.stock <= siteConfig.commerce.lowStockThreshold && (
              <span aria-hidden className="bg-gold absolute top-1 right-1 h-1.5 w-1.5 rounded-full" />
            )}
          </button>
        ))}
      </motion.div>
      <p className="mt-2 min-h-5 text-xs" aria-live="polite">
        {error && !value ? (
          <span className="text-rose-deep">Please choose a size.</span>
        ) : selected && selected.stock <= siteConfig.commerce.lowStockThreshold ? (
          <span className="text-gold">
            Only {selected.stock} left in {selected.size} — order soon.
          </span>
        ) : selected ? (
          <span className="text-sage-deep">In stock and ready to ship.</span>
        ) : null}
      </p>
    </fieldset>
  );
}

export function PurchasePanel({
  product,
  colourIndex,
  onColourChange,
  mediaRef,
  compact = false,
  size,
  onSizeChange,
}: {
  product: Product;
  colourIndex: number;
  onColourChange: (i: number) => void;
  mediaRef?: RefObject<HTMLElement | null>;
  compact?: boolean;
  size: Size | null;
  onSizeChange: (s: Size) => void;
}) {
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [error, setError] = useState(false);
  const stock = product.sizes.find((s) => s.size === size)?.stock ?? 10;
  const { standard } = siteConfig.commerce.delivery;

  const add = (buyNow = false) => {
    if (!size) {
      setError(true);
      window.setTimeout(() => setError(false), 2200);
      return;
    }
    const ok = addProductToCart(product, product.colours[colourIndex], size, qty, {
      fromEl: buyNow ? null : (mediaRef?.current ?? null),
      openDrawer: !buyNow && !compact,
    });
    if (ok && buyNow) router.push("/checkout");
  };

  return (
    <div className="space-y-7">
      <ColourSelector product={product} value={colourIndex} onChange={onColourChange} />
      <SizeSelector
        product={product}
        value={size}
        onChange={(s) => {
          onSizeChange(s);
          setError(false);
        }}
        error={error}
      />

      <div className="flex items-stretch gap-3">
        <QuantityInput value={qty} onChange={(n) => setQty(Math.max(1, Math.min(Math.min(stock, 10), n)))} max={Math.min(stock, 10)} />
        <Button variant="dark" size="md" className="flex-1" onClick={() => add(false)}>
          Add to bag
        </Button>
        {!compact && <WishlistButton product={product} size="lg" className="rounded-none" />}
      </div>
      {!compact && (
        <Button variant="outline" size="md" className="w-full" onClick={() => add(true)}>
          Buy it now
        </Button>
      )}

      {!compact && (
        <div className="border-line flex items-start gap-3 border bg-white/40 p-4 text-sm">
          <Truck className="text-rose mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
          <p className="text-ink-soft">
            Order today for delivery{" "}
            <span suppressHydrationWarning className="text-ink font-medium">
              {deliveryWindow(standard.minDays, standard.maxDays)}
            </span>
            . Free delivery over Rs. {siteConfig.commerce.freeDeliveryThreshold.toLocaleString("en-LK")}.
          </p>
        </div>
      )}
    </div>
  );
}
