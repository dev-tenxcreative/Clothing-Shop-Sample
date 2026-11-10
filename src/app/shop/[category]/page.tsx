import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/shop/PageHeader";
import { ListingSkeleton, ProductListing } from "@/components/shop/ProductListing";
import { categories, getCategory } from "@/data/catalog";
import type { CategorySlug } from "@/data/types";
import { getByCategory } from "@/lib/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[category]">): Promise<Metadata> {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return {};
  return {
    title: `${c.name} for women`,
    description: c.intro,
    alternates: { canonical: `/shop/${c.slug}` },
    openGraph: { images: [{ url: `${c.banner.src}?w=1200&h=630&fit=crop&q=80&auto=format`, alt: c.banner.alt }] },
  };
}

export default async function CategoryPage({ params }: PageProps<"/shop/[category]">) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const products = getByCategory(c.slug as CategorySlug);

  return (
    <>
      <PageHeader
        title={c.name}
        eyebrow={c.tagline}
        intro={c.intro}
        image={c.banner}
        crumbs={[{ label: "Home", href: "/" }, { label: "Shop", href: "/shop" }, { label: c.name }]}
        links={c.subcategories.map((s) => ({ label: s, href: `/shop/${c.slug}?sub=${encodeURIComponent(s)}` }))}
      />
      <Suspense fallback={<ListingSkeleton />}>
        <ProductListing products={products} />
      </Suspense>
    </>
  );
}
