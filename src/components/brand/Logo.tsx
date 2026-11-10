import { cn } from "@/lib/utils";

/**
 * VELORA monogram: a hairline "V" whose right stroke is a needle,
 * with a single thread looping through its eye.
 */
export const MONOGRAM_PATHS = {
  left: "M9 8.5 L24 40",
  right: "M24 40 L37.2 9.2",
  eye: "M36.1 6.6 a1.5 3.1 23 1 0 2.4 1 a1.5 3.1 23 1 0 -2.4 -1 z",
  thread: "M37.4 8.4 C 45 9.5 44.5 19 36 21.5 C 27.5 24 17 20.5 11.5 25.5 C 7.5 29.2 10 35 15.5 33.5",
};

export function Monogram({ className, title = "VELORA" }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("h-8 w-8", className)} role="img" aria-label={title}>
      <path d={MONOGRAM_PATHS.left} stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <path d={MONOGRAM_PATHS.right} stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <path d={MONOGRAM_PATHS.eye} stroke="currentColor" strokeWidth="0.9" />
      <path d={MONOGRAM_PATHS.thread} stroke="var(--color-gold)" strokeWidth="0.9" strokeLinecap="round" />
    </svg>
  );
}

/** High-contrast serif wordmark with wide tracking. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 36" className={cn("h-6 w-auto", className)} role="img" aria-label="VELORA">
      <text
        x="110"
        y="28"
        textAnchor="middle"
        fill="currentColor"
        style={{ fontFamily: "var(--font-serif)", fontSize: 32, fontWeight: 500, letterSpacing: "0.32em" }}
      >
        VELORA
      </text>
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center", className)}>
      {compact ? <Monogram className="h-9 w-9" /> : <Wordmark className="h-6 md:h-7" />}
    </span>
  );
}
