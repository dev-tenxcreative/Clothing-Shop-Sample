/**
 * VELORA — single source of truth for brand, commerce and feature settings.
 * Change values here; every page and component reads from this file.
 */

export type HeroVariant = "cinematic" | "split" | "fabric";

export const siteConfig = {
  name: "VELORA",
  tagline: "Grace, in every thread.",
  description:
    "VELORA is a modern women's clothing label — frocks, blouses, skirts, pants and dresses cut for everyday elegance, the office and the moments worth dressing for.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://velora.example.com",
  locale: "en-LK",

  /**
   * Homepage hero.
   *  - "cinematic": full-screen video with letter-by-letter headline (default)
   *  - "split":     editorial split layout with cross-fading model images
   *  - "fabric":    collection slider with curtain-wipe transitions
   */
  heroVariant: "cinematic" as HeroVariant,

  /** Branded intro loader, shown once per browser session. */
  showIntroLoader: true,

  commerce: {
    currency: "LKR",
    currencySymbol: "Rs.",
    /** Orders at or above this subtotal ship free. */
    freeDeliveryThreshold: 15000,
    delivery: {
      standard: { label: "Standard Delivery", price: 450, minDays: 3, maxDays: 5 },
      express: { label: "Express Delivery", price: 1200, minDays: 1, maxDays: 2 },
    },
    returnDays: 14,
    lowStockThreshold: 3,
    /** Demo promo codes (front-end only). */
    promoCodes: {
      VELORA10: { type: "percent", value: 10, label: "10% off your order" },
      WELCOME500: { type: "fixed", value: 500, label: "Rs. 500 off" },
    } as Record<string, { type: "percent" | "fixed"; value: number; label: string }>,
    cashOnDelivery: { enabled: true, fee: 150 },
  },

  contact: {
    email: "hello@velora.example.com",
    phone: "+94 11 234 5678",
    whatsapp: "94771234567",
    address: "42 Ward Place, Colombo 07, Sri Lanka",
    hours: [
      { days: "Monday – Friday", time: "10:00 – 19:00" },
      { days: "Saturday", time: "10:00 – 20:00" },
      { days: "Sunday", time: "11:00 – 17:00" },
    ],
  },

  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    pinterest: "https://pinterest.com",
    tiktok: "https://tiktok.com",
  },

  announcements: [
    "Complimentary delivery on orders over Rs. 15,000",
    "The Linen Edit has arrived — light, breathable, made to move",
    "Easy 14-day returns on every piece",
    "Join the VELORA Circle for 10% off your first order",
  ],
} as const;

export type SiteConfig = typeof siteConfig;
