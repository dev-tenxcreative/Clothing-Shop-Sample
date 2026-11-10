"use client";

import type Lenis from "lenis";

/** Shared Lenis instance so overlays can pause smooth scrolling. */
let instance: Lenis | null = null;
let locks = 0;

export const setLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Ref-counted scroll lock that works with or without Lenis. */
export function lockScroll() {
  locks++;
  if (locks === 1) {
    instance?.stop();
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--scrollbar-width", `${sbw}px`);
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${sbw}px`;
  }
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks === 0) {
    instance?.start();
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
  }
}

export function scrollToTop() {
  if (instance) instance.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
}
