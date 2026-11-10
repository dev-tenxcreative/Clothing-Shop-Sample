"use client";

import { motion } from "framer-motion";
import { useEffect, type ReactNode } from "react";

/**
 * Route transition: a blush curtain lifts away and the page rises in.
 * Skipped on the very first load so the server HTML paints immediately (good LCP).
 */
let hasNavigated = false;

export default function Template({ children }: { children: ReactNode }) {
  const animate = hasNavigated;
  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <>
      <motion.div
        aria-hidden
        className="bg-blush-soft pointer-events-none fixed inset-0 z-[45] origin-top"
        initial={animate ? { scaleY: 1 } : false}
        animate={{ scaleY: 0 }}
        style={animate ? undefined : { transform: "scaleY(0)" }}
        transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
      />
      <motion.div
        initial={animate ? { opacity: 0, y: 18 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
      >
        {children}
      </motion.div>
    </>
  );
}
