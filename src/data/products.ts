/**
 * VELORA catalogue. Each entry is a compact definition expanded by `build()`
 * into a full `Product`. To add a product, append a definition below — images
 * reference the curated pools in ./images by index.
 */
import { seeded, slugify } from "@/lib/utils";
import { blousePool, dressPool, fabricPool, frockPool, pantsPool, skirtPool } from "./images";
import type { Badge, CategorySlug, Length, Occasion, Product, ProductImage, Size } from "./types";
import { SIZES } from "./types";

type ColourDef = [name: string, hex: string, imageIndexes: number[]];

interface Def {
  name: string;
  sub: string;
  price: number;
  sale?: number;
  colours: ColourDef[];
  fabric: Product["fabricFamily"];
  composition: string;
  occasion: Occasion[];
  length: Length;
  description: string;
  isNew?: boolean;
  best?: boolean;
  limited?: boolean;
  lowStock?: boolean;
  collections?: string[];
  tags?: string[];
}

const pools: Record<CategorySlug, ProductImage[]> = {
  frocks: frockPool,
  dresses: dressPool,
  blouses: blousePool,
  skirts: skirtPool,
  pants: pantsPool,
};

const fabricDetail: Record<Product["fabricFamily"], number> = {
  Linen: 0,
  Cotton: 6,
  Silk: 2,
  Satin: 2,
  Crepe: 3,
  Chiffon: 4,
  Viscose: 7,
  Denim: 8,
  "Wool blend": 5,
};

const careByFabric: Record<Product["fabricFamily"], string[]> = {
  Linen: [
    "Machine wash cold on a gentle cycle",
    "Line dry in the shade",
    "Warm iron while slightly damp",
    "Linen softens beautifully with every wash",
  ],
  Cotton: ["Machine wash at 30°C with similar colours", "Do not tumble dry", "Warm iron on the reverse", "Do not bleach"],
  Silk: ["Dry clean recommended", "Or hand wash cold with a silk detergent", "Dry flat away from direct sun", "Cool iron on the reverse"],
  Satin: ["Hand wash cold or dry clean", "Do not wring", "Hang to dry", "Steam or cool iron on the reverse"],
  Crepe: ["Hand wash cold", "Dry flat", "Cool iron with a pressing cloth", "Do not bleach"],
  Chiffon: ["Dry clean only", "Store hanging to keep the drape", "Cool steam to release creases"],
  Viscose: ["Hand wash cold", "Do not tumble dry", "Reshape and dry flat", "Cool iron"],
  Denim: ["Machine wash cold inside out", "Wash with similar colours", "Line dry", "Warm iron"],
  "Wool blend": ["Dry clean recommended", "Steam to refresh between wears", "Store folded"],
};

const VIEWS = ["front view", "styled view", "alternate view", "detail view"];

function build(category: CategorySlug, def: Def, i: number): Product {
  const slug = slugify(def.name);
  const pool = pools[category];
  const rand = seeded(slug.length * 97 + i * 31 + category.length * 13);

  const colours = def.colours.map(([name, hex, idx], ci) => {
    const images: ProductImage[] = idx.map((n, vi) => {
      const img = pool[n % pool.length];
      return { ...img, alt: `${def.name} in ${name}, ${VIEWS[vi] ?? "view"} — ${img.alt.toLowerCase()}` };
    });
    if (ci === 0) {
      const detail = fabricPool[fabricDetail[def.fabric]];
      images.push({ ...detail, alt: `${def.fabric} fabric close-up of the ${def.name}` });
    }
    return { name, hex, images };
  });

  const sizes = SIZES.map((size: Size) => {
    const r = rand();
    let stock = Math.floor(r * 14) + 2;
    if (r < 0.12) stock = 0;
    if (def.lowStock && (size === "S" || size === "M")) stock = Math.floor(r * 3) + 1;
    if (def.lowStock && size === "XXL") stock = 0;
    return { size, stock };
  });

  const badges: Badge[] = [];
  if (def.isNew) badges.push("New");
  if (def.sale) badges.push("Sale");
  if (def.limited) badges.push("Limited");
  if (def.lowStock) badges.push("Low stock");
  if (def.best) badges.push("Best seller");

  const daysAgo = def.isNew ? Math.floor(rand() * 20) : 30 + Math.floor(rand() * 200);
  const created = new Date(Date.UTC(2026, 10, 8) - daysAgo * 86400000);

  return {
    id: `vl-${category.slice(0, 2)}-${String(i + 1).padStart(3, "0")}`,
    slug,
    name: def.name,
    category,
    subcategory: def.sub,
    price: def.price,
    salePrice: def.sale,
    colours,
    sizes,
    fabric: def.composition,
    fabricFamily: def.fabric,
    care: careByFabric[def.fabric],
    description: def.description,
    details: [
      `${def.length} length, ${def.sub.toLowerCase()} silhouette`,
      `${def.composition}`,
      "Model is 5'7\" and wears a size S",
      "Designed in Colombo, finished by hand",
    ],
    occasion: def.occasion,
    length: def.length,
    rating: Math.round((4.2 + rand() * 0.75) * 10) / 10,
    reviewCount: 12 + Math.floor(rand() * 180),
    badges,
    isNew: Boolean(def.isNew),
    isBestSeller: Boolean(def.best),
    tags: [category, def.sub.toLowerCase(), def.fabric.toLowerCase(), ...(def.tags ?? []), ...def.occasion.map((o) => o.toLowerCase())],
    collections: def.collections ?? [],
    createdAt: created.toISOString(),
    popularity: Math.floor(rand() * 1000) + (def.best ? 1000 : 0),
  };
}

