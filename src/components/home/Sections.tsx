"use client";

import Link from "next/link";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Gem, Plus, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { NewsletterForm } from "@/components/ui/Newsletter";
import { SectionHeading, Price } from "@/components/ui/Bits";
import { ImageReveal, Reveal, RevealItem, SplitHeading, Stagger } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { ProductCard } from "@/components/product/ProductCard";
import { categories, collections } from "@/data/catalog";
import { atelierImages, lifestyleImages, pantsPool } from "@/data/images";
import type { Product } from "@/data/types";
import { siteConfig } from "@/config/site";
import { getProduct } from "@/lib/products";
import { useUI } from "@/store";
import { cn, formatPrice } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* 1. Marquee ------------------------------------------------------- */

export function Marquee({
  items = ["New season", "Frocks", "Blouses", "Skirts", "Dresses", "Pants", "The Linen Edit"],
  tone = "light",
}: {
  items?: string[];
  tone?: "light" | "rose";
}) {
  const row = (
    <div className="flex shrink-0 items-center gap-10 pr-10" aria-hidden>
      {items.map((t) => (
        <span key={t} className="flex items-center gap-10">
          <span className="font-serif text-4xl italic md:text-6xl">{t}</span>
          <span className="text-gold text-2xl">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <section
      aria-label={items.join(", ")}
      className={cn(
        "overflow-hidden border-y py-6 md:py-8",
        tone === "rose" ? "border-rose bg-rose text-ivory" : "border-line bg-ivory text-ink",
      )}
    >
      <div className="group animate-marquee flex w-max hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </section>
  );
}

/* 2. Shop by category -------------------------------------------- */

export function CategoryCards() {
  return (
    <section className="container-velora py-20 md:py-28">
      <SectionHeading
        eyebrow="Shop by category"
        title={
          <>
            Find your <em className="text-rose">silhouette</em>
          </>
        }
        action={
          <ButtonLink href="/shop" variant="link">
            Shop all
          </ButtonLink>
        }
      />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-6 md:gap-5">
        {categories.map((c, i) => (
          <Link
            key={c.slug}
            href={`/shop/${c.slug}`}
            data-cursor="view"
            className={cn(
              "group bg-blush-soft relative block overflow-hidden",
              i < 2 ? "col-span-1 aspect-[3/4] md:col-span-3 md:aspect-[4/3.6]" : "col-span-1 aspect-[3/4] md:col-span-2",
              i === 4 && "col-span-2 aspect-[16/10] md:col-span-2 md:aspect-[3/4]",
            )}
          >
            <ImageReveal className="absolute! inset-0" delay={i * 0.08}>
              <SmartImage
                src={c.card.src}
                alt={c.card.alt}
                fill
                sizes="(min-width: 768px) 50vw, 50vw"
                className="object-cover transition-transform duration-[1.6s] ease-[var(--ease-velora)] group-hover:scale-[1.07]"
              />
            </ImageReveal>
            <span className="from-ink/65 via-ink/5 absolute inset-0 bg-gradient-to-t to-transparent" />
            <div className="text-ivory absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-7">
              <div className="min-w-0">
                <span className="mb-2 hidden overflow-hidden md:block">
                  <span className="text-ivory/80 block translate-y-full text-[0.65rem] tracking-[0.25em] uppercase transition-transform duration-700 ease-[var(--ease-velora)] group-hover:translate-y-0">
                    {c.tagline}
                  </span>
                </span>
                <span className="block overflow-hidden">
                  <h3 className="font-serif text-3xl leading-none transition-transform duration-700 ease-[var(--ease-velora)] md:text-5xl">
                    {c.name}
                  </h3>
                </span>
              </div>
              <span className="border-ivory/50 group-hover:bg-ivory group-hover:text-ink grid h-11 w-11 shrink-0 place-items-center rounded-full border transition-all duration-500 group-hover:rotate-45">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* 4. Featured collection banner (parallax) ------------------------ */

export function FeaturedCollection({ slug = "the-linen-edit" }: { slug?: string }) {
  const c = collections.find((x) => x.slug === slug) ?? collections[0];
  const section = useRef<HTMLElement>(null);
  const img = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        img.current,
        { yPercent: -12 },
        { yPercent: 12, ease: "none", scrollTrigger: { trigger: section.current, start: "top bottom", end: "bottom top", scrub: true } },
      );
    }, section);
    return () => ctx.revert();
  }, []);
  return (
    <section ref={section} className="bg-ink text-ivory relative h-[90svh] min-h-[560px] overflow-hidden">
      <div ref={img} className="absolute inset-x-0 -inset-y-[14%]">
        <SmartImage src={c.image.src} alt={c.image.alt} fill sizes="100vw" className="object-cover" />
      </div>
      <div className="from-ink/70 via-ink/30 absolute inset-0 bg-gradient-to-r to-transparent" />
      <div className="container-velora relative flex h-full items-center">
        <div className="max-w-xl">
          <Reveal>
            <p className="eyebrow text-blush mb-5">{c.eyebrow} · Featured collection</p>
          </Reveal>
          <SplitHeading text={c.name} as="h2" className="font-serif text-6xl leading-[0.92] font-light md:text-8xl" />
          <Reveal delay={0.2}>
            <p className="text-ivory/85 mt-6 text-[1rem] leading-relaxed">{c.story}</p>
          </Reveal>
          <Reveal delay={0.3} className="mt-9 flex flex-wrap gap-3">
            <ButtonLink href={`/collections/${c.slug}`} variant="light" size="lg">
              Shop the edit
            </ButtonLink>
            <ButtonLink href="/lookbook" variant="outline" size="lg" className="border-ivory/60 text-ivory hover:bg-ivory hover:text-ink">
              View lookbook
            </ButtonLink>
          </Reveal>
        </div>
      </div>
      <div className="absolute right-8 bottom-8 hidden w-56 overflow-hidden lg:block">
        <ImageReveal className="aspect-[3/4]" delay={0.3}>
          <SmartImage src={c.secondary.src} alt={c.secondary.alt} fill sizes="224px" className="object-cover" />
        </ImageReveal>
      </div>
    </section>
  );
}

/* 5. Best sellers with tabs --------------------------------------- */

const TABS = [
  { key: "all", label: "All" },
  { key: "frocks", label: "Frocks" },
  { key: "dresses", label: "Dresses" },
  { key: "blouses", label: "Blouses" },
] as const;

export function BestSellers({ products }: { products: Product[] }) {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("all");
  const list = (tab === "all" ? products : products.filter((p) => p.category === tab)).slice(0, 8);
  return (
    <section className="container-velora py-20 md:py-28">
      <SectionHeading
        eyebrow="Most loved"
        title="Best sellers"
        description="The pieces our community reaches for again and again."
        action={
          <LayoutGroup id="bestseller-tabs">
            <div
              className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto px-4 md:mx-0 md:px-0"
              role="tablist"
              aria-label="Filter best sellers"
            >
              {TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={cn(
                    "relative h-10 shrink-0 rounded-full px-5 text-[0.7rem] font-semibold tracking-[0.18em] uppercase transition-colors",
                    tab === t.key ? "text-ivory" : "text-ink-soft hover:text-ink",
                  )}
                >
                  {tab === t.key && (
                    <motion.span
                      layoutId="tab-pill"
                      className="bg-ink absolute inset-0 rounded-full"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{t.label}</span>
                </button>
              ))}
            </div>
          </LayoutGroup>
        }
      />
      <motion.div layout className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5">
        <AnimatePresence mode="popLayout">
          {list.map((p, i) => (
            <motion.div
              key={p.id}
              layout
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: i * 0.04 }}
            >
              <ProductCard product={p} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      <div className="mt-14 flex justify-center">
        <ButtonLink href="/shop?sort=popular" variant="outline">
          Shop all best sellers
        </ButtonLink>
      </div>
    </section>
  );
}

/* 6. Shop the look ------------------------------------------------- */

const LOOK = {
  image: pantsPool[0],
  hotspots: [
    { slug: "clara-classic-poplin-shirt", x: 56, y: 40 },
    { slug: "theo-tailored-trousers", x: 50, y: 72 },
  ],
};

export function ShopTheLook() {
  const [active, setActive] = useState<number | null>(0);
  const openQuickView = useUI((s) => s.openQuickView);
  const items = LOOK.hotspots.map((h) => ({ ...h, product: getProduct(h.slug)! })).filter((h) => h.product);
  const total = items.reduce((s, i) => s + (i.product.salePrice ?? i.product.price), 0);

  return (
    <section className="bg-ivory-deep py-20 md:py-28">
      <div className="container-velora grid items-center gap-12 lg:grid-cols-12">
        <div className="relative lg:col-span-7">
          <ImageReveal className="bg-blush-soft aspect-[4/5]">
            <SmartImage src={LOOK.image.src} alt={LOOK.image.alt} fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" />
          </ImageReveal>
          {items.map((h, i) => (
            <div key={h.slug} className="absolute" style={{ left: `${h.x}%`, top: `${h.y}%` }}>
              <button
                onClick={() => setActive(active === i ? null : i)}
                onMouseEnter={() => setActive(i)}
                aria-label={`Show ${h.product.name}`}
                aria-expanded={active === i}
                className="relative -translate-x-1/2 -translate-y-1/2"
              >
                <span className="bg-ivory/70 absolute inset-0 animate-ping rounded-full" />
                <span
                  className={cn(
                    "bg-ivory text-ink relative grid h-9 w-9 place-items-center rounded-full shadow-lg transition-transform duration-300",
                    active === i && "scale-110 rotate-45",
                  )}
                >
                  <Plus className="h-4 w-4" />
                </span>
              </button>
              <AnimatePresence>
                {active === i && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.3 }}
                    className={cn(
                      "bg-ivory absolute top-6 z-10 w-56 p-3 shadow-2xl",
                      h.x > 50 ? "right-0" : "left-0",
                      "max-sm:-translate-x-1/3",
                    )}
                  >
                    <Link href={`/product/${h.product.slug}`} className="flex gap-3">
                      <span className="bg-blush-soft relative h-20 w-16 shrink-0 overflow-hidden">
                        <SmartImage src={h.product.colours[0].images[0].src} alt="" fill sizes="64px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm leading-snug font-medium">{h.product.name}</span>
                        <Price price={h.product.price} salePrice={h.product.salePrice} className="text-ink-soft mt-1 text-xs" />
                        <span className="text-rose mt-2 block text-[0.62rem] font-semibold tracking-[0.2em] uppercase">View piece →</span>
                      </span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
        <div className="lg:col-span-5">
          <Reveal>
            <p className="eyebrow text-rose mb-4">Shop the look</p>
            <h2 className="font-serif text-5xl leading-[0.95] md:text-7xl">
              Sharp, <em>soft</em>
              <br /> &amp; effortless
            </h2>
            <p className="text-ink-soft mt-6 max-w-md text-[0.95rem] leading-relaxed">
              A crisp poplin shirt and flared navy tailoring — the uniform for warm city days and long office hours. Tap the hotspots to
              explore each piece.
            </p>
          </Reveal>
          <ul className="divide-line border-line mt-10 divide-y border-y">
            {items.map((h, i) => (
              <li key={h.slug}>
                <button
                  onClick={() => openQuickView(h.slug)}
                  onMouseEnter={() => setActive(i)}
                  className="group flex w-full items-center gap-4 py-4 text-left"
                >
                  <span className="text-ink-muted font-serif text-xl">0{i + 1}</span>
                  <span className="flex-1">
                    <span className="group-hover:text-rose block font-medium transition-colors">{h.product.name}</span>
                    <span className="text-ink-muted text-sm">{h.product.colours[0].name}</span>
                  </span>
                  <Price price={h.product.price} salePrice={h.product.salePrice} className="text-sm" />
                  <span className="text-[0.62rem] font-semibold tracking-[0.2em] uppercase opacity-0 transition group-hover:opacity-100">
                    Quick add
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="text-ink-soft mt-6 text-sm">
            Complete look: <span className="text-ink font-medium">{formatPrice(total)}</span>
          </p>
        </div>
      </div>
    </section>
  );
}

/* 7. Brand story teaser ------------------------------------------- */

export function BrandStory() {
  return (
    <section className="container-velora grid items-center gap-12 py-20 md:py-32 lg:grid-cols-12 lg:gap-20">
      <div className="relative lg:col-span-6">
        <ImageReveal className="bg-blush-soft aspect-[4/5]">
          <SmartImage
            src={atelierImages.cutting.src}
            alt={atelierImages.cutting.alt}
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </ImageReveal>
        <div className="border-ivory absolute -right-4 -bottom-8 hidden w-[42%] border-8 md:block lg:-right-12">
          <ImageReveal className="bg-blush-soft aspect-[3/4]" delay={0.25}>
            <SmartImage src={atelierImages.spools.src} alt={atelierImages.spools.alt} fill sizes="260px" className="object-cover" />
          </ImageReveal>
        </div>
      </div>
      <div className="lg:col-span-6">
        <Reveal>
          <p className="eyebrow text-rose mb-5">Our story</p>
        </Reveal>
        <SplitHeading text="Made slowly, worn endlessly." className="font-serif text-5xl leading-[0.95] font-light md:text-7xl" />
        <Reveal delay={0.15}>
          <p className="text-ink-soft mt-8 max-w-lg text-[1rem] leading-relaxed">
            VELORA began in 2018 with a sketchbook, a secondhand sewing machine and a simple belief: that beautiful clothes should feel as
            good as they look. Today, our Colombo atelier of 34 makers still cuts and finishes every piece in small batches.
          </p>
        </Reveal>
        <Reveal delay={0.25} className="border-line mt-10 grid max-w-md grid-cols-3 gap-6 border-t pt-8">
          {[
            ["48k+", "Happy customers"],
            ["320", "Original designs"],
            ["8", "Years of craft"],
          ].map(([n, l]) => (
            <div key={l}>
              <p className="text-ink font-serif text-4xl">{n}</p>
              <p className="text-ink-muted mt-1 text-xs">{l}</p>
            </div>
          ))}
        </Reveal>
        <Reveal delay={0.35} className="mt-10">
          <ButtonLink href="/about" variant="dark">
            Read our story
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}

/* 8. Why VELORA ---------------------------------------------------- */

export function WhyVelora() {
  const items = [
    { icon: Gem, title: "Premium fabrics", body: "Linen, silk and organic cotton from mills we know by name." },
    {
      icon: Truck,
      title: "Free delivery",
      body: `Complimentary island-wide delivery over ${formatPrice(siteConfig.commerce.freeDeliveryThreshold)}.`,
    },
    {
      icon: RotateCcw,
      title: `Easy ${siteConfig.commerce.returnDays}-day returns`,
      body: "Changed your mind? We’ll collect it from your door, free.",
    },
    { icon: ShieldCheck, title: "Secure payment", body: "Encrypted checkout with cards or Cash on Delivery." },
  ];
  return (
    <section className="border-line bg-ivory border-y py-16 md:py-20">
      <Stagger className="container-velora grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, body }) => (
          <RevealItem key={title} className="group text-center">
            <span className="relative mx-auto grid h-16 w-16 place-items-center">
              <span className="bg-blush-soft absolute inset-0 rounded-full transition-transform duration-700 ease-[var(--ease-velora)] group-hover:scale-110" />
              <motion.span
                className="relative"
                initial={{ rotate: -20, scale: 0.6, opacity: 0 }}
                whileInView={{ rotate: 0, scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
              >
                <Icon className="text-rose h-6 w-6" strokeWidth={1.3} />
              </motion.span>
            </span>
            <h3 className="mt-5 font-sans text-[0.95rem] font-semibold">{title}</h3>
            <p className="text-ink-soft mx-auto mt-2 max-w-[240px] text-[0.85rem] leading-relaxed">{body}</p>
          </RevealItem>
        ))}
      </Stagger>
    </section>
  );
}

/* 10. Lookbook / Instagram grid ----------------------------------- */

export function LookbookGrid() {
  const imgs = [
    lifestyleImages.field,
    lifestyleImages.garden,
    lifestyleImages.road,
    lifestyleImages.bouquet,
    lifestyleImages.city,
    lifestyleImages.balcony,
    lifestyleImages.rocks,
    lifestyleImages.gowns,
  ];
  const ratios = [
    "aspect-[3/4]",
    "aspect-square",
    "aspect-[3/5]",
    "aspect-[4/5]",
    "aspect-[3/4]",
    "aspect-[4/5]",
    "aspect-square",
    "aspect-[3/4]",
  ];
  return (
    <section className="py-20 md:py-28">
      <div className="container-velora">
        <SectionHeading
          align="center"
          eyebrow="@velora.official"
          title={
            <>
              Worn by the <em className="text-rose">Circle</em>
            </>
          }
          description="Tag #WearVELORA to be featured. Tap any look to shop the edit."
        />
        <div className="columns-2 gap-3 md:columns-4 md:gap-5">
          {imgs.map((img, i) => (
            <Reveal key={img.src} delay={(i % 4) * 0.08} className="mb-3 break-inside-avoid md:mb-5">
              <Link href="/lookbook" className={cn("group bg-blush-soft relative block overflow-hidden", ratios[i])} data-cursor="view">
                <SmartImage
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-velora)] group-hover:scale-105"
                />
                <span className="bg-ink/0 group-hover:bg-ink/35 absolute inset-0 flex items-end p-4 opacity-0 transition-all duration-500 group-hover:opacity-100">
                  <span className="text-ivory flex w-full items-center justify-between">
                    <span className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase">Shop the look</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 11. Newsletter --------------------------------------------------- */

export function NewsletterSection() {
  return (
    <section className="bg-blush-soft relative overflow-hidden py-24 md:py-32">
      <motion.div
        aria-hidden
        className="bg-blush/60 pointer-events-none absolute -top-32 -right-32 h-[420px] w-[420px] rounded-full blur-3xl"
        animate={{ scale: [1, 1.15, 1], x: [0, -30, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="bg-sand/70 pointer-events-none absolute -bottom-40 -left-20 h-[380px] w-[380px] rounded-full blur-3xl"
        animate={{ scale: [1.1, 1, 1.1], y: [0, -20, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="container-velora relative grid items-end gap-12 lg:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow text-rose mb-5">The VELORA Circle</p>
          </Reveal>
          <SplitHeading
            text="Join the Circle — 10% off your first order"
            className="font-serif text-5xl leading-[0.95] font-light md:text-7xl"
          />
        </div>
        <Reveal delay={0.2}>
          <p className="text-ink-soft mb-8 max-w-md text-[0.95rem] leading-relaxed">
            Early access to new collections, private sale invitations and notes from the atelier. No noise — just the good things, twice a
            month.
          </p>
          <NewsletterForm variant="large" />
          <p className="text-ink-muted mt-4 text-xs">
            By subscribing you agree to our{" "}
            <Link href="/privacy-policy" className="underline underline-offset-2">
              privacy policy
            </Link>
            . Unsubscribe anytime.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
