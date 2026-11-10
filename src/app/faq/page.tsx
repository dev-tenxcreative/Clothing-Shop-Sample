import type { Metadata } from "next";
import { FaqSearch } from "@/components/brand/InfoPages";
import { Breadcrumbs, JsonLd } from "@/components/ui/Bits";
import { SplitHeading } from "@/components/ui/Reveal";
import { faqs } from "@/data/catalog";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about VELORA orders, payment, delivery, returns, sizing and care.",
  alternates: { canonical: "/faq" },
};

export default function FaqPage() {
  return (
    <div className="container-velora pt-4 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "FAQ" }]} />
      <div className="mt-10 mb-16 max-w-3xl">
        <p className="eyebrow text-rose mb-4">Help centre</p>
        <SplitHeading as="h1" text="Questions, answered." className="font-serif text-6xl leading-[0.9] font-light md:text-8xl" />
      </div>
      <FaqSearch />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.flatMap((g) =>
            g.items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
          ),
        }}
      />
    </div>
  );
}
