"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Banknote, Check, ChevronDown, CreditCard, Loader2, Lock, Pencil, Truck, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { Checkbox, Field, SelectField } from "@/components/ui/Form";
import { SmartImage } from "@/components/ui/SmartImage";
import { PromoField, SummaryRows } from "@/components/layout/CartParts";
import { siteConfig } from "@/config/site";
import { addressSchema, contactStepSchema, DISTRICTS } from "@/lib/validation";
import { paymentService, type CardInput } from "@/lib/payment";
import { cn, deliveryWindow, formatPrice } from "@/lib/utils";
import { computeTotals, useCart } from "@/store/cart";
import { useCheckout } from "@/store/checkout";
import { useAccount, type Order } from "@/store/account";
import { useMounted } from "@/store";
import { CardForm, validateCard, type CardErrors } from "./CardForm";

const STEPS = ["Contact", "Shipping", "Delivery", "Payment", "Review"];

/** Human-friendly order reference. TODO: issue order numbers from your backend. */
function createOrderNumber() {
  return `VL-${String(Date.now()).slice(-6)}`;
}
const ease = [0.22, 1, 0.36, 1] as const;

function Progress({ step, onJump }: { step: number; onJump: (n: number) => void }) {
  return (
    <ol className="flex items-center" aria-label="Checkout progress">
      {STEPS.map((label, i) => {
        const done = i < step;
        const active = i === step;
        return (
          <li key={label} className="flex flex-1 items-center last:flex-none">
            <button
              onClick={() => done && onJump(i)}
              disabled={!done}
              aria-current={active ? "step" : undefined}
              className="group flex flex-col items-center gap-2 disabled:cursor-default"
            >
              <span
                className={cn(
                  "relative grid h-9 w-9 place-items-center rounded-full border text-xs font-semibold transition-colors duration-500",
                  done
                    ? "border-ink bg-ink text-ivory group-hover:bg-rose group-hover:border-rose"
                    : active
                      ? "border-ink text-ink"
                      : "border-line text-ink-muted",
                )}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
                {active && <motion.span layoutId="step-ring" className="border-rose/50 absolute -inset-1.5 rounded-full border" />}
              </span>
              <span
                className={cn(
                  "hidden text-[0.62rem] font-semibold tracking-[0.18em] uppercase sm:block",
                  active ? "text-ink" : "text-ink-muted",
                )}
              >
                {label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span className="bg-line mx-2 mb-0 h-px flex-1 sm:mb-6">
                <motion.span
                  className="bg-ink block h-px"
                  initial={false}
                  animate={{ width: done ? "100%" : "0%" }}
                  transition={{ duration: 0.6, ease }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function OrderSummary({ shipping }: { shipping: number }) {
  const items = useCart((s) => s.items);
  const promo = useCart((s) => s.promo);
  const [open, setOpen] = useState(false);
  const t = computeTotals(items, promo, shipping);
  const body = (
    <div className="space-y-6">
      <ul className="space-y-4">
        {items.map((i) => (
          <li key={i.key} className="flex gap-4">
            <span className="bg-blush-soft relative h-20 w-16 shrink-0 overflow-hidden">
              <SmartImage src={i.image} alt={i.imageAlt} fill sizes="64px" className="object-cover" />
              <span className="bg-ink text-ivory absolute -top-0 -right-0 grid h-5 min-w-5 place-items-center rounded-bl px-1 text-[0.6rem]">
                {i.quantity}
              </span>
            </span>
            <div className="min-w-0 flex-1 text-sm">
              <p className="truncate font-medium">{i.name}</p>
              <p className="text-ink-muted text-xs">
                {i.colour} · {i.size}
              </p>
            </div>
            <p className="text-sm">{formatPrice(i.price * i.quantity)}</p>
          </li>
        ))}
      </ul>
      <PromoField />
      <SummaryRows shipping={shipping} showShippingNote={false} />
    </div>
  );
  return (
    <aside aria-label="Order summary">
      {/* Mobile collapsible */}
      <div className="border-line bg-ivory-deep border-y lg:hidden">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="container-velora flex w-full items-center justify-between py-4 text-sm"
        >
          <span className="inline-flex items-center gap-2">
            {open ? "Hide" : "Show"} order summary <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")} />
          </span>
          <span className="font-serif text-xl">{formatPrice(t.total)}</span>
        </button>
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
              <div className="container-velora pb-6">{body}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="bg-ivory-deep hidden p-8 lg:sticky lg:top-8 lg:block">
        <h2 className="mb-6 font-serif text-3xl">Order summary</h2>
        {body}
        <p className="text-ink-muted mt-6 flex items-center gap-2 text-xs">
          <Lock className="h-3.5 w-3.5" /> Secure, encrypted checkout
        </p>
      </div>
    </aside>
  );
}

function StepShell({ title, children, subtitle }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.45, ease }}
    >
      <h2 className="font-serif text-4xl">{title}</h2>
      {subtitle && <p className="text-ink-soft mt-2 text-sm">{subtitle}</p>}
      <div className="mt-8">{children}</div>
    </motion.section>
  );
}

/* Steps ------------------------------------------------------------ */

function ContactStep({ onNext }: { onNext: () => void }) {
  const { contact, setContact } = useCheckout();
  const user = useAccount((s) => s.user);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof contactStepSchema>>({
    resolver: zodResolver(contactStepSchema),
    defaultValues: contact ?? { email: user?.email ?? "", phone: user?.phone ?? "", marketing: true },
  });
  return (
    <StepShell title="Contact" subtitle="Where should we send your order updates?">
      {!user && (
        <div className="border-line mb-8 flex flex-wrap items-center justify-between gap-3 border bg-white/40 p-4 text-sm">
          <span>Checking out as a guest.</span>
          <Link href="/account/login?next=/checkout" className="font-medium underline underline-offset-4">
            Sign in for faster checkout
          </Link>
        </div>
      )}
      <form
        noValidate
        className="grid gap-4"
        onSubmit={handleSubmit((v) => {
          setContact(v);
          onNext();
        })}
      >
        <Field label="Email address" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
        <Field
          label="Mobile number"
          type="tel"
          autoComplete="tel"
          placeholder=" "
          {...register("phone")}
          error={errors.phone?.message}
          hint="For delivery updates via SMS or WhatsApp"
        />
        <Checkbox label="Email me about new arrivals and private sales" {...register("marketing")} />
        <Button type="submit" variant="dark" size="lg" className="mt-4 w-full sm:w-auto sm:self-start">
          Continue to shipping
        </Button>
      </form>
    </StepShell>
  );
}

function ShippingStep({ onNext }: { onNext: () => void }) {
  const { shipping, setShipping, contact } = useCheckout();
  const { addresses, saveAddress, user } = useAccount();
  const def = addresses.find((a) => a.isDefault);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues:
      shipping ?? (def ? { ...def } : { phone: contact?.phone ?? "", firstName: user?.firstName ?? "", lastName: user?.lastName ?? "" }),
  });
  return (
    <StepShell title="Shipping address" subtitle="We deliver island-wide across Sri Lanka.">
      {addresses.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {addresses.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => reset({ ...a })}
              className="border-line hover:border-ink rounded-full border px-4 py-2 text-xs transition"
            >
              Use {a.label}: {a.line1}
            </button>
          ))}
        </div>
      )}
      <form
        noValidate
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={handleSubmit((v) => {
          setShipping(v);
          if (v.saveAddress && user) saveAddress({ label: "Home", ...v, isDefault: addresses.length === 0 });
          onNext();
        })}
      >
        <Field label="First name" autoComplete="given-name" {...register("firstName")} error={errors.firstName?.message} />
        <Field label="Last name" autoComplete="family-name" {...register("lastName")} error={errors.lastName?.message} />
        <Field
          className="sm:col-span-2"
          label="Street address"
          autoComplete="address-line1"
          {...register("line1")}
          error={errors.line1?.message}
        />
        <Field className="sm:col-span-2" label="Apartment, suite (optional)" autoComplete="address-line2" {...register("line2")} />
        <Field label="City / Town" autoComplete="address-level2" {...register("city")} error={errors.city?.message} />
        <SelectField label="District" options={DISTRICTS} {...register("district")} error={errors.district?.message} />
        <Field
          label="Postal code"
          inputMode="numeric"
          autoComplete="postal-code"
          {...register("postalCode")}
          error={errors.postalCode?.message}
        />
        <Field label="Phone for delivery" type="tel" autoComplete="tel" {...register("phone")} error={errors.phone?.message} />
        <Checkbox
          className="sm:col-span-2"
          label={user ? "Save this address to my account" : "Save this address for next time (sign in required)"}
          disabled={!user}
          {...register("saveAddress")}
        />
        <Button type="submit" variant="dark" size="lg" className="mt-4 w-full sm:col-span-2 sm:w-auto sm:justify-self-start">
          Continue to delivery
        </Button>
      </form>
    </StepShell>
  );
}

