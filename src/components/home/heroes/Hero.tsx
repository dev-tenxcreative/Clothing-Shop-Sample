import { siteConfig } from "@/config/site";
import { HeroCinematic } from "./HeroCinematic";
import { HeroFabric } from "./HeroFabric";
import { HeroSplit } from "./HeroSplit";

/** Picks the hero variant set in `src/config/site.ts` (`heroVariant`). */
export function Hero() {
  switch (siteConfig.heroVariant) {
    case "split":
      return <HeroSplit />;
    case "fabric":
      return <HeroFabric />;
    default:
      return <HeroCinematic />;
  }
}
