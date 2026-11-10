/**
 * Domain types. These mirror what a headless CMS / commerce API would return,
 * so `/data` can later be swapped for a real backend without touching the UI.
 */

export type CategorySlug = "frocks" | "blouses" | "skirts" | "pants" | "dresses";

export type Size = "XS" | "S" | "M" | "L" | "XL" | "XXL";
export const SIZES: Size[] = ["XS", "S", "M", "L", "XL", "XXL"];

export type Occasion = "Everyday" | "Office" | "Evening" | "Weekend" | "Occasion" | "Holiday";
export type Length = "Mini" | "Knee" | "Midi" | "Maxi" | "Cropped" | "Full length" | "Hip";
export type Badge = "New" | "Sale" | "Low stock" | "Best seller" | "Limited";

export interface ProductImage {
  src: string;
  alt: string;
  /** Photographer handle on the source platform, for CREDITS.md. */
  credit: string;
}

export interface ProductColour {
  name: string;
  hex: string;
  images: ProductImage[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  subcategory: string;
  price: number;
  salePrice?: number;
  colours: ProductColour[];
  sizes: { size: Size; stock: number }[];
  fabric: string;
  fabricFamily: "Linen" | "Cotton" | "Silk" | "Satin" | "Crepe" | "Chiffon" | "Viscose" | "Denim" | "Wool blend";
  care: string[];
  description: string;
  details: string[];
  occasion: Occasion[];
  length: Length;
  rating: number;
  reviewCount: number;
  badges: Badge[];
  isNew: boolean;
  isBestSeller: boolean;
  tags: string[];
  collections: string[];
  /** ISO date, used for "newest" sort. */
  createdAt: string;
  popularity: number;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  tagline: string;
  intro: string;
  banner: ProductImage;
  card: ProductImage;
  subcategories: string[];
}

export interface Collection {
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  story: string;
  image: ProductImage;
  secondary: ProductImage;
}
