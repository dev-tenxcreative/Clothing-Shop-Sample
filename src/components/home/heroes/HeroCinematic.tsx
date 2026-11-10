"use client";

import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pause, Play } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ButtonLink, Magnetic } from "@/components/ui/Button";
import { heroVideo } from "@/data/images";
import { siteConfig } from "@/config/site";
import { useMediaQuery, useMounted } from "@/store";
import { useIntroDelay } from "./useIntroDelay";

gsap.registerPlugin(ScrollTrigger);

const ease = [0.22, 1, 0.36, 1] as const;

export function HeroCinematic() {
  const section = useRef<HTMLElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const reduceMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const portrait = useMediaQuery("(max-aspect-ratio: 4/5)");
  const wide = useMediaQuery("(min-width: 1601px)");
  const mounted = useMounted();
  const saveData = mounted && Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);
  // Choose the right video for the viewport; skip entirely for reduced motion / data saver.
  const src = !mounted || reduceMotion || saveData ? null : portrait ? heroVideo.mobile : wide ? heroVideo.desktopHd : heroVideo.desktop;
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(true);
  const delay = useIntroDelay();

  // Scroll-driven parallax + text mask.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.to(media.current, {
        yPercent: 18,
        scale: 1.12,
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "bottom top", scrub: true },
      });
      gsap.to(content.current, {
        yPercent: -30,
        opacity: 0,
        clipPath: "inset(0% 0% 100% 0%)",
        ease: "none",
        scrollTrigger: { trigger: section.current, start: "top top", end: "70% top", scrub: true },
      });
    }, section);
    return () => ctx.revert();
  }, []);

  const toggle = () => {
    const v = video.current;
    if (!v) return;
    if (v.paused) {
      void v.play();
      setPlaying(true);
    } else {
      v.pause();
      setPlaying(false);
    }
  };

  const headline = siteConfig.tagline;
  const d = delay ?? 10;

  return (
    <section ref={section} className="bg-ink text-ivory relative h-[100svh] min-h-[560px] overflow-hidden" aria-label="Welcome to VELORA">
      <div ref={media} className="absolute inset-0 will-change-transform">
        <Image src={heroVideo.poster} alt="" fill preload sizes="100vw" className="object-cover md:object-center" />
        {src && (
          <video
            ref={video}
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[1.2s]"
            style={{ opacity: ready ? 1 : 0 }}
            src={src}
            poster={heroVideo.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlay={() => setReady(true)}
            aria-hidden
          />
        )}
      </div>
      <div className="from-ink/50 via-ink/15 to-ink/75 absolute inset-0 bg-gradient-to-b" aria-hidden />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(28,26,25,0.45))]" aria-hidden />

      <div
        ref={content}
        className="container-velora relative flex h-full flex-col items-center justify-end pb-28 text-center md:justify-center md:pb-0"
      >
        <motion.p
          className="eyebrow text-blush mb-6"
          initial={{ opacity: 0, y: 12 }}
          animate={delay !== null ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease, delay: d }}
        >
          The Summer 2026 Collection
        </motion.p>
        <h1 className="font-serif text-[clamp(3.1rem,10.5vw,9.5rem)] leading-[0.9] font-light tracking-[-0.02em]" aria-label={headline}>
          {headline.split(" ").map((word, wi, words) => (
            <span key={wi} className="inline-block whitespace-nowrap" aria-hidden>
              {word.split("").map((ch, ci) => {
                const index = words.slice(0, wi).join("").length + ci;
                return (
                  <span key={ci} className="inline-block overflow-hidden pb-[0.1em] align-bottom">
                    <motion.span
                      className={`inline-block ${word === "thread." ? "text-blush italic" : ""}`}
                      initial={{ y: "105%", opacity: 0 }}
                      animate={delay !== null ? { y: "0%", opacity: 1 } : {}}
                      transition={{ duration: 0.9, ease, delay: d + 0.15 + index * 0.035 }}
                    >
                      {ch}
                    </motion.span>
                  </span>
                );
              })}
              {wi < words.length - 1 && <span className="inline-block w-[0.25em]" />}
            </span>
          ))}
        </h1>
        <motion.p
          className="text-ivory/80 mx-auto mt-6 max-w-md text-[0.95rem] leading-relaxed md:text-base"
          initial={{ opacity: 0, y: 16 }}
          animate={delay !== null ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: d + 0.9 }}
        >
          Frocks, blouses and dresses cut for everyday elegance — designed in Colombo, made to be lived in.
        </motion.p>
        <motion.div
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          initial={{ opacity: 0, y: 16 }}
          animate={delay !== null ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, ease, delay: d + 1.05 }}
        >
          <Magnetic>
            <ButtonLink href="/new-in" variant="light" size="lg">
              Shop New In
            </ButtonLink>
          </Magnetic>
          <Magnetic>
            <ButtonLink
              href="/shop/dresses"
              variant="outline"
              size="lg"
              className="border-ivory/70 text-ivory hover:bg-ivory hover:text-ink"
            >
              Explore Dresses
            </ButtonLink>
          </Magnetic>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 md:flex"
        initial={{ opacity: 0 }}
        animate={delay !== null ? { opacity: 1 } : {}}
        transition={{ delay: d + 1.4 }}
        aria-hidden
      >
        <span className="text-ivory/70 text-[0.6rem] tracking-[0.35em] uppercase">Scroll</span>
        <span className="bg-ivory/25 relative h-14 w-px overflow-hidden">
          <motion.span
            className="bg-ivory absolute inset-x-0 top-0 h-1/2"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>

      {src && (
        <button
          onClick={toggle}
          className="border-ivory/30 text-ivory/80 hover:bg-ivory/10 absolute bottom-6 left-4 grid h-10 w-10 place-items-center rounded-full border backdrop-blur transition md:left-8"
          aria-label={playing ? "Pause background video" : "Play background video"}
        >
          {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
        </button>
      )}
    </section>
  );
}
