import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { categories, collections } from "@/data/catalog";
import { getAllProducts } from "@/lib/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date("2026-11-10");
  const staticRoutes = [
    "",
    "/shop",
    "/new-in",
    "/sale",
    "/lookbook",
    "/about",
    "/contact",
    "/stores",
    "/faq",
    "/size-guide",
    "/shipping-returns",
    "/track-order",
    "/privacy-policy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: path === "" || path === "/new-in" ? ("daily" as const) : ("weekly" as const),
    priority: path === "" ? 1 : 0.7,
  }));

  return [
    ...staticRoutes,
    ...categories.map((c) => ({ url: `${base}/shop/${c.slug}`, lastModified: now, changeFrequency: "daily" as const, priority: 0.9 })),
    ...collections.map((c) => ({
      url: `${base}/collections/${c.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...getAllProducts().map((p) => ({
      url: `${base}/product/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.8,
      images: [`${p.colours[0].images[0].src}?w=1200&q=80&auto=format`],
    })),
  ];
}
