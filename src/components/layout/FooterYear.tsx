"use client";

import { useMounted } from "@/store";

/** Renders the current year on the client so static pages never go stale. */
export function FooterYear() {
  const mounted = useMounted();
  return <span suppressHydrationWarning>{mounted ? new Date().getFullYear() : 2026}</span>;
}