/* ------------------------------------------------------------------ */

const frocks: Def[] = [
  {
    name: "Celeste Linen Midi Frock",
    sub: "Midi",
    price: 8950,
    fabric: "Linen",
    composition: "100% European linen",
    colours: [
      ["Ivory", "#f2ede3", [3, 4, 19]],
      ["Sage", "#a3b18a", [18, 17]],
    ],
    occasion: ["Everyday", "Weekend", "Holiday"],
    length: "Midi",
    isNew: true,
    best: true,
    collections: ["the-linen-edit", "summer-in-colombo"],
    description:
      "A softly gathered midi frock in breathable washed linen. Square neckline, tie-back detail and deep pockets — the piece you'll reach for all season.",
  },
  {
    name: "Marigold Floral Tea Frock",
    sub: "Floral",
    price: 7450,
    sale: 5950,
    fabric: "Viscose",
    composition: "100% LENZING™ ECOVERO™ viscose",
    colours: [
      ["Marigold", "#e3a33a", [0, 8]],
      ["Blush Bloom", "#f1c7c0", [15, 11]],
    ],
    occasion: ["Everyday", "Weekend"],
    length: "Knee",
    best: true,
    collections: ["summer-in-colombo"],
    description:
      "Our bestselling tea frock, printed with a hand-painted marigold motif. Fluttered sleeves, a cinched waist and a skirt that moves when you do.",
  },
  {
    name: "Rosa Polka-Dot Wrap Frock",
    sub: "Wrap",
    price: 7950,
    fabric: "Crepe",
    composition: "Recycled polyester crepe de chine",
    colours: [
      ["Cherry Dot", "#b23a3a", [5, 6]],
      ["Ink Dot", "#1c1a19", [12]],
    ],
    occasion: ["Weekend", "Occasion"],
    length: "Midi",
    isNew: true,
    description:
      "A true wrap frock with a playful polka dot and a fluid, flattering drape. Adjustable tie waist and a neckline that sits just right.",
  },
  {
    name: "Isla Gingham Sun Frock",
    sub: "Casual",
    price: 6450,
    fabric: "Cotton",
    composition: "100% organic cotton seersucker",
    colours: [["Ruby Check", "#c24b4b", [2, 13]]],
    occasion: ["Everyday", "Holiday"],
    length: "Knee",
    lowStock: true,
    collections: ["summer-in-colombo"],
    description:
      "Crisp seersucker gingham with a sweetheart neckline and shirred back. Light enough for the hottest afternoons in the city.",
  },
  {
    name: "Wren Button-Through Frock",
    sub: "Shirt frock",
    price: 8450,
    fabric: "Linen",
    composition: "55% linen, 45% cotton",
    colours: [
      ["Terracotta", "#c06a45", [16, 23]],
      ["Sand", "#d9c7b0", [9, 7]],
    ],
    occasion: ["Everyday", "Office"],
    length: "Midi",
    isNew: true,
    collections: ["the-linen-edit"],
    description:
      "A button-through shirt frock in a linen-cotton blend. Relaxed through the body, defined with a self-tie belt, finished with tortoiseshell buttons.",
  },
  {
    name: "Poppy Tiered Cotton Frock",
    sub: "Tiered",
    price: 6950,
    sale: 5450,
    fabric: "Cotton",
    composition: "100% cotton voile",
    colours: [
      ["Blush", "#f1c7c0", [15, 14]],
      ["Chalk", "#f7f4ee", [10, 1]],
    ],
    occasion: ["Weekend", "Holiday"],
    length: "Midi",
    description: "Three airy tiers of cotton voile, lined for confidence. A gentle V-neck and puff sleeves keep it sweet, never fussy.",
  },
  {
    name: "Liora Strappy Slip Frock",
    sub: "Slip",
    price: 7250,
    fabric: "Satin",
    composition: "Washed satin, 100% viscose",
    colours: [
      ["Champagne", "#e6d3b3", [9, 20]],
      ["Pistachio", "#c2d3a4", [17]],
    ],
    occasion: ["Evening", "Occasion"],
    length: "Midi",
    isNew: true,
    description:
      "Bias-cut washed satin that skims rather than clings. Adjustable straps and a low back — wear it alone or layered over a fine knit.",
  },
  {
    name: "Mira Printed Garden Frock",
    sub: "Floral",
    price: 7650,
    fabric: "Cotton",
    composition: "100% cotton poplin",
    colours: [["Cornflower", "#6f8fc9", [22, 21]]],
    occasion: ["Everyday", "Weekend"],
    length: "Knee",
    best: true,
    description: "A garden-party print on crisp poplin. Fitted bodice, full skirt and a concealed side zip for a clean line.",
  },
  {
    name: "Saffron Day Frock",
    sub: "Casual",
    price: 5950,
    fabric: "Cotton",
    composition: "100% cotton jersey",
    colours: [
      ["Saffron", "#e8b13b", [8, 11]],
      ["Ivory", "#f2ede3", [3]],
    ],
    occasion: ["Everyday"],
    length: "Knee",
    lowStock: true,
    description: "An easy jersey frock with a scoop neck and swingy skirt. Pull it on, add sandals, and you're out the door.",
  },
];

