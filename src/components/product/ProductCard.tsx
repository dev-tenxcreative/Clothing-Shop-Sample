"use client";

import Link from "next/link";
import { Eye, Plus } from "lucide-react";
import { useRef, useState } from "react";
import type { Product } from "@/data/types";
import { Badge, Price } from "@/components/ui/Bits";
import { SmartImage } from "@/components/ui/SmartImage";
import { useUI } from "@/store";
import { cn } from "@/lib/utils";
import { addProductToCart } from "./actions";
import { WishlistButton } from "./WishlistButton";

export function ProductCard({
  product,
  priority = false,
  sizes = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw",
  className,
}: {
  product: Product;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const [colourIndex, setColourIndex] = useState(0);
  const [quickAdd, setQuickAdd] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);
  const openQuickView = useUI((s) => s.openQuickView);

  const colour = product.colours[colourIndex];
  const primary = colour.images[0];
  const secondary = colour.images[1] ?? product.colours[0].images[1];
  const href = `/product/${product.slug}${colourIndex ? `?colour=${encodeURIComponent(colour.name)}` : ""}`;
  const badges = product.badges.filter((b) => b !== "Best seller").slice(0, 2);
  const soldOut = product.sizes.every((s) => s.stock === 0);

  return (
    <article className={cn("group/card relative", className)} onMouseLeave={() => setQuickAdd(false)}>
      <div ref={mediaRef} className="bg-blush-soft relative aspect-[3/4] overflow-hidden">
        <Link href={href} data-cursor="view" aria-label={product.name} className="absolute inset-0">
          <SmartImage
            src={primary.src}
            alt={primary.alt}
            fill
            sizes={sizes}
            preload={priority}
            loading={priority ? "eager" : "lazy"}
            className={cn(
              "object-cover transition-[opacity,transform] duration-[1.1s] ease-[var(--ease-velora)] group-hover/card:scale-[1.04]",
              secondary && "group-hover/card:opacity-0",
            )}
          />
          {secondary && (
            <SmartImage
              src={secondary.src}
              alt=""
              fill
              sizes={sizes}
              className="scale-[1.06] object-cover opacity-0 transition-[opacity,transform] duration-[1.1s] ease-[var(--ease-velora)] group-hover/card:scale-100 group-hover/card:opacity-100"
            />
          )}
        </Link>

        {badges.length > 0 && (
          <div className="pointer-events-none absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {badges.map((b) => (
              <Badge key={b}>{b}</Badge>
            ))}
          </div>
        )}

        <WishlistButton product={product} className="absolute top-3 right-3" />

        {/* Desktop quick actions */}
        <div className="absolute inset-x-3 bottom-3 hidden translate-y-3 opacity-0 transition-all duration-500 ease-[var(--ease-velora)] group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 group-hover/card:translate-y-0 group-hover/card:opacity-100 md:block">
          {quickAdd ? (
            <div className="bg-ivory/95 p-3 backdrop-blur" role="group" aria-label="Choose a size">
              <p className="eyebrow text-ink-muted mb-2 text-center text-[0.58rem]">Select size</p>
              <div className="grid grid-cols-6 gap-1">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => {
                      addProductToCart(product, colour, s.size, 1, { fromEl: mediaRef.current });
                      setQuickAdd(false);
                    }}
                    className="hover:bg-ink hover:text-ivory disabled:text-ink/25 h-8 text-[0.7rem] font-medium transition disabled:line-through disabled:hover:bg-transparent"
                    aria-label={`Add size ${s.size}${s.stock === 0 ? " (sold out)" : ""}`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setQuickAdd(true)}
                disabled={soldOut}
                className="bg-ivory/95 hover:bg-ink hover:text-ivory flex h-11 flex-1 items-center justify-center gap-2 text-[0.66rem] font-semibold tracking-[0.18em] uppercase backdrop-blur transition"
              >
                <Plus className="h-3.5 w-3.5" /> {soldOut ? "Sold out" : "Quick add"}
              </button>
              <button
                onClick={() => openQuickView(product.slug)}
                aria-label={`Quick view ${product.name}`}
                className="bg-ivory/95 hover:bg-ink hover:text-ivory grid h-11 w-11 place-items-center backdrop-blur transition"
              >
                <Eye className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>

        {/* Mobile quick add */}
        <button
          onClick={() => openQuickView(product.slug)}
          aria-label={`Quick add ${product.name}`}
          className="bg-ivory/90 absolute right-3 bottom-3 grid h-9 w-9 place-items-center rounded-full backdrop-blur md:hidden"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-sans text-[0.9rem] font-medium">
            <Link href={href} className="hover:text-rose transition-colors">
              {product.name}
            </Link>
          </h3>
          <p className="text-ink-soft mt-1 text-[0.85rem]">
            <Price price={product.price} salePrice={product.salePrice} />
          </p>
        </div>
      </div>

      {product.colours.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5" role="radiogroup" aria-label={`${product.name} colours`}>
          {product.colours.map((c, i) => (
            <button
              key={c.name}
              role="radio"
              aria-checked={i === colourIndex}
              aria-label={c.name}
              title={c.name}
              onClick={() => setColourIndex(i)}
              onMouseEnter={() => setColourIndex(i)}
              className={cn(
                "border-ink/15 ring-offset-ivory h-4 w-4 rounded-full border ring-offset-2 transition",
                i === colourIndex ? "ring-ink ring-1" : "hover:ring-ink/30 hover:ring-1",
              )}
              style={{ backgroundColor: c.hex }}
            />
          ))}
          {product.colours.length > 1 && <span className="text-ink-muted ml-1 text-[0.7rem]">{product.colours.length} colours</span>}
        </div>
      )}
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div aria-hidden>
      <div className="skeleton aspect-[3/4]" />
      <div className="skeleton mt-4 h-4 w-3/4" />
      <div className="skeleton mt-2 h-3 w-1/3" />
      <div className="mt-3 flex gap-1.5">
        <div className="skeleton h-4 w-4 rounded-full" />
        <div className="skeleton h-4 w-4 rounded-full" />
      </div>
    </div>
  );
}
