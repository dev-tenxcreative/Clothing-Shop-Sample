import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ListingSkeleton, ProductListing } from "@/components/shop/ProductListing";
import { Breadcrumbs } from "@/components/ui/Bits";
import { ImageReveal, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { collections, getCollection } from "@/data/catalog";
import { getCollectionProducts } from "@/lib/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) return {};
  return {
    title: c.name,
    description: c.description,
    alternates: { canonical: `/collections/${c.slug}` },
    openGraph: { images: [{ url: `${c.image.src}?w=1200&h=630&fit=crop&q=80&auto=format`, alt: c.image.alt }] },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[slug]">) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const products = getCollectionProducts(c.slug);
  const others = collections.filter((x) => x.slug !== c.slug);

  return (
    <>
      <section className="container-velora pt-6 pb-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Collections" }, { label: c.name }]} />
        <div className="mt-8 grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow text-rose mb-4">{c.eyebrow} · Collection</p>
            </Reveal>
            <SplitHeading as="h1" text={c.name} className="font-serif text-6xl leading-[0.9] font-light md:text-8xl" />
            <Reveal delay={0.15}>
              <p className="text-ink-soft mt-6 text-[1rem] leading-relaxed">{c.description}</p>
              <p className="text-ink-muted mt-4 text-[0.95rem] leading-relaxed">{c.story}</p>
            </Reveal>
          </div>
          <div className="grid grid-cols-5 gap-4 lg:col-span-7">
            <ImageReveal className="bg-blush-soft col-span-3 aspect-[3/4]">
              <SmartImage
                src={c.image.src}
                alt={c.image.alt}
                fill
                preload
                sizes="(min-width: 1024px) 35vw, 60vw"
                className="object-cover"
              />
            </ImageReveal>
            <ImageReveal className="bg-blush-soft col-span-2 mt-16 aspect-[3/4] self-end" delay={0.2}>
              <SmartImage
                src={c.secondary.src}
                alt={c.secondary.alt}
                fill
                sizes="(min-width: 1024px) 24vw, 40vw"
                className="object-cover"
              />
            </ImageReveal>
          </div>
        </div>
      </section>
      <Suspense fallback={<ListingSkeleton />}>
        <ProductListing products={products} />
      </Suspense>
      <section className="border-line bg-ivory-deep border-t py-16">
        <div className="container-velora">
          <p className="eyebrow text-ink-muted mb-6">More collections</p>
          <div className="grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/collections/${o.slug}`}
                className="group bg-blush-soft relative block aspect-[4/3] overflow-hidden"
                data-cursor="view"
              >
                <SmartImage
                  src={o.image.src}
                  alt={o.image.alt}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition duration-[1.2s] group-hover:scale-105"
                />
                <span className="from-ink/60 absolute inset-0 bg-gradient-to-t to-transparent" />
                <span className="text-ivory absolute bottom-5 left-5">
                  <span className="eyebrow text-ivory/70 block">{o.eyebrow}</span>
                  <span className="font-serif text-3xl">{o.name}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
