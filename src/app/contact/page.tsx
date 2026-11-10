import type { Metadata } from "next";
import { ContactDetails, ContactForm, MapPlaceholder } from "@/components/brand/InfoPages";
import { Breadcrumbs } from "@/components/ui/Bits";
import { Reveal, SplitHeading } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with VELORA — call, email, WhatsApp or visit our Colombo flagship. We reply within one working day.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="container-velora pt-4 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
      <div className="mt-10 max-w-3xl">
        <Reveal>
          <p className="eyebrow text-rose mb-4">We’d love to hear from you</p>
        </Reveal>
        <SplitHeading as="h1" text="Let’s talk." className="font-serif text-6xl leading-[0.9] font-light md:text-8xl" />
        <Reveal delay={0.15}>
          <p className="text-ink-soft mt-6 max-w-lg text-[1rem] leading-relaxed">
            Questions about sizing, an order or a special occasion? Our team in Colombo is here seven days a week.
          </p>
        </Reveal>
      </div>
      <div className="mt-16 grid gap-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="mb-8 font-serif text-3xl">Send us a message</h2>
          <ContactForm />
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <ContactDetails />
        </div>
      </div>
      <div className="mt-20">
        <MapPlaceholder />
      </div>
    </div>
  );
}
