"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Leaf, RotateCcw, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
import type { Product, Size } from "@/data/types";
import { AccordionItem } from "@/components/ui/Accordion";
import { Badge, Price, Stars } from "@/components/ui/Bits";
import { Button } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { siteConfig } from "@/config/site";
import { discountPercent, totalStock } from "@/lib/products";
import { useRecentlyViewed } from "@/store";
import { formatPrice } from "@/lib/utils";
import { addProductToCart } from "./actions";
import { ProductGallery } from "./ProductGallery";
import { PurchasePanel } from "./PurchasePanel";

export function ProductDetail({ product }: { product: Product }) {
  // Initial colour can come from ?colour=Name (e.g. links from product cards).
  const urlColour = useSyncExternalStore(
    noopSubscribe,
    () =>
      Math.max(
        0,
        product.colours.findIndex((c) => c.name === new URLSearchParams(window.location.search).get("colour")),
      ),
    () => 0,
  );
  const [picked, setColour] = useState<number | null>(null);
  const colour = picked ?? urlColour;
  const [size, setSize] = useState<Size | null>(null);
  const [showSticky, setShowSticky] = useState(false);
  const mediaRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const push = useRecentlyViewed((s) => s.push);

  useEffect(() => {
    push(product.id);
  }, [product.id, push]);

  useEffect(() => {
    if (!panelRef.current) return;
    const io = new IntersectionObserver(([e]) => setShowSticky(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(panelRef.current);
    return () => io.disconnect();
  }, []);

  const stock = totalStock(product);
  const off = discountPercent(product);
  const images = product.colours[colour].images;

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="min-w-0 lg:col-span-7">
          <ProductGallery images={images} name={product.name} mediaRef={mediaRef} />
        </div>

        <div className="min-w-0 lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <div className="flex flex-wrap gap-1.5">
              {product.badges.map((b) => (
                <Badge key={b} className="border-line border">
                  {b}
                </Badge>
              ))}
            </div>
            <p className="eyebrow text-ink-muted mt-5">
              <Link href={`/shop/${product.category}`} className="hover:text-rose">
                {product.category}
              </Link>{" "}
              · {product.subcategory}
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-[1] md:text-5xl">{product.name}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
              <Price price={product.price} salePrice={product.salePrice} className="text-xl" />
              {off > 0 && <span className="text-rose-deep text-xs font-semibold">Save {off}%</span>}
              <a href="#reviews" className="text-ink-muted hover:text-ink flex items-center gap-2 text-sm">
                <Stars rating={product.rating} /> {product.rating} ({product.reviewCount} reviews)
              </a>
            </div>
            <p className="text-ink-soft mt-6 text-[0.95rem] leading-relaxed">{product.description}</p>
            <p className="mt-4 flex items-center gap-2 text-xs">
              <span className={`h-2 w-2 rounded-full ${stock > 20 ? "bg-sage-deep" : stock > 0 ? "bg-gold" : "bg-rose"}`} />
              {stock > 20 ? "In stock" : stock > 0 ? `Low stock — only ${stock} left across sizes` : "Sold out"}
            </p>

            <div ref={panelRef} className="mt-8">
              <PurchasePanel
                product={product}
                colourIndex={colour}
                onColourChange={setColour}
                size={size}
                onSizeChange={setSize}
                mediaRef={mediaRef}
              />
            </div>

            <div className="text-ink-soft mt-8 grid grid-cols-3 gap-3 text-center text-[0.7rem]">
              <div className="flex flex-col items-center gap-2">
                <RotateCcw className="text-rose h-4 w-4" strokeWidth={1.4} />
                {siteConfig.commerce.returnDays}-day returns
              </div>
              <div className="flex flex-col items-center gap-2">
                <ShieldCheck className="text-rose h-4 w-4" strokeWidth={1.4} />
                Secure checkout
              </div>
              <div className="flex flex-col items-center gap-2">
                <Leaf className="text-rose h-4 w-4" strokeWidth={1.4} />
                Responsibly made
              </div>
            </div>

            <div className="border-line mt-8 border-t">
              <AccordionItem title="Description" defaultOpen>
                <p>{product.description}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5">
                  {product.details.map((d) => (
                    <li key={d}>{d}</li>
                  ))}
                </ul>
              </AccordionItem>
              <AccordionItem title="Fabric & Care">
                <p className="text-ink font-medium">{product.fabric}</p>
                <ul className="mt-3 list-disc space-y-1 pl-5">
                  {product.care.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </AccordionItem>
              <AccordionItem title="Delivery & Returns">
                <p>
                  Standard delivery ({siteConfig.commerce.delivery.standard.minDays}–{siteConfig.commerce.delivery.standard.maxDays} working
                  days): {formatPrice(siteConfig.commerce.delivery.standard.price)}, free over{" "}
                  {formatPrice(siteConfig.commerce.freeDeliveryThreshold)}.
                </p>
                <p className="mt-2">
                  Express delivery ({siteConfig.commerce.delivery.express.minDays}–{siteConfig.commerce.delivery.express.maxDays} working
                  days): {formatPrice(siteConfig.commerce.delivery.express.price)}.
                </p>
                <p className="mt-2">
                  Free returns within {siteConfig.commerce.returnDays} days.{" "}
                  <Link href="/shipping-returns" className="underline underline-offset-2">
                    Read the full policy
                  </Link>
                  .
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky add-to-bag bar */}
      <AnimatePresence>
        {showSticky && (
          <motion.div
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="border-line bg-ivory/95 fixed inset-x-0 bottom-0 z-40 border-t backdrop-blur-xl"
          >
            <div className="container-velora flex items-center gap-4 py-3 pr-20 md:pr-40">
              <span className="bg-blush-soft relative hidden h-14 w-11 shrink-0 overflow-hidden sm:block">
                <SmartImage src={images[0].src} alt="" fill sizes="44px" className="object-cover" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{product.name}</p>
                <p className="text-ink-muted text-xs">
                  {product.colours[colour].name} · {size ? `Size ${size}` : "Select size"} ·{" "}
                  <Price price={product.price} salePrice={product.salePrice} />
                </p>
              </div>
              <div className="hidden gap-1 lg:flex">
                {product.sizes.map((s) => (
                  <button
                    key={s.size}
                    disabled={s.stock === 0}
                    onClick={() => setSize(s.size)}
                    aria-pressed={size === s.size}
                    className={`h-10 w-10 border text-xs transition ${size === s.size ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink"} disabled:text-ink/25 disabled:line-through`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
              <Button
                variant="dark"
                onClick={() => {
                  if (!size) {
                    panelRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                    return;
                  }
                  addProductToCart(product, product.colours[colour], size, 1, { openDrawer: true });
                }}
              >
                {size ? "Add to bag" : "Choose size"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
