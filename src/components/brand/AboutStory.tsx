"use client";

import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { Droplets, Heart, Leaf, Recycle, Scissors, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Breadcrumbs } from "@/components/ui/Bits";
import { ImageReveal, Reveal, RevealItem, SplitHeading, Stagger } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { craftSteps, timeline } from "@/data/catalog";
import { atelierImages, boutiqueImages, lifestyleImages } from "@/data/images";

export function Counter({ to, suffix = "", duration = 2 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setValue(Math.round(v)) });
    return () => controls.stop();
  }, [inView, to, duration]);
  return (
    <span ref={ref} className="tabular-nums">
      {value.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <div ref={ref} className="relative mx-auto max-w-4xl">
      <div className="bg-line absolute top-0 bottom-0 left-4 w-px md:left-1/2" aria-hidden>
        <motion.div className="bg-rose w-px origin-top" style={{ height }} />
      </div>
      <ol className="space-y-16 md:space-y-24">
        {timeline.map((t, i) => (
          <motion.li
            key={t.year}
            className={`relative pl-14 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-16" : "md:pr-16 md:text-right"}`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className={`border-rose bg-ivory absolute top-3 left-[11px] h-3 w-3 rounded-full border-2 md:top-4 ${i % 2 ? "md:-left-[6.5px]" : "md:-right-[6.5px] md:left-auto"}`}
              aria-hidden
            />
            <p className="text-rose/80 font-serif text-6xl md:text-7xl">{t.year}</p>
            <h3 className="mt-2 font-sans text-lg font-semibold">{t.title}</h3>
            <p className="text-ink-soft mt-2 text-[0.95rem] leading-relaxed">{t.body}</p>
          </motion.li>
        ))}
      </ol>
    </div>
  );
}

export function AboutStory() {
  const values = [
    {
      icon: Heart,
      title: "Made with care",
      body: "Every piece is cut, sewn and finished by people we know by name — paid fairly, in a studio filled with light.",
    },
    {
      icon: Sparkles,
      title: "Quietly beautiful",
      body: "We design for the long term: considered silhouettes and details that feel special without shouting.",
    },
    {
      icon: Leaf,
      title: "Kind to the earth",
      body: "Natural, certified and recycled fibres, small batches and zero-waste cutting wherever we can.",
    },
  ];
  const sustain = [
    { icon: Leaf, stat: 80, suffix: "%", label: "natural, certified or recycled fibres" },
    { icon: Scissors, stat: 92, suffix: "%", label: "of offcuts reused or recycled" },
    { icon: Recycle, stat: 100, suffix: "%", label: "plastic-free, recycled packaging" },
    { icon: Droplets, stat: 40, suffix: "%", label: "less water with garment-washed linen" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="container-velora pt-6 pb-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Our Story" }]} />
        <div className="mt-10 grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="eyebrow text-rose mb-5">Our Story · Est. 2018, Colombo</p>
            </Reveal>
            <SplitHeading
              as="h1"
              text="Clothes made slowly, for lives lived fully."
              className="font-serif text-6xl leading-[0.9] font-light md:text-[7rem]"
            />
          </div>
          <Reveal delay={0.2} className="lg:col-span-5">
            <p className="text-ink-soft text-[1.05rem] leading-relaxed">
              VELORA is a modern womenswear label designed and made in Sri Lanka. We create frocks, blouses, skirts, pants and dresses for
              everyday elegance — pieces that feel effortless on a Tuesday and unforgettable on a Saturday night.
            </p>
          </Reveal>
        </div>
        <ImageReveal className="bg-blush-soft mt-14 aspect-[16/9] md:aspect-[21/9]">
          <SmartImage
            src={atelierImages.workshop.src}
            alt={atelierImages.workshop.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover"
          />
        </ImageReveal>
      </section>

      {/* Founding story */}
      <section className="container-velora grid gap-12 py-16 md:py-24 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <ImageReveal className="bg-blush-soft aspect-[3/4]">
            <SmartImage
              src={atelierImages.sketching.src}
              alt={atelierImages.sketching.alt}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
          </ImageReveal>
        </div>
        <div className="flex flex-col justify-center lg:col-span-6 lg:col-start-7">
          <Reveal>
            <p className="eyebrow text-rose mb-5">How it began</p>
          </Reveal>
          <SplitHeading
            text="A sketchbook, a sewing machine and a stubborn idea."
            className="font-serif text-4xl leading-[1] md:text-6xl"
          />
          <Reveal delay={0.15} className="text-ink-soft mt-8 space-y-5 text-[1rem] leading-relaxed">
            <p>
              In 2018, our founder Nethmi Perera couldn’t find the clothes she wanted to wear: pieces as comfortable in Colombo’s heat as
              they were polished enough for the office and pretty enough for a wedding. So she began making them — first for herself, then
              for friends, then for friends of friends.
            </p>
            <p>
              The first VELORA collection was twelve linen and cotton frocks, sewn on a secondhand machine in a spare room. It sold out at a
              weekend pop-up in nine days. Eight years later, we’re a team of 34 makers and designers — but every piece still begins the
              same way, with a pencil sketch and a question: <em className="text-ink">will she love wearing this?</em>
            </p>
          </Reveal>
        </div>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-ink text-ivory py-20 md:py-28">
        <div className="container-velora">
          <div className="grid gap-12 md:grid-cols-2">
            <Reveal>
              <p className="eyebrow text-blush mb-4">Our mission</p>
              <p className="font-serif text-3xl leading-snug md:text-4xl">
                To make beautiful, well-made clothing that helps every woman feel at ease in her own skin — and to do it responsibly.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="eyebrow text-blush mb-4">Our vision</p>
              <p className="font-serif text-3xl leading-snug md:text-4xl">
                A wardrobe of fewer, better pieces — designed in Sri Lanka, loved around the world, and worn for years, not seasons.
              </p>
            </Reveal>
          </div>
          <Stagger className="border-ivory/15 mt-20 grid gap-10 border-t pt-14 md:grid-cols-3">
            {values.map((v) => (
              <RevealItem key={v.title}>
                <v.icon className="text-blush h-6 w-6" strokeWidth={1.3} />
                <h3 className="mt-5 font-sans text-lg font-semibold">{v.title}</h3>
                <p className="text-ivory/70 mt-2 text-[0.95rem] leading-relaxed">{v.body}</p>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Stats */}
      <section className="container-velora py-20 md:py-28">
        <div className="grid grid-cols-2 gap-y-12 md:grid-cols-4">
          {[
            { n: 48000, s: "+", l: "Happy customers" },
            { n: 320, s: "", l: "Original designs" },
            { n: 34, s: "", l: "Makers in our atelier" },
            { n: 8, s: "", l: "Years of craft" },
          ].map((x) => (
            <div key={x.l} className="text-center">
              <p className="font-serif text-6xl md:text-7xl">
                <Counter to={x.n} suffix={x.s} />
              </p>
              <p className="text-ink-muted mt-2 text-sm">{x.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="border-line bg-ivory-deep border-t py-20 md:py-28">
        <div className="container-velora">
          <div className="mb-16 text-center">
            <p className="eyebrow text-rose mb-4">Our journey</p>
            <SplitHeading text="Eight years, stitch by stitch" className="font-serif text-5xl md:text-6xl" />
          </div>
          <Timeline />
        </div>
      </section>

      {/* Craftsmanship process */}
      <section className="container-velora py-20 md:py-28">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow text-rose mb-4">Craftsmanship</p>
          <SplitHeading text="From sketch to you" className="font-serif text-5xl md:text-7xl" />
          <Reveal delay={0.1}>
            <p className="text-ink-soft mt-5 text-[0.98rem] leading-relaxed">
              Five steps, no shortcuts. Here’s how every VELORA piece is made.
            </p>
          </Reveal>
        </div>
        <ol className="grid gap-6 md:grid-cols-5">
          {craftSteps.map((s, i) => (
            <Reveal key={s.title} as="li" delay={i * 0.1} className="group">
              <div className="bg-blush-soft relative aspect-[3/4] overflow-hidden">
                <SmartImage
                  src={s.image.src}
                  alt={s.image.alt}
                  fill
                  sizes="(min-width: 768px) 20vw, 100vw"
                  className="object-cover transition duration-[1.2s] group-hover:scale-105"
                />
                <span className="bg-ivory absolute top-3 left-3 grid h-9 w-9 place-items-center rounded-full font-serif text-lg">
                  {i + 1}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-3xl">{s.title}</h3>
              <p className="text-ink-soft mt-2 text-sm leading-relaxed">{s.body}</p>
              {i < craftSteps.length - 1 && (
                <span className="text-rose mt-4 hidden md:block" aria-hidden>
                  →
                </span>
              )}
            </Reveal>
          ))}
        </ol>
      </section>

      {/* Atelier & team */}
      <section className="bg-ivory-deep py-20 md:py-28">
        <div className="container-velora grid gap-4 md:grid-cols-12">
          <div className="flex flex-col justify-end md:col-span-4">
            <p className="eyebrow text-rose mb-4">The atelier</p>
            <SplitHeading text="Meet the hands behind every hem" className="font-serif text-4xl leading-[1] md:text-5xl" />
            <Reveal delay={0.1}>
              <p className="text-ink-soft mt-5 text-[0.95rem] leading-relaxed">
                Our Ward Place studio is home to pattern-makers, cutters, seamstresses and finishers — many of whom have been with us since
                the very first collection.
              </p>
            </Reveal>
          </div>
          <ImageReveal className="bg-blush-soft aspect-[4/5] md:col-span-4">
            <SmartImage
              src={atelierImages.fitting.src}
              alt={atelierImages.fitting.alt}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </ImageReveal>
          <div className="grid gap-4 md:col-span-4">
            <ImageReveal className="bg-blush-soft aspect-[4/3]" delay={0.1}>
              <SmartImage
                src={atelierImages.machine.src}
                alt={atelierImages.machine.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </ImageReveal>
            <ImageReveal className="bg-blush-soft aspect-[4/3]" delay={0.2}>
              <SmartImage
                src={atelierImages.redDress.src}
                alt={atelierImages.redDress.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover"
              />
            </ImageReveal>
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="container-velora grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow text-sage-deep mb-4">Sustainability commitment</p>
          <SplitHeading text="Fewer, better, kinder." className="font-serif text-5xl leading-[0.95] md:text-7xl" />
          <Reveal delay={0.1}>
            <p className="text-ink-soft mt-6 text-[0.98rem] leading-relaxed">
              We make in small batches to avoid overproduction, choose fibres that are natural, certified or recycled, and repair what we
              can. By 2028 we’re committed to 100% traceable fabrics and a take-back programme for every piece we sell.
            </p>
          </Reveal>
          <ButtonLink href="/shop" variant="dark" className="mt-8">
            Shop responsibly made
          </ButtonLink>
        </div>
        <div className="grid grid-cols-2 gap-4 lg:col-span-7">
          {sustain.map((s) => (
            <div key={s.label} className="border-line border bg-white/40 p-6">
              <s.icon className="text-sage-deep h-5 w-5" strokeWidth={1.4} />
              <p className="mt-6 font-serif text-5xl">
                <Counter to={s.stat} suffix={s.suffix} />
              </p>
              <p className="text-ink-soft mt-2 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="relative h-[70svh] min-h-[460px]">
          <SmartImage src={lifestyleImages.group.src} alt={lifestyleImages.group.alt} fill sizes="100vw" className="object-cover" />
          <div className="bg-ink/45 absolute inset-0" />
          <div className="container-velora text-ivory relative flex h-full flex-col items-center justify-center text-center">
            <SplitHeading text="Come and see us" className="font-serif text-5xl md:text-7xl" />
            <p className="text-ivory/80 mt-4 max-w-md">
              Visit our flagship on Ward Place for fittings, alterations and a cup of Ceylon tea.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/stores" variant="light">
                Find a store
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline" className="border-ivory/60 text-ivory hover:bg-ivory hover:text-ink">
                Contact us
              </ButtonLink>
            </div>
          </div>
        </div>
        <span className="sr-only">{boutiqueImages.interior.alt}</span>
      </section>
    </>
  );
}
