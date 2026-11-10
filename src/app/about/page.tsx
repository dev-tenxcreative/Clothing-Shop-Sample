import type { Metadata } from "next";
import { AboutStory } from "@/components/brand/AboutStory";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "VELORA is a modern womenswear label designed and made in Colombo since 2018. Discover our story, mission, atelier, craftsmanship and sustainability commitment.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return <AboutStory />;
}