const dresses: Def[] = [
  {
    name: "Aurelia Satin Maxi Dress",
    sub: "Maxi",
    price: 14950,
    fabric: "Satin",
    composition: "Heavy satin, 100% recycled polyester",
    colours: [
      ["Garnet", "#7a1f2b", [10, 0]],
      ["Noir", "#1c1a19", [12, 13]],
    ],
    occasion: ["Evening", "Occasion"],
    length: "Maxi",
    best: true,
    collections: ["evening-muse"],
    description: "Liquid satin cut on the bias for a column silhouette. A cowl neckline, fine straps and a whisper of a train.",
  },
  {
    name: "Evening Muse Sequin Gown",
    sub: "Party",
    price: 24500,
    fabric: "Chiffon",
    composition: "Hand-sequinned chiffon on a soft mesh base",
    colours: [["Amethyst", "#6b4a8a", [14, 16, 11]]],
    occasion: ["Evening", "Occasion"],
    length: "Maxi",
    isNew: true,
    limited: true,
    collections: ["evening-muse"],
    description:
      "Hand-sequinned in our atelier over 30 hours. A thigh-high split, sculpted bodice and enough shimmer to catch every candle in the room.",
  },
  {
    name: "Verdant Long-Sleeve Maxi",
    sub: "Maxi",
    price: 12950,
    fabric: "Viscose",
    composition: "100% viscose twill",
    colours: [["Forest", "#3e5a3a", [1, 3]]],
    occasion: ["Occasion", "Weekend"],
    length: "Maxi",
    description: "Sweeping viscose with blouson sleeves and a smocked cuff. Romantic, easy, and quietly dramatic.",
  },
  {
    name: "Solène White Maxi Dress",
    sub: "Maxi",
    price: 11950,
    sale: 8950,
    fabric: "Linen",
    composition: "100% washed linen",
    colours: [["White", "#f6f2ea", [2, 6, 20]]],
    occasion: ["Holiday", "Weekend"],
    length: "Maxi",
    collections: ["the-linen-edit", "summer-in-colombo"],
    description: "A breezy white maxi in washed linen with a tiered skirt and open back. Made for sea air and long lunches.",
  },
  {
    name: "Emerald Hour Gown",
    sub: "Party",
    price: 21500,
    fabric: "Chiffon",
    composition: "Metallic chiffon, fully lined",
    colours: [["Emerald", "#1f5c45", [15, 23]]],
    occasion: ["Evening", "Occasion"],
    length: "Maxi",
    isNew: true,
    collections: ["evening-muse"],
    description: "Shimmering emerald chiffon with a draped bodice and a skirt that pools at the floor. For the nights you'll remember.",
  },
  {
    name: "Juniper Floral Midi Dress",
    sub: "Midi",
    price: 9950,
    fabric: "Viscose",
    composition: "100% LENZING™ ECOVERO™ viscose",
    colours: [["Sunflower", "#e2b13c", [8, 9]]],
    occasion: ["Everyday", "Weekend"],
    length: "Midi",
    best: true,
    collections: ["summer-in-colombo"],
    description: "A floaty floral midi with a V-neck, puff sleeves and a smocked waist that flatters every shape.",
  },
  {
    name: "Coastline Red Midi Dress",
    sub: "Midi",
    price: 10950,
    fabric: "Crepe",
    composition: "Stretch crepe, 95% polyester, 5% elastane",
    colours: [["Scarlet", "#b3262e", [5, 17, 24]]],
    occasion: ["Occasion", "Evening"],
    length: "Midi",
    description: "A sculpted red midi that does all the talking. Structured crepe, a square neck and a back slit for movement.",
  },
  {
    name: "Odette Wrap Midi Dress",
    sub: "Office",
    price: 10450,
    fabric: "Crepe",
    composition: "Matte crepe, 100% polyester",
    colours: [
      ["Wildflower", "#b05a4a", [19, 4]],
      ["Cocoa", "#7b5a43", [26, 27]],
    ],
    occasion: ["Office", "Everyday"],
    length: "Midi",
    collections: ["office-hours"],
    description: "A wrap midi that moves from desk to dinner. Matte crepe that resists creasing and a waist tie you can style three ways.",
  },
  {
    name: "Selene Off-Shoulder Dress",
    sub: "Casual",
    price: 9450,
    sale: 7450,
    fabric: "Cotton",
    composition: "100% cotton gauze",
    colours: [["Oat", "#d8c6a6", [21, 7]]],
    occasion: ["Holiday", "Weekend"],
    length: "Maxi",
    isNew: true,
    description: "Soft double-gauze cotton with an elasticated off-shoulder neckline and a relaxed, swingy skirt.",
  },
  {
    name: "Nocturne Little Black Dress",
    sub: "Mini",
    price: 11450,
    fabric: "Crepe",
    composition: "Stretch crepe with satin trim",
    colours: [["Noir", "#1c1a19", [13, 22, 25]]],
    occasion: ["Evening", "Occasion"],
    length: "Mini",
    best: true,
    collections: ["evening-muse"],
    description: "Every wardrobe needs one. A sleek, sleeveless black dress with a satin-trimmed neckline and a perfect hem.",
  },
];

