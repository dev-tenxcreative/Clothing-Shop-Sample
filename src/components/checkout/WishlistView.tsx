"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import type { Product, Size } from "@/data/types";
import { addProductToCart } from "@/components/product/actions";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { Breadcrumbs, Price } from "@/components/ui/Bits";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { getBestSellers, getProductById } from "@/lib/products";
import { toast, useMounted, useWishlist } from "@/store";
import { cn } from "@/lib/utils";

function WishItem({ product }: { product: Product }) {
  const remove = useWishlist((s) => s.remove);
  const toggle = useWishlist((s) => s.toggle);
  const [size, setSize] = useState<Size | null>(null);
  const [error, setError] = useState(false);
  const img = product.colours[0].images[0];

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45 }}
      className="group relative"
    >
      <Link href={`/product/${product.slug}`} className="bg-blush-soft relative block aspect-[3/4] overflow-hidden" data-cursor="view">
        <SmartImage
          src={img.src}
          alt={img.alt}
          fill
          sizes="(min-width: 1024px) 25vw, 50vw"
          className="object-cover transition duration-1000 group-hover:scale-105"
        />
      </Link>
      <button
        onClick={() => {
          remove(product.id);
          toast({
            title: "Removed from wishlist",
            description: product.name,
            action: { label: "Undo", onClick: () => toggle(product.id) },
          });
        }}
        className="bg-ivory/90 hover:bg-ivory absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full transition"
        aria-label={`Remove ${product.name} from wishlist`}
      >
        <X className="h-4 w-4" />
      </button>
      <h3 className="mt-4 text-[0.9rem] font-medium">
        <Link href={`/product/${product.slug}`} className="hover:text-rose">
          {product.name}
        </Link>
      </h3>
      <Price price={product.price} salePrice={product.salePrice} className="text-ink-soft text-sm" />
      <div className={cn("mt-3 grid grid-cols-6 gap-1", error && "animate-pulse")} role="group" aria-label="Choose size">
        {product.sizes.map((s) => (
          <button
            key={s.size}
            disabled={s.stock === 0}
            onClick={() => {
              setSize(s.size);
              setError(false);
            }}
            aria-pressed={size === s.size}
            className={cn(
              "h-8 border text-[0.68rem] transition",
              size === s.size ? "border-ink bg-ink text-ivory" : error ? "border-rose/60" : "border-line hover:border-ink",
              "disabled:text-ink/25 disabled:line-through",
            )}
          >
            {s.size}
          </button>
        ))}
      </div>
      <button
        onClick={(e) => {
          if (!size) {
            setError(true);
            return;
          }
          const ok = addProductToCart(product, product.colours[0], size, 1, { fromEl: e.currentTarget.parentElement?.querySelector("a") });
          if (ok) remove(product.id);
        }}
        className="bg-ink text-ivory hover:bg-rose mt-2 flex h-11 w-full items-center justify-center gap-2 text-[0.66rem] font-semibold tracking-[0.18em] uppercase transition"
      >
        <ShoppingBag className="h-3.5 w-3.5" /> Move to bag
      </button>
    </motion.li>
  );
}

export function WishlistView() {
  const mounted = useMounted();
  const ids = useWishlist((s) => s.ids);
  const products = ids.map(getProductById).filter(Boolean) as Product[];

  return (
    <>
      <div className="container-velora pt-4 pb-20">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <h1 className="font-serif text-5xl md:text-7xl">
            Wishlist {mounted && products.length > 0 && <span className="text-ink-muted text-3xl md:text-4xl">({products.length})</span>}
          </h1>
          <p className="text-ink-muted text-sm">Saved on this device. Sign in to keep it everywhere.</p>
        </div>

        {!mounted ? (
          <div className="mt-12 grid grid-cols-2 gap-5 md:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="skeleton aspect-[3/4]" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <span className="bg-blush-soft grid h-24 w-24 place-items-center rounded-full">
              <Heart className="text-rose h-8 w-8" strokeWidth={1.2} />
            </span>
            <h2 className="mt-8 font-serif text-4xl">Nothing saved yet</h2>
            <p className="text-ink-soft mt-3 max-w-sm text-sm">Tap the heart on any piece to save it here for later.</p>
            <ButtonLink href="/shop" variant="dark" className="mt-8">
              Start exploring
            </ButtonLink>
          </div>
        ) : (
          <ul className="mt-12 grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-5 lg:grid-cols-4">
            <AnimatePresence>
              {products.map((p) => (
                <WishItem key={p.id} product={p} />
              ))}
            </AnimatePresence>
          </ul>
        )}
      </div>
      <ProductCarousel products={getBestSellers(8)} eyebrow="Most loved" title="Trending now" className="border-line border-t" />
    </>
  );
}
