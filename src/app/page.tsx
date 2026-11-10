import { Hero } from "@/components/home/heroes/Hero";
import {
  BestSellers,
  BrandStory,
  CategoryCards,
  FeaturedCollection,
  LookbookGrid,
  Marquee,
  NewsletterSection,
  ShopTheLook,
  WhyVelora,
} from "@/components/home/Sections";
import { Testimonials } from "@/components/home/Testimonials";
import { ProductCarousel } from "@/components/product/ProductCarousel";
import { ButtonLink } from "@/components/ui/Button";
import { getAllProducts, getNewArrivals } from "@/lib/products";

export default function HomePage() {
  const newIn = getNewArrivals(12);
  const best = [...getAllProducts()].sort((a, b) => b.popularity - a.popularity);

  return (
    <>
      <Hero />
      <Marquee items={["New season", "Frocks", "Blouses", "Skirts", "Dresses", "Pants"]} />
      <CategoryCards />
      <ProductCarousel
        products={newIn}
        eyebrow="Just landed"
        title={
          <>
            New <em className="text-rose">arrivals</em>
          </>
        }
        description="Fresh from the atelier — linen frocks, fluid satins and the season’s softest tailoring."
        action={
          <ButtonLink href="/new-in" variant="link">
            View all
          </ButtonLink>
        }
      />
      <FeaturedCollection slug="the-linen-edit" />
      <BestSellers products={best} />
      <ShopTheLook />
      <BrandStory />
      <WhyVelora />
      <Testimonials />
      <LookbookGrid />
      <NewsletterSection />
    </>
  );
}
