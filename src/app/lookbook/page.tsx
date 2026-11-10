import type { Metadata } from "next";
import { LookbookStory } from "@/components/shop/LookbookStory";

export const metadata: Metadata = {
  title: "Lookbook",
  description: "The VELORA Summer 2026 lookbook — linen by the sea, satin after dark and tailoring for the city.",
  alternates: { canonical: "/lookbook" },
};

export default function LookbookPage() {
  return <LookbookStory />;
}
