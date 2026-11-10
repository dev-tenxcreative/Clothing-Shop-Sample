import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { siteConfig } from "@/config/site";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const priceFormatter = new Intl.NumberFormat("en-LK", { maximumFractionDigits: 0 });

/** Formats a price in the configured currency, e.g. "Rs. 6,950". */
export function formatPrice(value: number) {
  return `${siteConfig.commerce.currencySymbol} ${priceFormatter.format(Math.round(value))}`;
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Adds business days (Mon–Sat) to a date and returns a short label. */
export function deliveryWindow(minDays: number, maxDays: number, from = new Date()) {
  const add = (days: number) => {
    const d = new Date(from);
    let added = 0;
    while (added < days) {
      d.setDate(d.getDate() + 1);
      if (d.getDay() !== 0) added++;
    }
    return d;
  };
  const fmt = new Intl.DateTimeFormat("en-GB", { weekday: "short", day: "numeric", month: "short" });
  return `${fmt.format(add(minDays))} – ${fmt.format(add(maxDays))}`;
}

export function pluralize(count: number, word: string, plural = `${word}s`) {
  return `${count} ${count === 1 ? word : plural}`;
}

/** Small deterministic PRNG so mock data is stable between server and client. */
export function seeded(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
