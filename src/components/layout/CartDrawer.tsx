"use client";

import { AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { getBestSellers } from "@/lib/products";
import { computeTotals, useCart } from "@/store/cart";
import { useMounted } from "@/store";
import { SmartImage } from "@/components/ui/SmartImage";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { CartLine, FreeDeliveryBar, SummaryRows } from "./CartParts";

export function CartDrawer() {
  const { items, promo, isOpen, close } = useCart();
  const mounted = useMounted();
  const pathname = usePathname();
  const totals = computeTotals(items, promo);

  useEffect(() => close(), [pathname, close]);

  const suggestions = getBestSellers(6)
    .filter((p) => !items.some((i) => i.productId === p.id))
    .slice(0, 3);

  return (
    <Modal open={mounted && isOpen} onClose={close} placement="right" title={`Your bag${totals.count ? ` (${totals.count})` : ""}`}>
      {items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <span className="bg-blush-soft grid h-20 w-20 place-items-center rounded-full">
            <ShoppingBag className="text-rose h-7 w-7" strokeWidth={1.2} />
          </span>
          <p className="mt-6 font-serif text-3xl">Your bag is empty</p>
          <p className="text-ink-soft mt-2 text-sm">Let’s find something you’ll love.</p>
          <ButtonLink href="/new-in" variant="dark" className="mt-8" onClick={close}>
            Shop new in
          </ButtonLink>
          <div className="mt-12 w-full text-left">
            <p className="eyebrow text-ink-muted mb-4">Loved by the Circle</p>
            <ul className="grid grid-cols-3 gap-3">
              {suggestions.map((p) => (
                <li key={p.id}>
                  <Link href={`/product/${p.slug}`} onClick={close} className="group block">
                    <span className="bg-blush-soft relative block aspect-[3/4] overflow-hidden">
                      <SmartImage
                        src={p.colours[0].images[0].src}
                        alt={p.colours[0].images[0].alt}
                        fill
                        sizes="130px"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </span>
                    <span className="mt-2 block truncate text-xs">{p.name}</span>
                    <span className="text-ink-muted text-xs">{formatPrice(p.salePrice ?? p.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="border-line border-b px-6 py-4">
            <FreeDeliveryBar subtotal={totals.subtotal} />
          </div>
          <ul className="flex-1 overflow-y-auto px-6" data-lenis-prevent>
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <CartLine key={item.key} item={item} compact />
              ))}
            </AnimatePresence>
          </ul>
          <div className="border-line bg-ivory-deep/60 space-y-4 border-t px-6 py-5">
            <SummaryRows showShippingNote={false} />
            <div className="grid grid-cols-2 gap-3">
              <ButtonLink href="/cart" variant="outline" onClick={close}>
                View bag
              </ButtonLink>
              <ButtonLink href="/checkout" variant="primary" onClick={close}>
                Checkout
              </ButtonLink>
            </div>
            <p className="text-ink-muted text-center text-[0.7rem]">Secure checkout · Easy 14-day returns</p>
          </div>
        </>
      )}
    </Modal>
  );
}
