import type { Metadata } from "next";
import { Clock, MapPin, Phone } from "lucide-react";
import { MapPlaceholder } from "@/components/brand/InfoPages";
import { Breadcrumbs } from "@/components/ui/Bits";
import { ImageReveal, Reveal, SplitHeading } from "@/components/ui/Reveal";
import { SmartImage } from "@/components/ui/SmartImage";
import { stores } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Our stores",
  description: "Visit VELORA in Colombo, Galle Fort and Kandy for fittings, complimentary alterations and personal styling.",
  alternates: { canonical: "/stores" },
};

export default function StoresPage() {
  return (
    <div className="container-velora pt-4 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Stores" }]} />
      <div className="mt-10 max-w-3xl">
        <Reveal>
          <p className="eyebrow text-rose mb-4">Visit us</p>
        </Reveal>
        <SplitHeading as="h1" text="Our boutiques" className="font-serif text-6xl leading-[0.9] font-light md:text-8xl" />
        <Reveal delay={0.15}>
          <p className="text-ink-soft mt-6 max-w-lg text-[1rem] leading-relaxed">
            Try pieces on, book a personal styling session or have a hem taken up while you wait — every boutique is designed with local
            craftspeople.
          </p>
        </Reveal>
      </div>
      <div className="mt-16 grid gap-10 md:grid-cols-3">
        {stores.map((s, i) => (
          <article key={s.name} className="group">
            <ImageReveal className="bg-blush-soft aspect-[4/5]" delay={i * 0.1}>
              <SmartImage
                src={s.image.src}
                alt={s.image.alt}
                fill
                sizes="(min-width: 768px) 33vw, 100vw"
                className="object-cover transition duration-[1.2s] group-hover:scale-105"
              />
            </ImageReveal>
            {s.flagship && <p className="eyebrow text-rose mt-5 text-[0.6rem]">Flagship</p>}
            <h2 className="mt-2 font-serif text-3xl">{s.name}</h2>
            <ul className="text-ink-soft mt-4 space-y-2 text-sm">
              <li className="flex gap-2">
                <MapPin className="text-rose mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                {s.address}
              </li>
              <li className="flex gap-2">
                <Phone className="text-rose mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                {s.phone}
              </li>
              <li className="flex gap-2">
                <Clock className="text-rose mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                {s.hours}
              </li>
            </ul>
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(s.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-5 inline-block pb-1 text-[0.7rem] font-semibold tracking-[0.2em] uppercase"
            >
              Get directions
            </a>
          </article>
        ))}
      </div>
      <div className="mt-20">
        <MapPlaceholder />
      </div>
    </div>
  );
}