const blouses: Def[] = [
  {
    name: "Aria Puff-Sleeve Blouse",
    sub: "Puff sleeve",
    price: 5950,
    fabric: "Cotton",
    composition: "100% cotton poplin",
    colours: [["Ivory", "#f6f2ea", [5, 6, 13]]],
    occasion: ["Office", "Everyday"],
    length: "Hip",
    best: true,
    collections: ["office-hours"],
    description: "Crisp cotton poplin with sculpted puff sleeves and a covered placket. Tuck it in or wear it loose.",
  },
  {
    name: "Scarlett Satin Shirt",
    sub: "Shirt",
    price: 6950,
    fabric: "Satin",
    composition: "Washed satin, 100% viscose",
    colours: [["Cherry", "#a8232f", [8, 9]]],
    occasion: ["Evening", "Office"],
    length: "Hip",
    isNew: true,
    collections: ["evening-muse"],
    description: "A fluid satin shirt in a deep cherry red. Relaxed fit, mother-of-pearl buttons, made to be worn with tailoring.",
  },
  {
    name: "Ruby Silk Blouse",
    sub: "Silk",
    price: 7450,
    fabric: "Silk",
    composition: "100% mulberry silk, 19 momme",
    colours: [["Ruby", "#9e2a35", [0, 1, 18]]],
    occasion: ["Office", "Evening"],
    length: "Hip",
    best: true,
    description: "Pure mulberry silk with a soft round neck and a back keyhole. Light as air and impossibly soft against the skin.",
  },
  {
    name: "Clara Classic Poplin Shirt",
    sub: "Shirt",
    price: 4950,
    fabric: "Cotton",
    composition: "100% organic cotton",
    colours: [["White", "#fbfaf7", [3, 7, 2]]],
    occasion: ["Office", "Everyday"],
    length: "Hip",
    collections: ["office-hours"],
    description: "The perfect white shirt — a touch oversized with a curved hem and dropped shoulder. Endlessly wearable.",
  },
  {
    name: "Nova Silk Shell Top",
    sub: "Sleeveless",
    price: 5450,
    sale: 4250,
    fabric: "Silk",
    composition: "Silk blend, 70% silk, 30% cotton",
    colours: [
      ["White", "#fbfaf7", [4, 11]],
      ["Sand", "#d9c7b0", [10]],
    ],
    occasion: ["Office", "Evening"],
    length: "Hip",
    description: "A sleeveless shell in a silk-cotton blend. Clean neckline, hidden back button, layers beautifully under blazers.",
  },
  {
    name: "Margot Long-Sleeve Blouse",
    sub: "Long sleeve",
    price: 5650,
    fabric: "Crepe",
    composition: "Fluid crepe, 100% polyester",
    colours: [
      ["Noir", "#1c1a19", [12]],
      ["Moss", "#5c6b4a", [14]],
    ],
    occasion: ["Office"],
    length: "Hip",
    collections: ["office-hours"],
    description: "Fluid crepe that drapes rather than clings. Long cuffed sleeves and a softly gathered yoke.",
  },
  {
    name: "Elodie Eyelet Blouse",
    sub: "Broderie",
    price: 5250,
    fabric: "Cotton",
    composition: "100% cotton broderie anglaise",
    colours: [["White", "#fbfaf7", [16, 13]]],
    occasion: ["Weekend", "Holiday"],
    length: "Hip",
    isNew: true,
    collections: ["summer-in-colombo"],
    description: "Delicate broderie anglaise with scalloped edges and tie sleeves. Sweet with denim, polished with a midi skirt.",
  },
  {
    name: "Sunny Halter Top",
    sub: "Halter",
    price: 4450,
    sale: 3450,
    fabric: "Linen",
    composition: "100% linen",
    colours: [["Butter", "#f2e3a0", [15]]],
    occasion: ["Holiday", "Weekend"],
    length: "Cropped",
    lowStock: true,
    collections: ["the-linen-edit"],
    description: "A cropped halter in soft butter-yellow linen with a tie neck. Summer, distilled.",
  },
  {
    name: "Hazel Gingham Shirt",
    sub: "Shirt",
    price: 5450,
    fabric: "Cotton",
    composition: "100% cotton yarn-dyed gingham",
    colours: [["Mono Check", "#3a3a3a", [17]]],
    occasion: ["Office", "Everyday"],
    length: "Hip",
    description: "Yarn-dyed gingham in a boxy shape with chest pockets. Smart enough for meetings, easy enough for weekends.",
  },
  {
    name: "Florence Printed Blouse",
    sub: "Printed",
    price: 6250,
    fabric: "Viscose",
    composition: "100% viscose crepe",
    colours: [["Bloom Print", "#c86b55", [19]]],
    occasion: ["Office", "Weekend"],
    length: "Hip",
    isNew: true,
    description: "A painterly floral blouse with a relaxed collar — gorgeous under a houndstooth blazer.",
  },
];

