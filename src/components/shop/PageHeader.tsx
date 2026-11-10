import Link from "next/link";
import type { ReactNode } from "react";
import type { ProductImage } from "@/data/types";
import { Breadcrumbs } from "@/components/ui/Bits";
import { ImageReveal, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";

/** Editorial page header: optional banner image, breadcrumbs, title, intro and sub-links. */
export function PageHeader({
  title,
  eyebrow,
  intro,
  image,
  crumbs,
  links,
  children,
}: {
  title: string;
  eyebrow?: string;
  intro?: ReactNode;
  image?: ProductImage;
  crumbs: { label: string; href?: string }[];
  links?: { label: string; href: string; active?: boolean }[];
  children?: ReactNode;
}) {
  return (
    <header className="container-velora pt-6 pb-10 md:pt-8 md:pb-14">
      <Breadcrumbs items={crumbs} />
      <div className={image ? "mt-8 grid items-end gap-8 md:grid-cols-12 md:gap-12" : "mt-10"}>
        <div className={image ? "md:col-span-6 lg:col-span-5" : "max-w-3xl"}>
          {eyebrow && (
            <Reveal>
              <p className="eyebrow text-rose mb-4">{eyebrow}</p>
            </Reveal>
          )}
          <SplitHeading as="h1" text={title} className="font-serif text-6xl leading-[0.9] font-light md:text-8xl" />
          {intro && (
            <Reveal delay={0.15}>
              <p className="text-ink-soft mt-6 max-w-md text-[0.98rem] leading-relaxed">{intro}</p>
            </Reveal>
          )}
          {children}
        </div>
        {image && (
          <div className="md:col-span-6 lg:col-span-7">
            <ImageReveal className="bg-blush-soft aspect-[16/10] md:aspect-[16/9]">
              <SmartImage src={image.src} alt={image.alt} fill preload sizes="(min-width: 768px) 55vw, 100vw" className="object-cover" />
            </ImageReveal>
          </div>
        )}
      </div>
      {links && links.length > 0 && (
        <nav aria-label="Refine" className="no-scrollbar -mx-4 mt-10 flex gap-2 overflow-x-auto px-4 md:mx-0 md:flex-wrap md:px-0">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`inline-flex h-10 shrink-0 items-center rounded-full border px-5 text-[0.8rem] transition ${l.active ? "border-ink bg-ink text-ivory" : "border-line hover:border-ink"}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
