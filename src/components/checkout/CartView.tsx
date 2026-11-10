"use client";

import { AnimatePresence } from "framer-motion";
import { Lock, ShoppingBag } from "lucide-react";
import { CartLine, FreeDeliveryBar, PromoField, SummaryRows } from "@/components/layout/CartParts";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { Breadcrumbs } from "@/components/ui/Bits";
import { ButtonLink } from "@/components/ui/Button";
import { PaymentIcons } from "@/components/ui/PaymentIcons";
import { getBestSellers, getCompleteTheLook, getProductById } from "@/lib/products";
import { computeTotals, useCart } from "@/store/cart";
import { useMounted } from "@/store";

export function CartView() {
  const mounted = useMounted();
  const { items, promo } = useCart();
  const totals = computeTotals(items, promo);

  if (!mounted) {
    return (
      <div className="container-velora py-10">
        <div className="skeleton h-16 w-64" />
        <div className="mt-10 grid gap-10 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            {[0, 1].map((i) => (
              <div key={i} className="skeleton h-[200px]" />
            ))}
          </div>
          <div className="skeleton h-80 lg:col-span-4" />
        </div>
      </div>
    );
  }

  const first = items[0] ? getProductById(items[0].productId) : undefined;
  const recs = (first ? getCompleteTheLook(first, 8) : getBestSellers(8)).filter((p) => !items.some((i) => i.productId === p.id));

  return (
    <>
      <div className="container-velora pt-4 pb-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Your bag" }]} />
        <h1 className="mt-6 font-serif text-5xl md:text-7xl">
          Your bag {totals.count > 0 && <span className="text-ink-muted text-3xl md:text-4xl">({totals.count})</span>}
        </h1>

        {items.length === 0 ? (
          <div className="flex flex-col items-center py-24 text-center">
            <span className="bg-blush-soft grid h-24 w-24 place-items-center rounded-full">
              <ShoppingBag className="text-rose h-8 w-8" strokeWidth={1.2} />
            </span>
            <h2 className="mt-8 font-serif text-4xl">Your bag is waiting</h2>
            <p className="text-ink-soft mt-3 max-w-sm text-sm">Nothing here yet. Explore new arrivals or revisit your wishlist.</p>
            <div className="mt-8 flex gap-3">
              <ButtonLink href="/new-in" variant="dark">
                Shop new in
              </ButtonLink>
              <ButtonLink href="/wishlist" variant="outline">
                View wishlist
              </ButtonLink>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <div className="border-line border-y py-5">
                <FreeDeliveryBar subtotal={totals.subtotal} />
              </div>
              <ul>
                <AnimatePresence initial={false}>
                  {items.map((i) => (
                    <CartLine key={i.key} item={i} />
                  ))}
                </AnimatePresence>
              </ul>
              <ButtonLink href="/shop" variant="link" className="mt-8">
                Continue shopping
              </ButtonLink>
            </div>
            <aside className="lg:col-span-4">
              <div className="bg-ivory-deep space-y-6 p-6 md:p-8 lg:sticky lg:top-28">
                <h2 className="font-serif text-3xl">Order summary</h2>
                <PromoField />
                <SummaryRows />
                <ButtonLink href="/checkout" variant="primary" size="lg" className="w-full">
                  <Lock className="h-3.5 w-3.5" /> Secure checkout
                </ButtonLink>
                <div className="flex flex-col items-center gap-3">
                  <PaymentIcons />
                  <p className="text-ink-muted text-center text-xs">Free returns within 14 days · Cash on Delivery available</p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
      <ProductCarousel products={recs} eyebrow="Pairs beautifully" title="You might also love" className="border-line border-t" />
    </>
  );
}
