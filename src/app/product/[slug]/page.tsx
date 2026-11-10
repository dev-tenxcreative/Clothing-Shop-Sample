import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ProductDetail } from "@/components/product/ProductDetail";
import { RecentlyViewed, Reviews } from "@/components/product/Reviews";
import { Breadcrumbs, JsonLd } from "@/components/ui/Bits";
import { getCategory } from "@/data/catalog";
import { siteConfig } from "@/config/site";
import { effectivePrice, getAllProducts, getCompleteTheLook, getProduct, getRelated, totalStock } from "@/lib/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  const img = p.colours[0].images[0];
  return {
    title: p.name,
    description: `${p.description} ${p.fabric}.`,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      type: "website",
      title: `${p.name} · ${siteConfig.name}`,
      description: p.description,
      images: [{ url: `${img.src}?w=1200&h=630&fit=crop&q=80&auto=format`, alt: img.alt }],
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();
  const category = getCategory(product.category)!;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.id,
    description: product.description,
    image: product.colours.flatMap((c) => c.images.map((i) => `${i.src}?w=1200&q=80&auto=format`)),
    brand: { "@type": "Brand", name: siteConfig.name },
    material: product.fabric,
    color: product.colours.map((c) => c.name).join(", "),
    aggregateRating: { "@type": "AggregateRating", ratingValue: product.rating, reviewCount: product.reviewCount },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/product/${product.slug}`,
      priceCurrency: siteConfig.commerce.currency,
      price: effectivePrice(product),
      availability: totalStock(product) > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <div className="container-velora pt-4">
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: category.name, href: `/shop/${category.slug}` }, { label: product.name }]}
        />
        <div className="mt-6">
          <ProductDetail product={product} />
        </div>
        <Reviews product={product} />
      </div>
      <ProductCarousel
        className="border-line bg-ivory-deep border-t"
        products={getCompleteTheLook(product)}
        eyebrow="Styled by our atelier"
        title={
          <>
            Complete the <em className="text-rose">look</em>
          </>
        }
      />
      <ProductCarousel products={getRelated(product)} eyebrow={`More ${category.name.toLowerCase()}`} title="You may also like" />
      <RecentlyViewed excludeId={product.id} />
      <JsonLd data={jsonLd} />
    </>
  );
}