function DeliveryStep({ onNext }: { onNext: () => void }) {
  const { delivery, setDelivery } = useCheckout();
  const items = useCart((s) => s.items);
  const promo = useCart((s) => s.promo);
  const { standard, express } = siteConfig.commerce.delivery;
  const free = computeTotals(items, promo).qualifiesFree;
  const options = [
    { key: "standard" as const, icon: Truck, ...standard, price: free ? 0 : standard.price },
    { key: "express" as const, icon: Zap, ...express },
  ];
  return (
    <StepShell title="Delivery method" subtitle="All orders are packed by hand in our Colombo atelier.">
      <div className="grid gap-3" role="radiogroup" aria-label="Delivery method">
        {options.map((o) => (
          <button
            key={o.key}
            role="radio"
            aria-checked={delivery === o.key}
            onClick={() => setDelivery(o.key)}
            className={cn(
              "flex items-center gap-5 border p-5 text-left transition",
              delivery === o.key ? "border-ink bg-white/60" : "border-line hover:border-ink/50",
            )}
          >
            <span
              className={cn(
                "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                delivery === o.key ? "border-ink" : "border-ink/30",
              )}
            >
              {delivery === o.key && <motion.span layoutId="delivery-dot" className="bg-ink h-2.5 w-2.5 rounded-full" />}
            </span>
            <o.icon className="text-rose h-5 w-5 shrink-0" strokeWidth={1.4} />
            <span className="flex-1">
              <span className="block font-medium">{o.label}</span>
              <span className="text-ink-muted text-sm" suppressHydrationWarning>
                {o.minDays}–{o.maxDays} working days · arrives {deliveryWindow(o.minDays, o.maxDays)}
              </span>
            </span>
            <span className="text-sm font-medium">{o.price === 0 ? "Free" : formatPrice(o.price)}</span>
          </button>
        ))}
      </div>
      <Button variant="dark" size="lg" className="mt-8" onClick={onNext}>
        Continue to payment
      </Button>
    </StepShell>
  );
}