const skirts: Def[] = [
  {
    name: "Lumière Satin Midi Skirt",
    sub: "Midi",
    price: 6950,
    fabric: "Satin",
    composition: "Washed satin, 100% viscose",
    colours: [["Noir", "#1c1a19", [0, 6]]],
    occasion: ["Office", "Evening"],
    length: "Midi",
    best: true,
    collections: ["evening-muse", "office-hours"],
    description: "A bias-cut satin slip skirt with an elasticated waist. Pair with a crisp shirt by day, a silk cami by night.",
  },
  {
    name: "Delphine Floral Wrap Skirt",
    sub: "Wrap",
    price: 6450,
    fabric: "Cotton",
    composition: "100% cotton lawn",
    colours: [["Delft Bloom", "#5f7fb5", [1, 4]]],
    occasion: ["Weekend", "Holiday"],
    length: "Midi",
    isNew: true,
    collections: ["summer-in-colombo"],
    description: "A true wrap skirt in printed cotton lawn with a ruffle hem. Ties at the side, adjusts to you.",
  },
  {
    name: "Coco Polka-Dot Midi Skirt",
    sub: "A-line",
    price: 5950,
    fabric: "Viscose",
    composition: "100% viscose",
    colours: [["Rouge Dot", "#b5353d", [2]]],
    occasion: ["Weekend", "Everyday"],
    length: "Midi",
    description: "A swishy A-line midi in a cheerful polka dot. Elasticated back waist and hidden side pockets.",
  },
  {
    name: "Dahlia Embellished Denim Skirt",
    sub: "Denim",
    price: 7250,
    fabric: "Denim",
    composition: "100% cotton rigid denim",
    colours: [["Chalk Denim", "#eeeae2", [3]]],
    occasion: ["Weekend"],
    length: "Midi",
    isNew: true,
    limited: true,
    description: "White rigid denim hand-embellished with crystal detailing. A statement in the most relaxed way.",
  },
  {
    name: "Wisteria Floral Midi Skirt",
    sub: "Midi",
    price: 6750,
    fabric: "Chiffon",
    composition: "Printed chiffon, lined",
    colours: [["Noir Floral", "#2a2526", [5, 15]]],
    occasion: ["Office", "Occasion"],
    length: "Midi",
    description: "A tiered chiffon midi printed with dark florals. Lined, light and quietly romantic.",
  },
  {
    name: "Marina White Midi Skirt",
    sub: "Midi",
    price: 6250,
    fabric: "Linen",
    composition: "100% washed linen",
    colours: [["White", "#fbfaf7", [8, 11, 13]]],
    occasion: ["Holiday", "Weekend"],
    length: "Midi",
    best: true,
    collections: ["the-linen-edit", "summer-in-colombo"],
    description: "A flared white linen midi with a high, flat-front waist. The easiest way to look effortlessly put-together.",
  },
  {
    name: "Ingrid A-Line Mini Skirt",
    sub: "Mini",
    price: 4950,
    sale: 3950,
    fabric: "Wool blend",
    composition: "Wool-blend suiting",
    colours: [["Noir", "#1c1a19", [7, 10]]],
    occasion: ["Office", "Everyday"],
    length: "Mini",
    lowStock: true,
    description: "A tailored A-line mini in soft suiting. Back zip, clean lines, sharp with loafers or boots.",
  },
  {
    name: "Sienna Pleated Midi Skirt",
    sub: "Pleated",
    price: 5750,
    fabric: "Crepe",
    composition: "Permanently pleated crepe",
    colours: [["Pearl", "#f3efe6", [16, 12]]],
    occasion: ["Office", "Occasion"],
    length: "Midi",
    isNew: true,
    description: "Fine knife pleats that catch the light with every step. Elasticated waist, endless movement.",
  },
  {
    name: "Saffron Print Skirt",
    sub: "Printed",
    price: 5450,
    fabric: "Viscose",
    composition: "100% viscose twill",
    colours: [["Ochre Print", "#c9963e", [17, 14]]],
    occasion: ["Office", "Weekend"],
    length: "Knee",
    description: "A knee-length skirt in a warm graphic print. Wear it with a turtleneck for an editorial edge.",
  },
];

