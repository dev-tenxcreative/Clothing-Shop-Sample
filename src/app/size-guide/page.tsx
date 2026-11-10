import type { Metadata } from "next";
import { MeasureIllustration, SizeGuideTable } from "@/components/product/GlobalModals";
import { Breadcrumbs } from "@/components/ui/Bits";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";
import { measureGuide, sizeTables } from "@/data/sizes";
import type { CategorySlug } from "@/data/types";

export const metadata: Metadata = {
  title: "Size guide",
  description: "Find your VELORA size — measurement charts for frocks, dresses, blouses, skirts and pants, plus how to measure.",
  alternates: { canonical: "/size-guide" },
};

export default function SizeGuidePage() {
  return (
    <div className="container-velora pt-4 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Size guide" }]} />
      <div className="mt-10 max-w-3xl">
        <p className="eyebrow text-rose mb-4">Find your fit</p>
        <SplitHeading as="h1" text="Size guide" className="font-serif text-6xl leading-[0.9] font-light md:text-8xl" />
        <Reveal delay={0.15}>
          <p className="text-ink-soft mt-6 max-w-lg text-[1rem] leading-relaxed">
            All measurements are body measurements in centimetres. Between sizes? Size up for a relaxed fit, or message us for personal
            advice.
          </p>
        </Reveal>
      </div>
      <nav aria-label="Jump to category" className="mt-10 flex flex-wrap gap-2">
        {(Object.keys(sizeTables) as CategorySlug[]).map((k) => (
          <a
            key={k}
            href={`#${k}`}
            className="border-line hover:border-ink inline-flex h-10 items-center rounded-full border px-5 text-sm transition"
          >
            {sizeTables[k].title}
          </a>
        ))}
      </nav>
      <section className="bg-ivory-deep mt-12 grid items-center gap-10 p-8 md:grid-cols-[220px_1fr] md:p-12">
        <MeasureIllustration className="mx-auto max-w-[200px]" />
        <div>
          <h2 className="font-serif text-4xl">How to measure</h2>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2">
            {measureGuide.map((m) => (
              <li key={m.title}>
                <p className="font-medium">{m.title}</p>
                <p className="text-ink-soft mt-1 text-sm leading-relaxed">{m.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <div className="mt-16 space-y-16">
        {(Object.keys(sizeTables) as CategorySlug[]).map((k) => (
          <section key={k} id={k} className="scroll-mt-32">
            <h2 className="mb-6 font-serif text-4xl">{sizeTables[k].title}</h2>
            <SizeGuideTable category={k} />
          </section>
        ))}
      </div>
    </div>
  );
}
