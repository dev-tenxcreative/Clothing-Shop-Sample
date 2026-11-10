import { products } from "@/data/products";
import type { CategorySlug, Product } from "@/data/types";

/**
 * Data-access layer. Every page reads products through these functions, so
 * replacing local data with a CMS/commerce API only means changing this file.
 */

export const getAllProducts = () => products;
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const getProductById = (id: string) => products.find((p) => p.id === id);
export const getByCategory = (category: CategorySlug) => products.filter((p) => p.category === category);
export const getNewArrivals = (limit?: number) =>
  [...products]
    .filter((p) => p.isNew)
    .sort(byNewest)
    .slice(0, limit);
export const getBestSellers = (limit?: number) =>
  [...products]
    .filter((p) => p.isBestSeller)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
export const getSaleProducts = () => products.filter((p) => p.salePrice);
export const getCollectionProducts = (slug: string) => products.filter((p) => p.collections.includes(slug));

export const effectivePrice = (p: Pick<Product, "price" | "salePrice">) => p.salePrice ?? p.price;
export const discountPercent = (p: Product) => (p.salePrice ? Math.round(((p.price - p.salePrice) / p.price) * 100) : 0);
export const totalStock = (p: Product) => p.sizes.reduce((sum, s) => sum + s.stock, 0);

export function byNewest(a: Product, b: Product) {
  return +new Date(b.createdAt) - +new Date(a.createdAt);
}

/** Pieces from other categories that pair well — used for "Complete the look". */
export function getCompleteTheLook(product: Product, limit = 4) {
  const pairings: Record<CategorySlug, CategorySlug[]> = {
    blouses: ["skirts", "pants"],
    skirts: ["blouses"],
    pants: ["blouses"],
    frocks: ["blouses", "skirts"],
    dresses: ["frocks", "blouses"],
  };
  const targets = pairings[product.category];
  return products
    .filter((p) => targets.includes(p.category) && p.occasion.some((o) => product.occasion.includes(o)))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit);
}

export function getRelated(product: Product, limit = 8) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category)
    .sort((a, b) => {
      const sa = a.occasion.filter((o) => product.occasion.includes(o)).length + (a.subcategory === product.subcategory ? 2 : 0);
      const sb = b.occasion.filter((o) => product.occasion.includes(o)).length + (b.subcategory === product.subcategory ? 2 : 0);
      return sb - sa;
    })
    .slice(0, limit);
}

export function searchProducts(query: string, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const terms = q.split(/\s+/);
  return products
    .map((p) => {
      const hay =
        `${p.name} ${p.category} ${p.subcategory} ${p.fabricFamily} ${p.colours.map((c) => c.name).join(" ")} ${p.tags.join(" ")}`.toLowerCase();
      const score = terms.reduce((s, t) => s + (hay.includes(t) ? (p.name.toLowerCase().includes(t) ? 3 : 1) : -10), 0);
      return { p, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((r) => r.p);
}

/* Listing filters ---------------------------------------------------- */

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc" | "popular";

export interface Filters {
  sizes: string[];
  colours: string[];
  fabrics: string[];
  occasions: string[];
  lengths: string[];
  subs: string[];
  price: [number, number] | null;
  onlyNew: boolean;
  onlySale: boolean;
}

export const emptyFilters: Filters = {
  sizes: [],
  colours: [],
  fabrics: [],
  occasions: [],
  lengths: [],
  subs: [],
  price: null,
  onlyNew: false,
  onlySale: false,
};

/** Groups colour names into families so the swatch filter stays short. */
export const colourFamilies: { name: string; hex: string; match: RegExp }[] = [
  { name: "White & Ivory", hex: "#f6f2ea", match: /white|ivory|chalk|pearl|oat|optic/i },
  { name: "Black", hex: "#1c1a19", match: /noir|ink|black|mono/i },
  { name: "Red & Pink", hex: "#b3262e", match: /red|cherry|ruby|scarlet|garnet|rouge|blush|paprika|palm|wildflower|bloom/i },
  { name: "Yellow & Orange", hex: "#e3a33a", match: /marigold|saffron|sunflower|butter|mustard|tangerine|ochre|buttercup|terracotta/i },
  { name: "Green", hex: "#6f7f57", match: /sage|pistachio|forest|emerald|moss|garden/i },
  { name: "Blue & Purple", hex: "#5f7fb5", match: /cornflower|delft|navy|indigo|amethyst|lavender|denim/i },
  { name: "Neutral", hex: "#c9b79f", match: /sand|champagne|cocoa|slate/i },
];

export const colourFamilyOf = (colourName: string) => colourFamilies.find((f) => f.match.test(colourName))?.name ?? "Neutral";

export function applyFilters(list: Product[], f: Filters) {
  return list.filter((p) => {
    if (f.sizes.length && !p.sizes.some((s) => f.sizes.includes(s.size) && s.stock > 0)) return false;
    if (f.colours.length && !p.colours.some((c) => f.colours.includes(colourFamilyOf(c.name)))) return false;
    if (f.fabrics.length && !f.fabrics.includes(p.fabricFamily)) return false;
    if (f.occasions.length && !p.occasion.some((o) => f.occasions.includes(o))) return false;
    if (f.lengths.length && !f.lengths.includes(p.length)) return false;
    if (f.subs.length && !f.subs.includes(p.subcategory)) return false;
    if (f.onlyNew && !p.isNew) return false;
    if (f.onlySale && !p.salePrice) return false;
    if (f.price) {
      const price = effectivePrice(p);
      if (price < f.price[0] || price > f.price[1]) return false;
    }
    return true;
  });
}

export function sortProducts(list: Product[], sort: SortKey) {
  const out = [...list];
  switch (sort) {
    case "newest":
      return out.sort(byNewest);
    case "price-asc":
      return out.sort((a, b) => effectivePrice(a) - effectivePrice(b));
    case "price-desc":
      return out.sort((a, b) => effectivePrice(b) - effectivePrice(a));
    case "popular":
      return out.sort((a, b) => b.popularity - a.popularity);
    default:
      return out.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.popularity - a.popularity);
  }
}
