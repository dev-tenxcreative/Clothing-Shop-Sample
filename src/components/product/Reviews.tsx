"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { BadgeCheck, Star } from "lucide-react";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";
import type { Product } from "@/data/types";
import { productReviews } from "@/data/catalog";
import { Button } from "@/components/ui/Button";
import { Stars } from "@/components/ui/Bits";
import { Field, TextArea } from "@/components/ui/Form";
import { Modal } from "@/components/ui/Modal";
import { reviewSchema } from "@/lib/validation";
import { toast, useMounted, useRecentlyViewed } from "@/store";
import { getProductById } from "@/lib/products";
import { ProductCard } from "./ProductCard";
import { cn, seeded } from "@/lib/utils";

type Review = (typeof productReviews)[number];
type Values = z.infer<typeof reviewSchema>;

export function Reviews({ product }: { product: Product }) {
  const [extra, setExtra] = useState<Review[]>([]);
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<number | null>(null);

  // Deterministic distribution that matches the product's average rating.
  const breakdown = useMemo(() => {
    const r = seeded(product.reviewCount);
    const five = Math.round(product.reviewCount * (0.55 + (product.rating - 4.2) * 0.45));
    const four = Math.round((product.reviewCount - five) * (0.6 + r() * 0.15));
    const three = Math.round((product.reviewCount - five - four) * 0.6);
    const two = Math.round((product.reviewCount - five - four - three) * 0.6);
    const one = Math.max(0, product.reviewCount - five - four - three - two);
    return [five, four, three, two, one];
  }, [product]);

  const reviews = [...extra, ...productReviews].filter((rv) => (filter ? rv.rating === filter : true));

  return (
    <section id="reviews" className="border-line scroll-mt-32 border-t py-20 md:py-24" aria-labelledby="reviews-title">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <p className="eyebrow text-rose mb-4">Reviews</p>
          <h2 id="reviews-title" className="font-serif text-5xl">
            {product.rating.toFixed(1)}
            <span className="text-ink-muted text-2xl"> / 5</span>
          </h2>
          <div className="text-ink-muted mt-3 flex items-center gap-3 text-sm">
            <Stars rating={product.rating} size={16} /> {product.reviewCount + extra.length} reviews
          </div>
          <ul className="mt-8 space-y-2.5">
            {breakdown.map((count, i) => {
              const stars = 5 - i;
              const pct = (count / product.reviewCount) * 100;
              return (
                <li key={stars}>
                  <button
                    onClick={() => setFilter(filter === stars ? null : stars)}
                    aria-pressed={filter === stars}
                    className={cn("flex w-full items-center gap-3 text-xs transition", filter && filter !== stars ? "opacity-40" : "")}
                  >
                    <span className="w-10 text-left">{stars} star</span>
                    <span className="bg-line h-1.5 flex-1 overflow-hidden rounded-full">
                      <motion.span
                        className="bg-gold block h-full rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.08 }}
                      />
                    </span>
                    <span className="text-ink-muted w-8 text-right tabular-nums">{count}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="text-ink-soft mt-6 space-y-2 text-sm">
            <p>
              <span className="text-ink font-medium">Fit:</span> 86% say true to size
            </p>
            <p>
              <span className="text-ink font-medium">Quality:</span> rated 4.8 / 5
            </p>
          </div>
          <Button variant="outline" className="mt-8" onClick={() => setOpen(true)}>
            Write a review
          </Button>
        </div>

        <div className="lg:col-span-8">
          {filter && (
            <button onClick={() => setFilter(null)} className="text-ink-muted mb-6 text-xs underline underline-offset-4">
              Showing {filter}-star reviews · Show all
            </button>
          )}
          <ul className="divide-line divide-y">
            <AnimatePresence initial={false}>
              {reviews.map((rv) => (
                <motion.li
                  key={rv.name + rv.date}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="py-7 first:pt-0"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <Stars rating={rv.rating} />
                    <time className="text-ink-muted text-xs" dateTime={rv.date}>
                      {new Date(rv.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}
                    </time>
                  </div>
                  <h3 className="mt-3 font-sans text-[0.98rem] font-semibold">{rv.title}</h3>
                  <p className="text-ink-soft mt-2 text-[0.92rem] leading-relaxed">{rv.body}</p>
                  <p className="text-ink-muted mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
                    <span className="text-ink inline-flex items-center gap-1 font-medium">
                      {rv.name} <BadgeCheck className="text-sage-deep h-3.5 w-3.5" aria-label="Verified buyer" />
                    </span>
                    <span>Size bought: {rv.size}</span>
                    <span>Fit: {rv.fit}</span>
                  </p>
                </motion.li>
              ))}
            </AnimatePresence>
            {reviews.length === 0 && <li className="text-ink-muted py-10 text-sm">No {filter}-star reviews yet.</li>}
          </ul>
        </div>
      </div>

      <WriteReview
        open={open}
        onClose={() => setOpen(false)}
        productName={product.name}
        onSubmit={(v) => {
          setExtra((e) => [{ ...v, size: "—", fit: "True to size", date: new Date().toISOString().slice(0, 10) }, ...e]);
          setOpen(false);
          toast({ title: "Thank you for your review", description: "It's now live on this page." });
        }}
      />
    </section>
  );
}

function WriteReview({
  open,
  onClose,
  productName,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  productName: string;
  onSubmit: (v: Values) => void;
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<Values>({ resolver: zodResolver(reviewSchema), defaultValues: { rating: 0 } });
  const [hover, setHover] = useState(0);

  return (
    <Modal open={open} onClose={onClose} title="Write a review" width={560}>
      <form
        className="space-y-5 p-6"
        noValidate
        onSubmit={handleSubmit(async (v) => {
          // TODO: POST to your reviews API (e.g. Yotpo, Judge.me, or your backend).
          await new Promise((r) => setTimeout(r, 600));
          onSubmit(v);
          reset();
        })}
      >
        <p className="text-ink-soft text-sm">
          Reviewing <span className="text-ink font-medium">{productName}</span>
        </p>
        <Controller
          control={control}
          name="rating"
          render={({ field }) => (
            <fieldset>
              <legend className="mb-2 text-sm">Your rating</legend>
              <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    aria-label={`${n} star${n > 1 ? "s" : ""}`}
                    aria-pressed={field.value === n}
                    onMouseEnter={() => setHover(n)}
                    onClick={() => field.onChange(n)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <Star className={cn("h-7 w-7", (hover || field.value) >= n ? "fill-gold text-gold" : "text-sand")} strokeWidth={1.2} />
                  </button>
                ))}
              </div>
              {errors.rating && <p className="text-rose-deep mt-1 text-xs">{errors.rating.message}</p>}
            </fieldset>
          )}
        />
        <Field label="Your name" {...register("name")} error={errors.name?.message} />
        <Field label="Review title" {...register("title")} error={errors.title?.message} />
        <TextArea label="Your review" {...register("body")} error={errors.body?.message} />
        <Button type="submit" variant="dark" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit review"}
        </Button>
      </form>
    </Modal>
  );
}

export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const mounted = useMounted();
  const ids = useRecentlyViewed((s) => s.ids);
  if (!mounted) return null;
  const items = ids
    .filter((id) => id !== excludeId)
    .map(getProductById)
    .filter(Boolean)
    .slice(0, 4) as Product[];
  if (!items.length) return null;
  return (
    <section className="container-velora border-line border-t py-20">
      <p className="eyebrow text-rose mb-3">Picking up where you left off</p>
      <h2 className="mb-10 font-serif text-4xl md:text-5xl">Recently viewed</h2>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}
