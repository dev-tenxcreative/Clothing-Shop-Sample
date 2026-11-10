"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Clock, Loader2, Mail, MapPin, MessageCircle, Phone, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { AccordionItem } from "@/components/ui/Accordion";
import { Button } from "@/components/ui/Button";
import { Field, SelectField, TextArea } from "@/components/ui/Form";
import { StatusTracker } from "@/components/account/Dashboard";
import { siteConfig } from "@/config/site";
import { faqs } from "@/data/catalog";
import { contactFormSchema, trackSchema } from "@/lib/validation";
import { useAccount, type Order } from "@/store/account";
import { cn, formatPrice } from "@/lib/utils";

/* Contact ---------------------------------------------------------- */

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof contactFormSchema>>({ resolver: zodResolver(contactFormSchema) });
  return (
    <AnimatePresence mode="wait">
      {sent ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-line border bg-white/50 p-10 text-center"
          role="status"
        >
          <span className="bg-sage/30 mx-auto grid h-14 w-14 place-items-center rounded-full">
            <Check className="text-sage-deep h-6 w-6" />
          </span>
          <p className="mt-5 font-serif text-3xl">Message received</p>
          <p className="text-ink-soft mt-2 text-sm">Thank you — our team replies within one working day (usually much sooner).</p>
          <button
            onClick={() => {
              reset();
              setSent(false);
            }}
            className="mt-6 text-sm underline underline-offset-4"
          >
            Send another message
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          exit={{ opacity: 0 }}
          noValidate
          className="grid gap-4 sm:grid-cols-2"
          onSubmit={handleSubmit(async () => {
            // TODO: send to your helpdesk (e.g. a Route Handler that emails or creates a ticket).
            await new Promise((r) => setTimeout(r, 900));
            setSent(true);
          })}
        >
          <Field label="Your name" autoComplete="name" {...register("name")} error={errors.name?.message} />
          <Field label="Email address" type="email" autoComplete="email" {...register("email")} error={errors.email?.message} />
          <SelectField
            label="Topic"
            options={["Order enquiry", "Returns & exchanges", "Sizing advice", "Product question", "Wholesale & press", "Something else"]}
            {...register("topic")}
            error={errors.topic?.message}
          />
          <Field label="Order number (optional)" {...register("order")} />
          <TextArea className="sm:col-span-2" label="How can we help?" {...register("message")} error={errors.message?.message} />
          <Button type="submit" variant="dark" size="lg" className="sm:col-span-2 sm:justify-self-start" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send message"}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}

export function ContactDetails() {
  const c = siteConfig.contact;
  const rows = [
    { icon: Phone, label: "Call us", value: c.phone, href: `tel:${c.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: c.email, href: `mailto:${c.email}` },
    { icon: MapPin, label: "Flagship store", value: c.address, href: "/stores" },
  ];
  return (
    <div className="space-y-8">
      <ul className="space-y-6">
        {rows.map((r) => (
          <li key={r.label} className="flex gap-4">
            <span className="bg-blush-soft grid h-11 w-11 shrink-0 place-items-center rounded-full">
              <r.icon className="text-rose h-4 w-4" strokeWidth={1.5} />
            </span>
            <div>
              <p className="eyebrow text-ink-muted text-[0.6rem]">{r.label}</p>
              <a href={r.href} className="hover:text-rose mt-1 block text-[0.98rem]">
                {r.value}
              </a>
            </div>
          </li>
        ))}
      </ul>
      <a
        href={`https://wa.me/${c.whatsapp}?text=${encodeURIComponent("Hi VELORA!")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 bg-[#25d366] px-6 py-4 text-sm font-semibold text-white transition hover:brightness-95"
      >
        <MessageCircle className="h-4 w-4" /> Chat on WhatsApp — usually replies in minutes
      </a>
      <div className="border-line border bg-white/40 p-6">
        <p className="mb-4 flex items-center gap-2 text-sm font-medium">
          <Clock className="text-rose h-4 w-4" strokeWidth={1.5} /> Opening hours
        </p>
        <dl className="space-y-2 text-sm">
          {c.hours.map((h) => (
            <div key={h.days} className="flex justify-between">
              <dt className="text-ink-soft">{h.days}</dt>
              <dd className="tabular-nums">{h.time}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

/** Stylised map placeholder — swap for Google Maps / Mapbox embed when you have an API key. */
export function MapPlaceholder({ label = "VELORA Ward Place" }: { label?: string }) {
  return (
    <div
      className="relative aspect-[16/9] overflow-hidden bg-[#efe8de]"
      role="img"
      aria-label={`Map showing ${label}, ${siteConfig.contact.address}`}
    >
      <svg viewBox="0 0 800 450" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <rect width="800" height="450" fill="#efe8de" />
        <path d="M-20 320 C 120 300 160 360 300 340 S 520 260 820 300" stroke="#cfe0e6" strokeWidth="60" fill="none" />
        {["M0 120 L800 80", "M0 220 L800 250", "M150 0 L190 450", "M420 0 L380 450", "M620 0 L680 450", "M0 40 L520 450"].map((d) => (
          <path key={d} d={d} stroke="#fffaf3" strokeWidth="14" fill="none" />
        ))}
        {[
          "M80 140 h40 v50 h-40z",
          "M230 130 h120 v70 h-120z",
          "M460 110 h110 v90 h-110z",
          "M700 120 h70 v80 h-70z",
          "M230 270 h90 v60 h-90z",
          "M470 270 h120 v30 h-120z",
        ].map((d) => (
          <path key={d} d={d} fill="#e3d8c8" />
        ))}
        <circle cx="560" cy="160" r="70" fill="#d9e3cf" />
      </svg>
      <motion.div
        className="absolute top-[42%] left-[50%] -translate-x-1/2 -translate-y-full"
        initial={{ y: -20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
      >
        <div className="flex flex-col items-center">
          <span className="bg-ink text-ivory px-3 py-1.5 text-xs whitespace-nowrap shadow-lg">{label}</span>
          <MapPin className="fill-rose text-ivory h-9 w-9" strokeWidth={1.2} />
        </div>
      </motion.div>
      <a
        href={`https://maps.google.com/?q=${encodeURIComponent(siteConfig.contact.address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-ivory hover:bg-ink hover:text-ivory absolute right-4 bottom-4 px-4 py-2 text-xs font-semibold tracking-[0.15em] uppercase shadow transition"
      >
        Open in Maps
      </a>
    </div>
  );
}

/* FAQ -------------------------------------------------------------- */

export function FaqSearch() {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState<string | null>(null);
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return faqs
      .filter((g) => !topic || g.topic === topic)
      .map((g) => ({ ...g, items: g.items.filter((i) => !term || `${i.q} ${i.a}`.toLowerCase().includes(term)) }))
      .filter((g) => g.items.length);
  }, [q, topic]);

  return (
    <div className="grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <label htmlFor="faq-search" className="sr-only">
            Search FAQs
          </label>
          <div className="border-ink flex items-center gap-3 border-b pb-3">
            <Search className="text-ink-muted h-5 w-5" strokeWidth={1.4} />
            <input
              id="faq-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search questions…"
              className="placeholder:text-ink/30 w-full bg-transparent font-serif text-2xl outline-none"
            />
          </div>
          <ul className="mt-8 space-y-1">
            {[null, ...faqs.map((f) => f.topic)].map((t) => (
              <li key={t ?? "all"}>
                <button
                  onClick={() => setTopic(t)}
                  aria-pressed={topic === t}
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-sm transition",
                    topic === t ? "bg-ink text-ivory" : "text-ink-soft hover:bg-ink/5",
                  )}
                >
                  {t ?? "All topics"}
                </button>
              </li>
            ))}
          </ul>
          <div className="bg-blush-soft mt-10 p-6 text-sm">
            <p className="font-serif text-2xl">Still need help?</p>
            <p className="text-ink-soft mt-2">Our team is here seven days a week.</p>
            <Link href="/contact" className="mt-4 inline-block font-semibold underline underline-offset-4">
              Contact us
            </Link>
          </div>
        </div>
      </div>
      <div className="lg:col-span-8" aria-live="polite">
        {filtered.length === 0 ? (
          <p className="text-ink-soft py-10">
            No answers match “{q}”. Try another word or{" "}
            <Link href="/contact" className="underline">
              ask us directly
            </Link>
            .
          </p>
        ) : (
          filtered.map((g) => (
            <section key={g.topic} className="mb-12">
              <h2 className="mb-2 font-serif text-3xl">{g.topic}</h2>
              <div className="border-line border-t">
                {g.items.map((i) => (
                  <AccordionItem key={i.q} title={i.q} defaultOpen={Boolean(q)}>
                    {i.a}
                  </AccordionItem>
                ))}
              </div>
            </section>
          ))
        )}
      </div>
    </div>
  );
}

/* Track order ------------------------------------------------------ */

export function TrackOrder() {
  const orders = useAccount((s) => s.orders);
  const [result, setResult] = useState<Order | "none" | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof trackSchema>>({ resolver: zodResolver(trackSchema) });

  return (
    <div className="mx-auto max-w-2xl">
      <form
        noValidate
        className="grid gap-4 sm:grid-cols-2"
        onSubmit={handleSubmit(async (v) => {
          // TODO: look up the order through your order-management API.
          await new Promise((r) => setTimeout(r, 700));
          const num = v.order.toUpperCase().replace(/^VL-?/, "VL-");
          const found = orders.find((o) => o.number === num);
          if (found) return setResult(found);
          // Demo fallback so the tracker can always be previewed.
          setResult({
            number: num,
            date: "2026-11-06",
            status: "Shipped",
            subtotal: 12900,
            shipping: 0,
            discount: 0,
            total: 12900,
            deliveryMethod: "Standard Delivery",
            paymentMethod: "Card",
            email: v.email,
            address: { firstName: "", lastName: "", line1: "", city: "Colombo", district: "Colombo", postalCode: "", phone: "" },
            lines: [],
          });
        })}
      >
        <Field label="Order number (e.g. VL-240918)" {...register("order")} error={errors.order?.message} />
        <Field label="Email used at checkout" type="email" {...register("email")} error={errors.email?.message} />
        <Button type="submit" variant="dark" size="lg" className="sm:col-span-2" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Track my order"}
        </Button>
      </form>
      <AnimatePresence>
        {result && result !== "none" && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border-line mt-12 border bg-white/50 p-6 md:p-8"
            role="status"
          >
            <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="eyebrow text-ink-muted text-[0.6rem]">Order</p>
                <p className="font-serif text-3xl">{result.number}</p>
              </div>
              <span className="bg-blush-soft text-rose-deep rounded-full px-4 py-1.5 text-xs font-semibold tracking-[0.15em] uppercase">
                {result.status}
              </span>
            </div>
            <StatusTracker status={result.status} />
            <p className="text-ink-soft mt-8 text-sm">
              {result.deliveryMethod} to {result.address.city}. {result.total ? `Order total ${formatPrice(result.total)}.` : ""} We’ll text
              you when it’s out for delivery.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
