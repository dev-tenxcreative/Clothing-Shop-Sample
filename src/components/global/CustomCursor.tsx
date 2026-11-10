"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/store";

/**
 * Small ink dot that follows the pointer and grows over links, buttons and
 * product cards (`data-cursor="view"` shows a label). Mouse devices only.
 */
export function CustomCursor() {
  const fine = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduce = useMediaQuery("(prefers-reduced-motion: reduce)");
  const enabled = fine && !reduce;
  const [mode, setMode] = useState<"default" | "link" | "view" | "hidden">("default");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x.set(e.clientX);
      y.set(e.clientY);
      const target = e.target as HTMLElement | null;
      if (!target) return;
      if (target.closest("input, textarea, select, [data-cursor='hidden']")) setMode("hidden");
      else if (target.closest("[data-cursor='view']")) setMode("view");
      else if (target.closest("a, button, [role='button'], label")) setMode("link");
      else setMode("default");
    };
    const leave = () => setMode("hidden");
    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const size = mode === "view" ? 84 : mode === "link" ? 42 : mode === "hidden" ? 0 : 10;

  return (
    <motion.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-[120] mix-blend-difference" style={{ x: sx, y: sy }}>
      <motion.div
        className="bg-ivory text-ink flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[0.6rem] font-semibold tracking-[0.2em] uppercase"
        animate={{ width: size, height: size, opacity: mode === "hidden" ? 0 : 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {mode === "view" && <span className="mix-blend-normal">View</span>}
      </motion.div>
    </motion.div>
  );
}
