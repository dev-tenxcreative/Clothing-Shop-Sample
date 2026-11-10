"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MONOGRAM_PATHS } from "@/components/brand/Logo";
import { siteConfig } from "@/config/site";
import { lockScroll, unlockScroll } from "@/lib/lenis";

const KEY = "velora-intro-seen";
const ease = [0.65, 0, 0.35, 1] as const;

/**
 * ≤1.5s branded intro: the monogram draws itself, then the curtain splits.
 * Rendered by the server as an opaque cover (so there's no flash of content),
 * and skipped instantly if already seen this session.
 */
export function IntroLoader() {
  const [phase, setPhase] = useState<"cover" | "draw" | "reveal" | "done">(siteConfig.showIntroLoader ? "cover" : "done");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      /* ignore */
    }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!siteConfig.showIntroLoader || seen || reduce) {
      const t = window.setTimeout(() => setPhase("done"), 0);
      return () => window.clearTimeout(t);
    }
    lockScroll();
    const t0 = window.setTimeout(() => setPhase("draw"), 0);
    const t1 = window.setTimeout(() => setPhase("reveal"), 1000);
    const t2 = window.setTimeout(() => {
      setPhase("done");
      unlockScroll();
      try {
        sessionStorage.setItem(KEY, "1");
      } catch {
        /* ignore */
      }
    }, 1500);
    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          key="intro"
          className="fixed inset-0 z-[200] flex"
          data-intro-cover
          aria-hidden
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Curtain halves */}
          <motion.div
            className="bg-ink h-full w-1/2"
            animate={phase === "reveal" ? { x: "-100%" } : { x: 0 }}
            transition={{ duration: 0.55, ease }}
          />
          <motion.div
            className="bg-ink h-full w-1/2"
            animate={phase === "reveal" ? { x: "100%" } : { x: 0 }}
            transition={{ duration: 0.55, ease }}
          />
          <motion.div
            className="text-ivory absolute inset-0 flex flex-col items-center justify-center"
            animate={phase === "reveal" ? { opacity: 0, scale: 0.92 } : { opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
          >
            {phase !== "cover" && (
              <svg viewBox="0 0 48 48" fill="none" className="h-24 w-24">
                {(["left", "right", "eye", "thread"] as const).map((k, i) => (
                  <motion.path
                    key={k}
                    d={MONOGRAM_PATHS[k]}
                    stroke={k === "thread" ? "var(--color-gold)" : "currentColor"}
                    strokeWidth={k === "left" ? 2.4 : 1}
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: k === "thread" ? 0.6 : 0.45, delay: [0, 0.25, 0.4, 0.45][i], ease: "easeInOut" }}
                  />
                ))}
              </svg>
            )}
            <motion.p
              className="mt-5 font-serif text-sm tracking-[0.6em] uppercase"
              initial={{ opacity: 0, letterSpacing: "0.9em" }}
              animate={{ opacity: phase === "draw" ? 1 : 0, letterSpacing: "0.6em" }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Velora
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
