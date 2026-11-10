"use client";

import { useSyncExternalStore } from "react";

let cached: number | null = null;
const noop = () => () => {};

/** Seconds to wait so hero animations start as the intro curtain opens (null during SSR). */
function read() {
  if (cached !== null) return cached;
  let seen = document.documentElement.dataset.intro === "seen";
  try {
    seen ||= sessionStorage.getItem("velora-intro-seen") === "1";
  } catch {
    /* ignore */
  }
  cached = seen ? 0.15 : 1.25;
  return cached;
}

export function useIntroDelay() {
  return useSyncExternalStore(noop, read, () => null);
}
