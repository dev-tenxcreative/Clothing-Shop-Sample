import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shop/PageHeader";
import { ListingSkeleton, ProductListing } from "@/components/shop/ProductListing";
import { categories } from "@/data/catalog";
import { boutiqueImages } from "@/data/images";
import { getAllProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Shop the full VELORA collection of women's frocks, blouses, skirts, pants and dresses.",
  alternates: { canonical: "/shop" },
};

export default function ShopPage() {
  return (
    <>
      <PageHeader
        title="Shop all"
        eyebrow="The full collection"
        intro="Every VELORA piece in one place — filter by size, colour, fabric and occasion to find yours."
        image={boutiqueImages.neutral}
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop" }]}
        links={categories.map((c) => ({ label: c.name, href: `/shop/${c.slug}` }))}
      />
      <Suspense fallback={<ListingSkeleton />}>
        <ProductListing products={getAllProducts()} showCategory />
      </Suspense>
    </>
  );
}
