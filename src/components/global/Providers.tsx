"use client";

import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Pushes content below the fixed header on every page except the homepage (hero sits under it). */
export function HeaderSpacer() {
  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/checkout")) return null;
  return <div aria-hidden className="h-24 md:h-[112px]" />;
}
