"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Tag, Trash2, Truck, X } from "lucide-react";
import { useState } from "react";
import { QuantityInput } from "@/components/ui/Bits";
import { SmartImage } from "@/components/ui/SmartImage";
import { siteConfig } from "@/config/site";
import { computeTotals, useCart, type CartItem } from "@/store/cart";
import { toast, useWishlist } from "@/store";
import { cn, formatPrice } from "@/lib/utils";

export function FreeDeliveryBar({ subtotal }: { subtotal: number }) {
  const { freeDeliveryThreshold } = siteConfig.commerce;
  const remaining = Math.max(0, freeDeliveryThreshold - subtotal);
  const progress = Math.min(1, subtotal / freeDeliveryThreshold);
  return (
    <div>
      <p className="mb-2.5 flex items-center gap-2 text-[0.82rem]">
        <Truck className="text-rose h-4 w-4" strokeWidth={1.5} />
        {remaining > 0 ? (
          <span>
            You’re <strong className="font-semibold">{formatPrice(remaining)}</strong> away from free delivery
          </span>
        ) : (
          <span className="text-sage-deep font-medium">You’ve unlocked complimentary delivery</span>
        )}
      </p>
      <div
        className="bg-line h-[3px] w-full overflow-hidden rounded-full"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
        aria-label="Progress to free delivery"
      >
        <motion.div
          className={cn("h-full rounded-full", remaining > 0 ? "bg-rose" : "bg-sage-deep")}
          initial={false}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}

export function CartLine({ item, compact = false }: { item: CartItem; compact?: boolean }) {
  const { setQuantity, remove, undoRemove, close } = useCart();
  const toggleWish = useWishlist((s) => s.toggle);
  const hasWish = useWishlist((s) => s.ids.includes(item.productId));

  const onRemove = () => {
    remove(item.key);
    toast({ title: "Removed from your bag", description: item.name, action: { label: "Undo", onClick: undoRemove } });
  };
  const moveToWishlist = () => {
    if (!hasWish) toggleWish(item.productId);
    remove(item.key);
    toast({
      title: "Moved to wishlist",
      description: item.name,
      action: {
        label: "Undo",
        onClick: () => {
          undoRemove();
        },
      },
    });
  };

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -30, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="border-line flex gap-4 border-b py-5"
    >
      <Link
        href={`/product/${item.slug}`}
        onClick={close}
        className={cn(
          "bg-blush-soft relative shrink-0 overflow-hidden",
          compact ? "h-[120px] w-[92px]" : "h-[160px] w-[120px] md:h-[200px] md:w-[150px]",
        )}
      >
        <SmartImage src={item.image} alt={item.imageAlt} fill sizes="150px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/product/${item.slug}`} onClick={close} className="hover:text-rose block truncate text-[0.92rem] font-medium">
              {item.name}
            </Link>
            <p className="text-ink-muted mt-1 text-xs">
              {item.colour} · Size {item.size}
            </p>
          </div>
          <div className="text-right text-sm">
            <p className={cn(item.compareAt && "text-rose-deep")}>{formatPrice(item.price * item.quantity)}</p>
            {item.compareAt && <s className="text-ink-muted text-xs">{formatPrice(item.compareAt * item.quantity)}</s>}
          </div>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
          <QuantityInput
            size="sm"
            value={item.quantity}
            max={item.maxQuantity}
            onChange={(n) => setQuantity(item.key, n)}
            label={`Quantity of ${item.name}`}
          />
          <div className="text-ink-soft flex items-center gap-4 text-xs">
            <button onClick={moveToWishlist} className="hover:text-ink inline-flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5" strokeWidth={1.5} /> {compact ? "Save" : "Move to wishlist"}
            </button>
            <button onClick={onRemove} className="hover:text-rose-deep inline-flex items-center gap-1.5" aria-label={`Remove ${item.name}`}>
              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} /> {!compact && "Remove"}
            </button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function PromoField() {
  const { promo, applyPromo, removePromo } = useCart();
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  if (promo) {
    return (
      <div className="border-sage-deep/50 bg-sage/10 flex items-center justify-between border border-dashed px-4 py-3 text-sm">
        <span className="inline-flex items-center gap-2">
          <Tag className="text-sage-deep h-4 w-4" strokeWidth={1.5} />
          <strong className="font-semibold tracking-wide">{promo.code}</strong>
          <span className="text-ink-muted">— {promo.label}</span>
        </span>
        <button onClick={removePromo} aria-label="Remove promo code" className="text-ink-muted hover:text-ink">
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const r = applyPromo(code);
        setMsg({ ok: r.ok, text: r.message });
        if (r.ok) setCode("");
      }}
    >
      <label htmlFor="promo" className="sr-only">
        Promo code
      </label>
      <div className="flex">
        <input
          id="promo"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Promo code (try VELORA10)"
          className="border-line focus:border-ink h-11 min-w-0 flex-1 border border-r-0 bg-white/60 px-4 text-sm uppercase outline-none placeholder:normal-case"
        />
        <button
          type="submit"
          disabled={!code.trim()}
          className="border-ink bg-ink text-ivory hover:bg-rose hover:border-rose h-11 border px-5 text-[0.66rem] font-semibold tracking-[0.18em] uppercase transition disabled:opacity-40"
        >
          Apply
        </button>
      </div>
      {msg && (
        <p role="status" className={cn("mt-2 text-xs", msg.ok ? "text-sage-deep" : "text-rose-deep")}>
          {msg.text}
        </p>
      )}
    </form>
  );
}

export function SummaryRows({ shipping, showShippingNote = true }: { shipping?: number; showShippingNote?: boolean }) {
  const { items, promo } = useCart();
  const t = computeTotals(items, promo, shipping);
  return (
    <dl className="space-y-3 text-sm">
      <div className="flex justify-between">
        <dt className="text-ink-soft">Subtotal</dt>
        <dd>{formatPrice(t.subtotal)}</dd>
      </div>
      {t.savings > 0 && (
        <div className="text-rose-deep flex justify-between">
          <dt>Sale savings</dt>
          <dd>−{formatPrice(t.savings)}</dd>
        </div>
      )}
      {t.discount > 0 && (
        <div className="text-sage-deep flex justify-between">
          <dt>Promo ({promo?.code})</dt>
          <dd>−{formatPrice(t.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt className="text-ink-soft">Delivery</dt>
        <dd>{t.shipping === 0 ? "Complimentary" : formatPrice(t.shipping)}</dd>
      </div>
      {showShippingNote && shipping === undefined && <p className="text-ink-muted text-xs">Express delivery available at checkout.</p>}
      <div className="border-line flex items-baseline justify-between border-t pt-4">
        <dt className="font-medium">Total</dt>
        <dd className="font-serif text-2xl">{formatPrice(t.total)}</dd>
      </div>
    </dl>
  );
}