const pants: Def[] = [
  {
    name: "Mila Wide-Leg Linen Trousers",
    sub: "Wide-leg",
    price: 6950,
    fabric: "Linen",
    composition: "100% washed linen",
    colours: [
      ["Sand", "#d9c7b0", [7, 4]],
      ["Mustard", "#cf9d3a", [6]],
    ],
    occasion: ["Everyday", "Holiday", "Office"],
    length: "Full length",
    best: true,
    collections: ["the-linen-edit"],
    description: "Our signature wide-leg in washed linen. High rise, front pleats and a fluid leg that elongates beautifully.",
  },
  {
    name: "Theo Tailored Trousers",
    sub: "Tailored",
    price: 7450,
    fabric: "Wool blend",
    composition: "Stretch wool-blend suiting",
    colours: [
      ["Navy", "#2b3a5a", [0]],
      ["Noir", "#1c1a19", [17]],
    ],
    occasion: ["Office"],
    length: "Full length",
    collections: ["office-hours"],
    description: "Pressed-crease tailored trousers with a slim straight leg. The quiet foundation of a working wardrobe.",
  },
  {
    name: "Sunset Wide Trousers",
    sub: "Wide-leg",
    price: 6450,
    sale: 4950,
    fabric: "Crepe",
    composition: "Fluid crepe, 100% polyester",
    colours: [["Tangerine", "#d9672a", [1]]],
    occasion: ["Weekend", "Holiday"],
    length: "Full length",
    description: "Statement tangerine in a fluid crepe that swings as you walk. Elastic back waist for all-day ease.",
  },
  {
    name: "Haven Drawstring Linen Pants",
    sub: "Relaxed",
    price: 5950,
    fabric: "Linen",
    composition: "100% linen",
    colours: [
      ["Cocoa", "#7b5a43", [3]],
      ["Paprika", "#b8432f", [10]],
    ],
    occasion: ["Everyday", "Holiday"],
    length: "Full length",
    collections: ["the-linen-edit"],
    description: "Relaxed linen pants with a drawstring waist and side pockets. Weekend comfort, weekday polish.",
  },
  {
    name: "Ellery High-Waist Trousers",
    sub: "Tailored",
    price: 6950,
    fabric: "Cotton",
    composition: "Cotton twill with 2% elastane",
    colours: [
      ["Optic White", "#fbfaf7", [4]],
      ["Buttercup", "#e6c44d", [2]],
    ],
    occasion: ["Office", "Everyday"],
    length: "Full length",
    isNew: true,
    collections: ["office-hours"],
    description: "A high-waisted straight leg with a fine belt. Crisp cotton twill, softened with a touch of stretch.",
  },
  {
    name: "Palma Print Wide-Leg Pants",
    sub: "Printed",
    price: 6250,
    fabric: "Viscose",
    composition: "100% viscose",
    colours: [
      ["Palm Print", "#b44a3a", [14, 13]],
      ["Garden Print", "#5d7a4b", [15, 18]],
    ],
    occasion: ["Holiday", "Weekend"],
    length: "Full length",
    isNew: true,
    collections: ["summer-in-colombo"],
    description: "Fluid wide-leg pants in a bold tropical print. Pull-on waist, pockets, and endless holiday energy.",
  },
  {
    name: "Ivy Cropped Trousers",
    sub: "Cropped",
    price: 5450,
    fabric: "Cotton",
    composition: "Cotton twill",
    colours: [
      ["Pistachio", "#b7c99a", [9, 11]],
      ["Lavender", "#b9a7d1", [8]],
    ],
    occasion: ["Everyday", "Weekend"],
    length: "Cropped",
    description: "Cropped above the ankle with a drawstring waist. Show off your favourite sandals.",
  },
  {
    name: "Sloane Suit Trousers",
    sub: "Tailored",
    price: 8950,
    fabric: "Wool blend",
    composition: "Wool-blend suiting, fully lined",
    colours: [
      ["Cocoa", "#6e4f3a", [19]],
      ["Slate", "#8a8a8a", [21]],
      ["Noir", "#1c1a19", [20]],
    ],
    occasion: ["Office", "Occasion"],
    length: "Full length",
    best: true,
    collections: ["office-hours"],
    description: "The trouser from our best-loved suit. Flat front, gentle flare and a lining that glides.",
  },
  {
    name: "Indigo Tie-Waist Denim",
    sub: "Denim",
    price: 6450,
    fabric: "Denim",
    composition: "100% cotton denim",
    colours: [["Indigo", "#3d5a8a", [16, 12]]],
    occasion: ["Weekend", "Everyday"],
    length: "Full length",
    isNew: true,
    description: "Mid-wash denim with a paperbag tie waist and a wide, relaxed leg.",
  },
  {
    name: "Monochrome Geo Trousers",
    sub: "Printed",
    price: 5950,
    sale: 4450,
    fabric: "Viscose",
    composition: "100% viscose",
    colours: [["Mono Geo", "#1c1a19", [5]]],
    occasion: ["Weekend", "Office"],
    length: "Full length",
    lowStock: true,
    description: "Wide-leg trousers printed with a graphic monochrome geo. Bold, but easy to wear.",
  },
];

export const products: Product[] = [
  ...frocks.map((d, i) => build("frocks", d, i)),
  ...dresses.map((d, i) => build("dresses", d, i)),
  ...blouses.map((d, i) => build("blouses", d, i)),
  ...skirts.map((d, i) => build("skirts", d, i)),
  ...pants.map((d, i) => build("pants", d, i)),
];
