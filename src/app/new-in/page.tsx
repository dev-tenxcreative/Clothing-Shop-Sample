import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/shop/PageHeader";
import { ListingSkeleton, ProductListing } from "@/components/shop/ProductListing";
import { Marquee } from "@/components/home/Sections";
import { lifestyleImages } from "@/data/images";
import { getNewArrivals } from "@/lib/products";

export const metadata: Metadata = {
  title: "New In",
  description: "The latest arrivals from the VELORA atelier — new frocks, dresses, blouses and tailoring every week.",
  alternates: { canonical: "/new-in" },
};

export default function NewInPage() {
  return (
    <>
      <PageHeader
        title="New In"
        eyebrow="Fresh from the atelier"
        intro="Linen frocks, fluid satins and the season’s softest tailoring. New pieces land every Thursday."
        image={lifestyleImages.field}
        crumbs={[{ label: "Home", href: "/" }, { label: "New In" }]}
      />
      <Suspense fallback={<ListingSkeleton />}>
        <ProductListing products={getNewArrivals()} hideNewToggle />
      </Suspense>
      <Marquee items={["Just landed", "The Linen Edit", "Evening Muse", "Summer in Colombo"]} />
    </>
  );
}
