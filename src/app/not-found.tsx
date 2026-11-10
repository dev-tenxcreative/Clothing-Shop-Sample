import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { SmartImage } from "@/components/ui/SmartImage";
import { categories } from "@/data/catalog";
import { lifestyleImages } from "@/data/images";

export default function NotFound() {
  return (
    <div className="container-velora grid min-h-[80svh] items-center gap-12 py-16 lg:grid-cols-2">
      <div>
        <p className="eyebrow text-rose mb-6">Error 404</p>
        <h1 className="text-ink font-serif text-[clamp(6rem,18vw,14rem)] leading-[0.8] font-light">
          4<em className="text-rose">0</em>4
        </h1>
        <p className="mt-8 font-serif text-4xl leading-tight">This page has slipped off the rail.</p>
        <p className="text-ink-soft mt-4 max-w-md text-[0.98rem]">
          The piece you’re looking for may have sold out, moved, or never existed. Let’s find you something beautiful instead.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/shop" variant="dark">
            Shop all
          </ButtonLink>
          <ButtonLink href="/" variant="outline">
            Back home
          </ButtonLink>
        </div>
        <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={`/shop/${c.slug}`} className="link-underline">
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-blush-soft relative hidden aspect-[4/5] overflow-hidden lg:block">
        <SmartImage src={lifestyleImages.road.src} alt={lifestyleImages.road.alt} fill sizes="45vw" className="object-cover" />
      </div>
    </div>
  );
}
