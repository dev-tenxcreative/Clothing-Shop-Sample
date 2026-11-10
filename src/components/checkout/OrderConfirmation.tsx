"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Package, Truck } from "lucide-react";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { useCheckout } from "@/store/checkout";
import { useMounted } from "@/store";
import { formatPrice } from "@/lib/utils";

function AnimatedCheck() {
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28" aria-hidden>
      <motion.circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="var(--color-sage-deep)"
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
      <motion.circle
        cx="60"
        cy="60"
        r="46"
        fill="var(--color-sage)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 160 }}
        style={{ transformOrigin: "60px 60px" }}
      />
      <motion.path
        d="M38 62 L53 77 L84 45"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.8, ease: "easeOut" }}
      />
    </svg>
  );
}

export function OrderConfirmation() {
  const mounted = useMounted();
  const order = useCheckout((s) => s.lastOrder);

  if (!mounted)
    return (
      <div className="container-velora py-24">
        <div className="skeleton mx-auto h-[50vh] max-w-3xl" />
      </div>
    );

  if (!order) {
    return (
      <div className="container-velora flex flex-col items-center py-32 text-center">
        <h1 className="font-serif text-5xl">No recent order found</h1>
        <p className="text-ink-soft mt-3 text-sm">If you’ve just ordered, check your email for your confirmation.</p>
        <ButtonLink href="/shop" variant="dark" className="mt-8">
          Continue shopping
        </ButtonLink>
      </div>
    );
  }

  const steps = [
    { icon: Mail, title: "Confirmation sent", body: `A receipt is on its way to ${order.email}.` },
    { icon: Package, title: "Packed by hand", body: "Our atelier wraps every order in recycled tissue within 24 hours." },
    { icon: Truck, title: "On its way", body: `${order.deliveryMethod} — we’ll text you tracking details.` },
  ];

  return (
    <div className="container-velora max-w-4xl! py-12 md:py-20">
      <div className="flex flex-col items-center text-center">
        <AnimatedCheck />
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="eyebrow text-rose mt-8"
        >
          Order {order.number}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.8 }}
          className="mt-4 font-serif text-5xl leading-none md:text-7xl"
        >
          Thank you, {order.address.firstName}.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-ink-soft mt-5 max-w-md text-[0.98rem]"
        >
          Your order is confirmed and already being prepared in our Colombo atelier. We can’t wait for you to wear it.
        </motion.p>
      </div>

      <motion.ol
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="border-line mt-14 grid gap-6 border-y py-8 md:grid-cols-3"
      >
        {steps.map((s) => (
          <li key={s.title} className="flex gap-4">
            <s.icon className="text-rose mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.4} />
            <div>
              <p className="text-sm font-medium">{s.title}</p>
              <p className="text-ink-muted mt-1 text-xs leading-relaxed">{s.body}</p>
            </div>
          </li>
        ))}
      </motion.ol>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="mt-12 grid gap-10 md:grid-cols-2"
      >
        <div>
          <h2 className="mb-5 font-serif text-3xl">Order summary</h2>
          <ul className="space-y-4">
            {order.lines.map((l) => (
              <li key={`${l.slug}-${l.size}-${l.colour}`} className="flex gap-4">
                <span className="bg-blush-soft relative h-24 w-[72px] shrink-0 overflow-hidden">
                  <SmartImage src={l.image} alt={l.name} fill sizes="72px" className="object-cover" />
                </span>
                <div className="flex-1 text-sm">
                  <Link href={`/product/${l.slug}`} className="hover:text-rose font-medium">
                    {l.name}
                  </Link>
                  <p className="text-ink-muted text-xs">
                    {l.colour} · {l.size} · Qty {l.quantity}
                  </p>
                </div>
                <p className="text-sm">{formatPrice(l.price * l.quantity)}</p>
              </li>
            ))}
          </ul>
          <dl className="border-line mt-6 space-y-2 border-t pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-soft">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="text-sage-deep flex justify-between">
                <dt>Discount</dt>
                <dd>−{formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-ink-soft">Delivery</dt>
              <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
            </div>
            <div className="border-line flex justify-between border-t pt-3">
              <dt className="font-medium">Total</dt>
              <dd className="font-serif text-2xl">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>
        <div className="space-y-6 text-sm">
          <div className="bg-ivory-deep p-6">
            <p className="eyebrow text-ink-muted mb-3 text-[0.6rem]">Delivering to</p>
            <p>
              {order.address.firstName} {order.address.lastName}
              <br />
              {order.address.line1}
              <br />
              {order.address.city}, {order.address.district} {order.address.postalCode}
              <br />
              {order.address.phone}
            </p>
          </div>
          <div className="bg-ivory-deep p-6">
            <p className="eyebrow text-ink-muted mb-3 text-[0.6rem]">Payment</p>
            <p className="capitalize">{order.paymentMethod}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/account" variant="dark">
              Track in my account
            </ButtonLink>
            <ButtonLink href="/new-in" variant="outline">
              Keep shopping
            </ButtonLink>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
