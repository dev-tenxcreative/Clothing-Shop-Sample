"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, LogOut, MapPin, Package, Plus, Trash2, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Checkbox, Field, SelectField } from "@/components/ui/Form";
import { Modal } from "@/components/ui/Modal";
import { SmartImage } from "@/components/ui/SmartImage";
import { addressSchema, DISTRICTS } from "@/lib/validation";
import { ORDER_STEPS, useAccount, type Order } from "@/store/account";
import { toast, useMounted, useWishlist } from "@/store";
import { cn, formatPrice } from "@/lib/utils";

const TABS = [
  { key: "orders", label: "Orders", icon: Package },
  { key: "profile", label: "Profile", icon: User },
  { key: "addresses", label: "Addresses", icon: MapPin },
  { key: "wishlist", label: "Wishlist", icon: Heart },
] as const;
type Tab = (typeof TABS)[number]["key"];

export function StatusTracker({ status }: { status: Order["status"] }) {
  const idx = ORDER_STEPS.indexOf(status);
  return (
    <ol className="flex items-start" aria-label={`Order status: ${status}`}>
      {ORDER_STEPS.map((s, i) => (
        <li key={s} className="flex flex-1 flex-col items-center text-center last:flex-none">
          <div className="flex w-full items-center">
            <span
              className={cn(
                "relative z-10 h-3 w-3 shrink-0 rounded-full border-2",
                i <= idx ? "border-ink bg-ink" : "border-line bg-ivory",
              )}
            >
              {i === idx && <span className="bg-rose/40 absolute -inset-1.5 animate-ping rounded-full" />}
            </span>
            {i < ORDER_STEPS.length - 1 && (
              <span className="bg-line h-[2px] flex-1">
                <motion.span
                  className="bg-ink block h-full"
                  initial={{ width: 0 }}
                  whileInView={{ width: i < idx ? "100%" : "0%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                />
              </span>
            )}
          </div>
          <span
            className={cn(
              "mt-2 -ml-8 w-16 text-[0.6rem] tracking-[0.12em] uppercase sm:w-20",
              i <= idx ? "text-ink" : "text-ink-muted",
              i === 0 && "ml-0 text-left",
              i === ORDER_STEPS.length - 1 && "-ml-14 text-right",
            )}
          >
            {s}
          </span>
        </li>
      ))}
    </ol>
  );
}

function Orders({ orders }: { orders: Order[] }) {
  const [open, setOpen] = useState<string | null>(orders[0]?.number ?? null);
  if (!orders.length) {
    return (
      <div className="border-line border p-10 text-center">
        <Package className="text-rose mx-auto h-8 w-8" strokeWidth={1.2} />
        <p className="mt-4 font-serif text-3xl">No orders yet</p>
        <p className="text-ink-soft mt-2 text-sm">When you place an order, you’ll track it here.</p>
        <ButtonLink href="/new-in" variant="dark" className="mt-6">
          Shop new in
        </ButtonLink>
      </div>
    );
  }
  return (
    <ul className="space-y-4">
      {orders.map((o) => (
        <li key={o.number} className="border-line border bg-white/40">
          <button
            onClick={() => setOpen(open === o.number ? null : o.number)}
            aria-expanded={open === o.number}
            className="flex w-full flex-wrap items-center justify-between gap-4 p-5 text-left"
          >
            <div>
              <p className="font-medium">Order {o.number}</p>
              <p className="text-ink-muted text-xs">
                Placed {new Date(o.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })} ·{" "}
                {o.lines.length} item{o.lines.length > 1 ? "s" : ""}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={cn(
                  "rounded-full px-3 py-1 text-[0.65rem] font-semibold tracking-[0.15em] uppercase",
                  o.status === "Delivered" ? "bg-sage/30 text-sage-deep" : "bg-blush-soft text-rose-deep",
                )}
              >
                {o.status}
              </span>
              <span className="font-serif text-xl">{formatPrice(o.total)}</span>
            </div>
          </button>
          <AnimatePresence initial={false}>
            {open === o.number && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="border-line space-y-6 border-t p-5">
                  <StatusTracker status={o.status} />
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {o.lines.map((l) => (
                      <li key={l.slug + l.size} className="flex gap-3">
                        <span className="bg-blush-soft relative h-20 w-16 shrink-0 overflow-hidden">
                          <SmartImage src={l.image} alt={l.name} fill sizes="64px" className="object-cover" />
                        </span>
                        <div className="text-sm">
                          <Link href={`/product/${l.slug}`} className="hover:text-rose font-medium">
                            {l.name}
                          </Link>
                          <p className="text-ink-muted text-xs">
                            {l.colour} · {l.size} · Qty {l.quantity}
                          </p>
                          <p className="text-xs">{formatPrice(l.price)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="text-ink-soft flex flex-wrap gap-x-8 gap-y-2 text-xs">
                    <span>Delivery: {o.deliveryMethod}</span>
                    <span>Payment: {o.paymentMethod}</span>
                    <span>
                      To: {o.address.line1}, {o.address.city}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toast({ title: "Return started", description: `We’ll email collection details for ${o.number}.` })}
                      disabled={o.status !== "Delivered"}
                    >
                      Return items
                    </Button>
                    <ButtonLink href="/contact" variant="ghost" size="sm">
                      Need help?
                    </ButtonLink>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </li>
      ))}
    </ul>
  );
}

function Profile() {
  const { user, updateProfile } = useAccount();
  const [first, setFirst] = useState(user?.firstName ?? "");
  const [last, setLast] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  return (
    <form
      className="grid max-w-xl gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        updateProfile({ firstName: first, lastName: last, phone });
        toast({ title: "Profile updated" });
      }}
    >
      <Field label="First name" value={first} onChange={(e) => setFirst(e.target.value)} />
      <Field label="Last name" value={last} onChange={(e) => setLast(e.target.value)} />
      <Field className="sm:col-span-2" label="Email" value={user?.email ?? ""} disabled hint="Contact us to change your email address." />
      <Field className="sm:col-span-2" label="Mobile number" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
      <Button type="submit" variant="dark" className="sm:col-span-2 sm:justify-self-start">
        Save changes
      </Button>
    </form>
  );
}

function Addresses() {
  const { addresses, saveAddress, removeAddress } = useAccount();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof addressSchema>>({ resolver: zodResolver(addressSchema) });
  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2">
        {addresses.map((a) => (
          <div key={a.id} className="border-line relative border bg-white/40 p-5 text-sm">
            {a.isDefault && <span className="eyebrow text-rose absolute top-4 right-4 text-[0.55rem]">Default</span>}
            <p className="font-medium">{a.label}</p>
            <p className="text-ink-soft mt-2 leading-relaxed">
              {a.firstName} {a.lastName}
              <br />
              {a.line1}
              <br />
              {a.city}, {a.district} {a.postalCode}
              <br />
              {a.phone}
            </p>
            <button
              onClick={() => removeAddress(a.id)}
              className="text-ink-muted hover:text-rose-deep mt-4 inline-flex items-center gap-1.5 text-xs"
            >
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        ))}
        <button
          onClick={() => setOpen(true)}
          className="border-ink/30 text-ink-soft hover:border-ink hover:text-ink flex min-h-40 flex-col items-center justify-center gap-2 border border-dashed text-sm transition"
        >
          <Plus className="h-5 w-5" /> Add a new address
        </button>
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title="New address" width={640}>
        <form
          noValidate
          className="grid gap-4 p-6 sm:grid-cols-2"
          onSubmit={handleSubmit((v) => {
            saveAddress({ label: addresses.length ? "Address" : "Home", ...v, isDefault: v.saveAddress });
            toast({ title: "Address saved" });
            reset();
            setOpen(false);
          })}
        >
          <Field label="First name" {...register("firstName")} error={errors.firstName?.message} />
          <Field label="Last name" {...register("lastName")} error={errors.lastName?.message} />
          <Field className="sm:col-span-2" label="Street address" {...register("line1")} error={errors.line1?.message} />
          <Field label="City / Town" {...register("city")} error={errors.city?.message} />
          <SelectField label="District" options={DISTRICTS} {...register("district")} error={errors.district?.message} />
          <Field label="Postal code" {...register("postalCode")} error={errors.postalCode?.message} />
          <Field label="Phone" type="tel" {...register("phone")} error={errors.phone?.message} />
          <Checkbox className="sm:col-span-2" label="Make this my default address" {...register("saveAddress")} />
          <Button type="submit" variant="dark" className="sm:col-span-2">
            Save address
          </Button>
        </form>
      </Modal>
    </div>
  );
}

export function Dashboard() {
  const mounted = useMounted();
  const router = useRouter();
  const { user, orders, logout } = useAccount();
  const wishCount = useWishlist((s) => s.ids.length);
  const [tab, setTab] = useState<Tab>("orders");

  useEffect(() => {
    if (mounted && !user) router.replace("/account/login?next=/account");
  }, [mounted, user, router]);

  if (!mounted || !user) {
    return (
      <div className="container-velora py-16">
        <div className="skeleton h-14 w-72" />
        <div className="skeleton mt-10 h-80" />
      </div>
    );
  }

  return (
    <div className="container-velora pt-6 pb-24">
      <div className="border-line flex flex-wrap items-end justify-between gap-6 border-b pb-10">
        <div>
          <p className="eyebrow text-rose mb-3">My account</p>
          <h1 className="font-serif text-5xl md:text-7xl">Hello, {user.firstName || "there"}.</h1>
          <p className="text-ink-soft mt-3 text-sm">{user.email} · Member of the VELORA Circle</p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            logout();
            toast({ title: "You’ve been signed out" });
            router.push("/");
          }}
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </Button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-12">
        <nav className="lg:col-span-3" aria-label="Account sections">
          <ul className="no-scrollbar flex gap-2 overflow-x-auto lg:flex-col lg:gap-1">
            {TABS.map((t) => (
              <li key={t.key}>
                {t.key === "wishlist" ? (
                  <Link
                    href="/wishlist"
                    className="text-ink-soft hover:bg-ink/5 hover:text-ink flex h-11 items-center gap-3 px-4 text-sm whitespace-nowrap transition"
                  >
                    <t.icon className="h-4 w-4" strokeWidth={1.5} /> {t.label} <span className="text-ink-muted">({wishCount})</span>
                  </Link>
                ) : (
                  <button
                    onClick={() => setTab(t.key)}
                    aria-current={tab === t.key ? "page" : undefined}
                    className={cn(
                      "flex h-11 w-full items-center gap-3 px-4 text-left text-sm whitespace-nowrap transition",
                      tab === t.key ? "bg-ink text-ivory" : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                    )}
                  >
                    <t.icon className="h-4 w-4" strokeWidth={1.5} /> {t.label}
                    {t.key === "orders" && <span className={tab === t.key ? "text-ivory/60" : "text-ink-muted"}>({orders.length})</span>}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>
        <div className="lg:col-span-9">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
            >
              <h2 className="mb-6 font-serif text-3xl capitalize">{tab === "orders" ? "Order history" : tab}</h2>
              {tab === "orders" && <Orders orders={orders} />}
              {tab === "profile" && <Profile />}
              {tab === "addresses" && <Addresses />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
