import type { Metadata } from "next";
import { TrackOrder } from "@/components/brand/InfoPages";
import { Breadcrumbs } from "@/components/ui/Bits";
import { SplitHeading } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Track your order",
  description: "Track your VELORA order with your order number and email.",
  alternates: { canonical: "/track-order" },
};

export default function TrackOrderPage() {
  return (
    <div className="container-velora pt-4 pb-24">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Track order" }]} />
      <div className="mx-auto mt-10 mb-14 max-w-2xl text-center">
        <p className="eyebrow text-rose mb-4">Where’s my order?</p>
        <SplitHeading as="h1" text="Track your order" className="font-serif text-6xl leading-[0.9] font-light md:text-7xl" />
        <p className="text-ink-soft mt-6 text-sm">
          Enter your order number from your confirmation email. Signed-in customers can also see every order in their account.
        </p>
      </div>
      <TrackOrder />
    </div>
  );
}
