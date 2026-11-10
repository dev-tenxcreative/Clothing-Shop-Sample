"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import { ButtonLink, Magnetic } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { dressPool, frockPool, lifestyleImages, skirtPool } from "@/data/images";
import { useIntroDelay } from "./useIntroDelay";

const ease = [0.22, 1, 0.36, 1] as const;
const slides = [lifestyleImages.seaside, dressPool[2], frockPool[4], skirtPool[11]];

/** Variant B — editorial split with clip-path cross-fading images and pointer parallax. */
export function HeroSplit() {
  const [i, setI] = useState(0);
  const delay = useIntroDelay();
  const d = delay ?? 10;
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 80, damping: 20 });
  const sy = useSpring(my, { stiffness: 80, damping: 20 });
  const rotY = useTransform(sx, [-1, 1], [-6, 6]);
  const rotX = useTransform(sy, [-1, 1], [5, -5]);
  const tx = useTransform(sx, [-1, 1], [-18, 18]);
  const ty = useTransform(sy, [-1, 1], [-14, 14]);
  const backX = useTransform(sx, [-1, 1], [14, -14]);

  useEffect(() => {
    const t = window.setInterval(() => setI((n) => (n + 1) % slides.length), 4800);
    return () => window.clearInterval(t);
  }, []);

  return (
    <section
      className="bg-ivory relative min-h-[100svh] overflow-hidden pt-24 md:pt-[112px]"
      aria-label="Welcome to VELORA"
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse") return;
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      <div className="container-velora grid min-h-[calc(100svh-112px)] items-center gap-10 py-10 lg:grid-cols-12">
        <div className="relative z-10 lg:col-span-6">
          <motion.p
            className="eyebrow text-rose mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={delay !== null ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease, delay: d }}
          >
            Summer 2026 · Designed in Colombo
          </motion.p>
          <h1 className="font-serif text-[clamp(3.2rem,8.4vw,8.4rem)] leading-[0.88] font-light tracking-[-0.02em]">
            {["Grace,", "in every", "thread."].map((line, li) => (
              <span key={line} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className={li === 2 ? "text-rose block italic" : "block"}
                  initial={{ y: "110%" }}
                  animate={delay !== null ? { y: "0%" } : {}}
                  transition={{ duration: 1.1, ease, delay: d + 0.1 + li * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            className="text-ink-soft mt-8 max-w-md text-[0.98rem] leading-relaxed"
            initial={{ opacity: 0, y: 14 }}
            animate={delay !== null ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: d + 0.6 }}
          >
            Soft linens, fluid satins and crisp cottons — pieces that move from your morning coffee to candlelit dinners, without a second
            thought.
          </motion.p>
          <motion.div
            className="mt-10 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 14 }}
            animate={delay !== null ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, ease, delay: d + 0.75 }}
          >
            <Magnetic>
              <ButtonLink href="/new-in" variant="primary" size="lg">
                Shop New In
              </ButtonLink>
            </Magnetic>
            <Magnetic>
              <ButtonLink href="/shop/dresses" variant="outline" size="lg">
                Explore Dresses
              </ButtonLink>
            </Magnetic>
          </motion.div>
          <div className="mt-12 flex gap-2" role="tablist" aria-label="Hero images">
            {slides.map((s, n) => (
              <button
                key={s.src}
                role="tab"
                aria-selected={n === i}
                aria-label={`Show image ${n + 1}`}
                onClick={() => setI(n)}
                className="group h-6 py-2.5"
              >
                <span
                  className={`block h-px transition-all duration-700 ${n === i ? "bg-ink w-14" : "bg-ink/25 group-hover:bg-ink/60 w-6"}`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="relative h-[62svh] lg:col-span-6 lg:h-[78svh]" style={{ perspective: 1200 }}>
          {/* Back card */}
          <motion.div
            className="bg-blush-soft absolute top-[8%] left-0 hidden h-[62%] w-[42%] overflow-hidden md:block"
            style={{ x: backX }}
            initial={{ opacity: 0, y: 40 }}
            animate={delay !== null ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease, delay: d + 0.4 }}
          >
            <SmartImage src={slides[(i + 1) % slides.length].src} alt="" fill sizes="25vw" className="object-cover" />
          </motion.div>
          {/* Main card */}
          <motion.div
            className="bg-blush-soft absolute inset-y-0 right-0 w-full overflow-hidden md:w-[72%]"
            style={{ rotateY: rotY, rotateX: rotX, x: tx, y: ty, transformStyle: "preserve-3d" }}
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={delay !== null ? { clipPath: "inset(0% 0 0 0)" } : {}}
            transition={{ duration: 1.3, ease, delay: d + 0.2 }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={i}
                className="absolute inset-0"
                initial={{ clipPath: "inset(0 0 0 100%)", scale: 1.12 }}
                animate={{ clipPath: "inset(0 0 0 0%)", scale: 1 }}
                exit={{ opacity: 0.9 }}
                transition={{ duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
              >
                <SmartImage
                  src={slides[i].src}
                  alt={slides[i].alt}
                  fill
                  preload={i === 0}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
          {/* Floating tag */}
          <motion.div
            className="absolute bottom-[10%] left-[4%] z-10 grid h-28 w-28 place-items-center md:left-[18%] md:h-36 md:w-36"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={delay !== null ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.9, ease, delay: d + 1 }}
            aria-hidden
          >
            <motion.svg
              viewBox="0 0 100 100"
              className="absolute inset-0 h-full w-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <path id="tag-circle" d="M50 50 m-38 0 a38 38 0 1 1 76 0 a38 38 0 1 1 -76 0" />
              </defs>
              <circle cx="50" cy="50" r="49" fill="var(--color-ink)" />
              <text fill="var(--color-ivory)" style={{ fontSize: 9.2, letterSpacing: "0.32em", textTransform: "uppercase" }}>
                <textPath href="#tag-circle">New Collection · Summer 2026 ·</textPath>
              </text>
            </motion.svg>
            <span className="text-blush relative font-serif text-3xl italic">New</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
