"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { collections } from "@/data/catalog";
import { usePrefersReducedMotion } from "@/store";
import { useIntroDelay } from "./useIntroDelay";

const DURATION = 6500;
const ease = [0.22, 1, 0.36, 1] as const;

/** Variant C — collection slider with curtain-wipe transitions, timer bar and counter. */
export function HeroFabric() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduce = usePrefersReducedMotion();
  const delay = useIntroDelay();
  const timer = useRef<number | undefined>(undefined);
  const total = collections.length;
  const slide = collections[index];

  const go = useCallback(
    (n: number) => {
      setDir(n > index || (index === total - 1 && n === 0) ? 1 : -1);
      setIndex((n + total) % total);
    },
    [index, total],
  );

  useEffect(() => {
    if (paused || reduce) return;
    timer.current = window.setTimeout(() => go(index + 1), DURATION);
    return () => window.clearTimeout(timer.current);
  }, [index, paused, reduce, go]);

  const d = delay ?? 0;

  return (
    <section
      className="bg-ink text-ivory relative h-[100svh] min-h-[600px] overflow-hidden"
      aria-roledescription="carousel"
      aria-label="Collections"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <AnimatePresence initial={false} custom={dir}>
        <motion.div
          key={slide.slug}
          className="absolute inset-0"
          custom={dir}
          variants={{
            enter: (d: number) => ({ clipPath: d > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)", scale: 1.15 }),
            center: { clipPath: "inset(0 0 0 0%)", scale: 1, zIndex: 1 },
            exit: { zIndex: 0, scale: 1.05, transition: { duration: 1.4 } },
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.4, ease: [0.77, 0, 0.18, 1] }}
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${total}: ${slide.name}`}
        >
          <SmartImage src={slide.image.src} alt={slide.image.alt} fill preload={index === 0} sizes="100vw" className="object-cover" />
          <div className="from-ink/80 via-ink/20 to-ink/40 absolute inset-0 bg-gradient-to-t" />
        </motion.div>
      </AnimatePresence>

      <div className="container-velora relative z-10 flex h-full flex-col justify-end pb-24 md:pb-28">
        <AnimatePresence mode="wait">
          <motion.div key={slide.slug} initial="hidden" animate="show" exit="out" className="max-w-3xl">
            <motion.p
              className="eyebrow text-blush mb-5"
              variants={{
                hidden: { opacity: 0, y: 12 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, delay: d + 0.5 } },
                out: { opacity: 0, y: -10, transition: { duration: 0.3 } },
              }}
            >
              {slide.eyebrow} — Collection
            </motion.p>
            <h1 className="font-serif text-[clamp(3rem,9vw,8rem)] leading-[0.9] font-light" aria-label={slide.name}>
              {slide.name.split("").map((ch, i) => (
                <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom" aria-hidden>
                  <motion.span
                    className="inline-block"
                    variants={{
                      hidden: { y: "110%" },
                      show: { y: "0%", transition: { duration: 0.9, ease, delay: d + 0.55 + i * 0.03 } },
                      out: { y: "-110%", transition: { duration: 0.4, ease, delay: i * 0.01 } },
                    }}
                  >
                    {ch === " " ? " " : ch}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p
              className="text-ivory/80 mt-5 max-w-lg text-[0.98rem]"
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: d + 0.9 } },
                out: { opacity: 0, transition: { duration: 0.3 } },
              }}
            >
              {slide.description}
            </motion.p>
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.8, delay: d + 1.05 } },
                out: { opacity: 0, transition: { duration: 0.3 } },
              }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <ButtonLink href={`/collections/${slide.slug}`} variant="light" size="lg">
                Shop the collection
              </ButtonLink>
              <ButtonLink href="/new-in" variant="outline" size="lg" className="border-ivory/60 text-ivory hover:bg-ivory hover:text-ink">
                New In
              </ButtonLink>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 flex items-end justify-between gap-6">
          <div className="flex flex-1 items-center gap-6">
            <p className="font-serif text-lg tabular-nums" aria-live="polite">
              <span className="text-ivory">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-ivory/40 mx-2">/</span>
              <span className="text-ivory/60">{String(total).padStart(2, "0")}</span>
            </p>
            <div className="hidden flex-1 gap-3 md:flex">
              {collections.map((c, n) => (
                <button key={c.slug} onClick={() => go(n)} className="group flex-1 text-left" aria-label={`Go to ${c.name}`}>
                  <span className="bg-ivory/25 relative block h-px overflow-hidden">
                    {n === index && (
                      <motion.span
                        key={`${index}-${paused}`}
                        className="bg-ivory absolute inset-y-0 left-0"
                        initial={{ width: "0%" }}
                        animate={{ width: paused || reduce ? "100%" : "100%" }}
                        transition={{ duration: paused || reduce ? 0 : DURATION / 1000, ease: "linear" }}
                      />
                    )}
                    {n < index && <span className="bg-ivory/70 absolute inset-0" />}
                  </span>
                  <span
                    className={`mt-3 block text-[0.65rem] tracking-[0.22em] uppercase transition ${n === index ? "text-ivory" : "text-ivory/50 group-hover:text-ivory/80"}`}
                  >
                    {c.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => go(index - 1)}
              aria-label="Previous collection"
              className="border-ivory/40 hover:bg-ivory hover:text-ink grid h-12 w-12 place-items-center rounded-full border transition"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => go(index + 1)}
              aria-label="Next collection"
              className="border-ivory/40 hover:bg-ivory hover:text-ink grid h-12 w-12 place-items-center rounded-full border transition"
            >
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <Link href="/lookbook" className="sr-only">
        View the lookbook
      </Link>
    </section>
  );
}
