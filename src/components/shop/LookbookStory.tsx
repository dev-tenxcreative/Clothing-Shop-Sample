"use client";

import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";
import { Breadcrumbs, Price } from "@/components/ui/Bits";
import { ButtonLink } from "@/components/ui/Button";
import { ImageReveal, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { collections } from "@/data/catalog";
import { lifestyleImages } from "@/data/images";
import { getCollectionProducts } from "@/lib/products";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const strip = [
  lifestyleImages.seaside,
  lifestyleImages.rocks,
  lifestyleImages.gowns,
  lifestyleImages.stage,
  lifestyleImages.city,
  lifestyleImages.pose,
  lifestyleImages.flowers,
  lifestyleImages.meadow,
  lifestyleImages.group,
];

export function LookbookStory() {
  const pin = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  // Pinned horizontal gallery on desktop.
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const el = track.current!;
      const distance = () => el.scrollWidth - window.innerWidth;
      gsap.to(el, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: pin.current,
          start: "top top",
          end: () => `+=${distance()}`,
          scrub: 0.6,
          pin: true,
          invalidateOnRefresh: true,
        },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <>
      <section className="container-velora pt-6 pb-14">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Lookbook" }]} />
        <div className="mt-10 max-w-4xl">
          <Reveal>
            <p className="eyebrow text-rose mb-4">Summer 2026 · Lookbook</p>
          </Reveal>
          <SplitHeading
            as="h1"
            text="Four stories, one wardrobe."
            className="font-serif text-6xl leading-[0.9] font-light md:text-[7.5rem]"
          />
          <Reveal delay={0.2}>
            <p className="text-ink-soft mt-8 max-w-lg text-[1rem] leading-relaxed">
              Shot between Galle Fort, the Colombo flower market and a borrowed garden in Kandy — this season is about pieces that travel
              with you, from first light to last call.
            </p>
          </Reveal>
        </div>
      </section>

      <section ref={pin} className="bg-ink overflow-hidden py-10 lg:flex lg:h-screen lg:items-center lg:py-0" aria-label="Lookbook gallery">
        <div ref={track} className="no-scrollbar flex gap-4 overflow-x-auto px-4 lg:gap-8 lg:overflow-visible lg:px-[8vw]">
          <div className="text-ivory flex w-[70vw] shrink-0 flex-col justify-center pr-6 lg:w-[28vw]">
            <p className="eyebrow text-blush mb-4">Scroll the season</p>
            <p className="font-serif text-4xl leading-tight lg:text-6xl">Light, movement &amp; ease.</p>
          </div>
          {strip.map((img, i) => (
            <figure
              key={img.src}
              className={cn(
                "bg-ink-soft relative shrink-0 overflow-hidden",
                i % 2 ? "h-[52vh] w-[70vw] lg:mt-24 lg:h-[62vh] lg:w-[34vw]" : "h-[60vh] w-[78vw] lg:h-[74vh] lg:w-[42vw]",
              )}
            >
              <SmartImage src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 42vw, 78vw" className="object-cover" />
              <figcaption className="text-ivory/80 absolute bottom-4 left-4 text-[0.65rem] tracking-[0.25em] uppercase">
                Look {String(i + 1).padStart(2, "0")}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {collections.map((c, i) => {
        const items = getCollectionProducts(c.slug).slice(0, 3);
        const flip = i % 2 === 1;
        return (
          <section key={c.slug} className="container-velora grid items-center gap-12 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
            <div className={cn("grid grid-cols-5 gap-4 lg:col-span-7", flip && "lg:order-2")}>
              <ImageReveal className="bg-blush-soft col-span-3 aspect-[3/4]">
                <SmartImage src={c.image.src} alt={c.image.alt} fill sizes="(min-width: 1024px) 35vw, 60vw" className="object-cover" />
              </ImageReveal>
              <ImageReveal className="bg-blush-soft col-span-2 aspect-[3/4] self-end" delay={0.2}>
                <SmartImage
                  src={c.secondary.src}
                  alt={c.secondary.alt}
                  fill
                  sizes="(min-width: 1024px) 24vw, 40vw"
                  className="object-cover"
                />
              </ImageReveal>
            </div>
            <div className="lg:col-span-5">
              <Reveal>
                <p className="eyebrow text-rose mb-4">
                  Chapter {String(i + 1).padStart(2, "0")} · {c.eyebrow}
                </p>
              </Reveal>
              <SplitHeading text={c.name} className="font-serif text-5xl leading-[0.95] font-light md:text-7xl" />
              <Reveal delay={0.15}>
                <p className="text-ink-soft mt-6 text-[0.98rem] leading-relaxed">{c.story}</p>
              </Reveal>
              <ul className="mt-8 space-y-3">
                {items.map((p) => (
                  <li key={p.id}>
                    <Link href={`/product/${p.slug}`} className="group border-line flex items-center gap-4 border-b pb-3">
                      <span className="bg-blush-soft relative h-16 w-12 shrink-0 overflow-hidden">
                        <SmartImage src={p.colours[0].images[0].src} alt="" fill sizes="48px" className="object-cover" />
                      </span>
                      <span className="group-hover:text-rose flex-1 text-sm">{p.name}</span>
                      <Price price={p.price} salePrice={p.salePrice} className="text-ink-soft text-sm" />
                    </Link>
                  </li>
                ))}
              </ul>
              <ButtonLink href={`/collections/${c.slug}`} variant="dark" className="mt-8">
                Shop {c.name}
              </ButtonLink>
            </div>
          </section>
        );
      })}
    </>
  );
}