function PaymentStep({ onNext }: { onNext: () => void }) {
  const { paymentMethod, setPayment, cardSummary } = useCheckout();
  const [method, setMethod] = useState<"card" | "cod">(paymentMethod);
  // Raw card data lives only in this component's state and is discarded after tokenisation.
  const [card, setCard] = useState<CardInput>({ number: "", name: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<CardErrors>({});
  const [billingSame, setBillingSame] = useState(true);
  const [busy, setBusy] = useState(false);
  const [useSaved, setUseSaved] = useState(Boolean(cardSummary));

  const submit = async () => {
    if (method === "cod") {
      setPayment("cod", null);
      onNext();
      return;
    }
    if (useSaved && cardSummary) {
      onNext();
      return;
    }
    const e = validateCard(card);
    setErrors(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    try {
      const token = await paymentService.tokenizeCard(card);
      setPayment("card", { brand: token.brand, last4: token.last4, token: token.token });
      setCard({ number: "", name: "", expiry: "", cvv: "" });
      onNext();
    } finally {
      setBusy(false);
    }
  };

  const codFee = siteConfig.commerce.cashOnDelivery.fee;

  return (
    <StepShell title="Payment" subtitle="Choose how you’d like to pay. You won’t be charged until you place your order.">
      <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label="Payment method">
        {[
          { key: "card" as const, icon: CreditCard, label: "Credit / debit card", note: "Visa, Mastercard, Amex" },
          ...(siteConfig.commerce.cashOnDelivery.enabled
            ? [
                {
                  key: "cod" as const,
                  icon: Banknote,
                  label: "Cash on Delivery",
                  note: codFee ? `+ ${formatPrice(codFee)} handling` : "Pay when it arrives",
                },
              ]
            : []),
        ].map((m) => (
          <button
            key={m.key}
            role="radio"
            aria-checked={method === m.key}
            onClick={() => setMethod(m.key)}
            className={cn(
              "flex items-center gap-4 border p-5 text-left transition",
              method === m.key ? "border-ink bg-white/60" : "border-line hover:border-ink/50",
            )}
          >
            <m.icon className="text-rose h-5 w-5" strokeWidth={1.4} />
            <span>
              <span className="block font-medium">{m.label}</span>
              <span className="text-ink-muted text-xs">{m.note}</span>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {method === "card" ? (
          <motion.div key="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-8">
            {cardSummary && useSaved ? (
              <div className="border-line flex items-center justify-between border bg-white/50 p-5 text-sm">
                <span>
                  Using <span className="font-medium capitalize">{cardSummary.brand}</span> ending in{" "}
                  <span className="font-medium">{cardSummary.last4}</span>
                </span>
                <button onClick={() => setUseSaved(false)} className="underline underline-offset-4">
                  Use a different card
                </button>
              </div>
            ) : (
              <CardForm card={card} onChange={setCard} errors={errors} />
            )}
            <div className="mt-6">
              <Checkbox
                label="Billing address is the same as shipping"
                checked={billingSame}
                onChange={(e) => setBillingSame(e.currentTarget.checked)}
              />
              {!billingSame && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field className="sm:col-span-2" label="Billing street address" autoComplete="billing address-line1" />
                  <Field label="City" autoComplete="billing address-level2" />
                  <Field label="Postal code" autoComplete="billing postal-code" />
                </div>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="cod"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border-line text-ink-soft mt-8 border bg-white/50 p-6 text-sm"
          >
            Pay in cash when your order arrives. Please keep the exact amount ready — our courier will hand you a receipt. Available
            island-wide for orders up to {formatPrice(75000)}.
          </motion.div>
        )}
      </AnimatePresence>

      <Button variant="dark" size="lg" className="mt-8" onClick={submit} disabled={busy}>
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Securing card…
          </>
        ) : (
          "Review order"
        )}
      </Button>
    </StepShell>
  );
}

function ReviewSection({
  title,
  step,
  onEdit,
  children,
}: {
  title: string;
  step: number;
  onEdit: (n: number) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-line flex items-start justify-between gap-4 border-b py-5">
      <div>
        <p className="eyebrow text-ink-muted mb-2 text-[0.6rem]">{title}</p>
        <div className="text-sm leading-relaxed">{children}</div>
      </div>
      <button
        onClick={() => onEdit(step)}
        className="inline-flex items-center gap-1.5 text-xs underline underline-offset-4"
        aria-label={`Edit ${title}`}
      >
        <Pencil className="h-3 w-3" /> Edit
      </button>
    </div>
  );
}

function ReviewStep({ onEdit, shippingCost }: { onEdit: (n: number) => void; shippingCost: number }) {
  const router = useRouter();
  const { contact, shipping, delivery, paymentMethod, cardSummary, complete } = useCheckout();
  const { items, promo, clear } = useCart();
  const addOrder = useAccount((s) => s.addOrder);
  const [status, setStatus] = useState<"idle" | "processing" | "error">("idle");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const codFee = paymentMethod === "cod" ? siteConfig.commerce.cashOnDelivery.fee : 0;
  const t = computeTotals(items, promo, shippingCost);
  const opt = siteConfig.commerce.delivery[delivery];

  const place = async () => {
    if (!contact || !shipping) return;
    setStatus("processing");
    const orderId = createOrderNumber();
    const result = await paymentService.createPayment({
      orderId,
      amount: t.total + codFee,
      currency: siteConfig.commerce.currency,
      method: paymentMethod,
      customer: { email: contact.email, name: `${shipping.firstName} ${shipping.lastName}`, phone: contact.phone },
      card: cardSummary ? { token: cardSummary.token, brand: cardSummary.brand as never, last4: cardSummary.last4, expiry: "" } : undefined,
    });
    if (result.status === "failed") {
      setStatus("error");
      setMessage(result.message ?? "Payment failed. Please try again.");
      return;
    }
    const order: Order = {
      number: orderId,
      date: new Date().toISOString().slice(0, 10),
      status: "Placed",
      subtotal: t.subtotal,
      shipping: t.shipping + codFee,
      discount: t.discount,
      total: t.total + codFee,
      deliveryMethod: opt.label,
      paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : `${cardSummary?.brand ?? "Card"} •••• ${cardSummary?.last4 ?? ""}`,
      email: contact.email,
      address: {
        firstName: shipping.firstName,
        lastName: shipping.lastName,
        line1: shipping.line1,
        line2: shipping.line2,
        city: shipping.city,
        district: shipping.district,
        postalCode: shipping.postalCode,
        phone: shipping.phone,
      },
      lines: items.map((i) => ({
        name: i.name,
        slug: i.slug,
        colour: i.colour,
        size: i.size,
        quantity: i.quantity,
        price: i.price,
        image: i.image,
      })),
    };
    complete(order);
    addOrder(order);
    router.push(`/order-confirmation?order=${orderId}`);
    window.setTimeout(clear, 400);
  };

  return (
    <StepShell title="Review & place order" subtitle="Please check everything looks right.">
      <div className="border-line border-t">
        <ReviewSection onEdit={onEdit} title="Contact" step={0}>
          {contact?.email}
          <br />
          {contact?.phone}
        </ReviewSection>
        <ReviewSection onEdit={onEdit} title="Ship to" step={1}>
          {shipping?.firstName} {shipping?.lastName}
          <br />
          {shipping?.line1}
          {shipping?.line2 ? `, ${shipping.line2}` : ""}
          <br />
          {shipping?.city}, {shipping?.district} {shipping?.postalCode}
        </ReviewSection>
        <ReviewSection onEdit={onEdit} title="Delivery" step={2}>
          {opt.label} — {t.shipping === 0 ? "Free" : formatPrice(t.shipping)}
          <br />
          <span className="text-ink-muted" suppressHydrationWarning>
            Arrives {deliveryWindow(opt.minDays, opt.maxDays)}
          </span>
        </ReviewSection>
        <ReviewSection onEdit={onEdit} title="Payment" step={3}>
          {paymentMethod === "cod" ? (
            <>Cash on Delivery{codFee ? ` (+ ${formatPrice(codFee)} handling)` : ""}</>
          ) : (
            <span className="capitalize">
              {cardSummary?.brand} ending in {cardSummary?.last4}
            </span>
          )}
        </ReviewSection>
      </div>

      <div className="mt-6 flex items-baseline justify-between">
        <span className="text-ink-soft text-sm">Total to pay</span>
        <span className="font-serif text-4xl">{formatPrice(t.total + codFee)}</span>
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            role="alert"
            className="border-rose/40 bg-rose/10 text-rose-deep mt-6 flex items-start gap-3 border p-4 text-sm"
          >
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {message}
          </motion.p>
        )}
      </AnimatePresence>

      <Checkbox
        className="mt-6"
        checked={agree}
        onChange={(e) => setAgree(e.currentTarget.checked)}
        label={
          <>
            I agree to the{" "}
            <Link href="/terms" className="underline underline-offset-2">
              terms of sale
            </Link>{" "}
            and{" "}
            <Link href="/shipping-returns" className="underline underline-offset-2">
              returns policy
            </Link>
            .
          </>
        }
      />
      <Button
        variant="primary"
        size="lg"
        className="mt-6 w-full"
        onClick={place}
        disabled={!agree || status === "processing" || items.length === 0}
      >
        {status === "processing" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing securely…
          </>
        ) : (
          <>
            <Lock className="h-3.5 w-3.5" /> Place order · {formatPrice(t.total + codFee)}
          </>
        )}
      </Button>
      <p className="text-ink-muted mt-3 text-center text-xs">This is a demo store — no real payment will be taken.</p>
    </StepShell>
  );
}

/* Flow ------------------------------------------------------------- */

export function CheckoutFlow() {
  const mounted = useMounted();
  const { step, setStep, delivery, contact, shipping } = useCheckout();
  const items = useCart((s) => s.items);
  const promo = useCart((s) => s.promo);
  const t = computeTotals(items, promo);
  const shippingCost =
    delivery === "express" ? siteConfig.commerce.delivery.express.price : t.qualifiesFree ? 0 : siteConfig.commerce.delivery.standard.price;

  // Guard: don't allow skipping ahead past incomplete steps after a refresh.
  useEffect(() => {
    if (!mounted) return;
    if (step > 0 && !contact) setStep(0);
    else if (step > 1 && !shipping) setStep(1);
  }, [mounted, step, contact, shipping, setStep]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  if (!mounted) {
    return (
      <div className="container-velora py-20">
        <div className="skeleton h-[60vh]" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container-velora flex flex-col items-center py-32 text-center">
        <h1 className="font-serif text-5xl">Your bag is empty</h1>
        <p className="text-ink-soft mt-3 text-sm">Add a piece or two before checking out.</p>
        <Link
          href="/shop"
          className="bg-ink text-ivory mt-8 inline-flex h-12 items-center px-7 text-[0.72rem] font-semibold tracking-[0.2em] uppercase"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  const next = () => setStep(Math.min(STEPS.length - 1, step + 1));

  return (
    <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
      <div className="lg:border-line lg:col-span-7 lg:border-r">
        <div className="container-velora max-w-3xl! py-8 lg:py-12 lg:pr-14">
          <div className="mb-10 flex items-center justify-between">
            <Link href="/" aria-label="VELORA home">
              <Logo />
            </Link>
            <Link href="/cart" className="text-ink-muted hover:text-ink text-xs underline underline-offset-4">
              Back to bag
            </Link>
          </div>
          <Progress step={step} onJump={setStep} />
        </div>
        <div className="lg:hidden">
          <OrderSummary shipping={shippingCost} />
        </div>
        <div className="container-velora max-w-3xl! pt-4 pb-20 lg:pr-14">
          <AnimatePresence mode="wait">
            <div key={step}>
              {step === 0 && <ContactStep onNext={next} />}
              {step === 1 && <ShippingStep onNext={next} />}
              {step === 2 && <DeliveryStep onNext={next} />}
              {step === 3 && <PaymentStep onNext={next} />}
              {step === 4 && <ReviewStep onEdit={setStep} shippingCost={shippingCost} />}
            </div>
          </AnimatePresence>
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="text-ink-muted hover:text-ink mt-10 text-xs underline underline-offset-4">
              ← Back to {STEPS[step - 1].toLowerCase()}
            </button>
          )}
        </div>
      </div>
      <div className="hidden px-10 py-12 lg:col-span-5 lg:block">
        <OrderSummary shipping={shippingCost} />
      </div>
    </div>
  );
}
