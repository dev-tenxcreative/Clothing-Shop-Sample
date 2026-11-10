import { dressPool, blousePool, frockPool, lifestyleImages, pantsPool, skirtPool, atelierImages, boutiqueImages } from "./images";
import type { Category, CategorySlug, Collection } from "./types";

export const categories: Category[] = [
  {
    slug: "frocks",
    name: "Frocks",
    tagline: "Sunlit, easy, endlessly pretty.",
    intro: "Light frocks in linen, cotton and soft viscose — made for long days, warm evenings and everything in between.",
    banner: frockPool[13],
    card: frockPool[0],
    subcategories: ["Midi", "Floral", "Wrap", "Shirt frock", "Tiered", "Slip", "Casual"],
  },
  {
    slug: "blouses",
    name: "Blouses",
    tagline: "The quiet heroes of the wardrobe.",
    intro: "Silk, satin and crisp cotton blouses cut to tuck, knot and layer — from Monday meetings to Saturday lunch.",
    banner: blousePool[2],
    card: blousePool[0],
    subcategories: ["Shirt", "Silk", "Puff sleeve", "Sleeveless", "Long sleeve", "Broderie", "Printed"],
  },
  {
    slug: "skirts",
    name: "Skirts",
    tagline: "Movement, in every step.",
    intro: "Midi, pleated and wrap skirts that swish, sway and flatter. Pair with a blouse and you're dressed.",
    banner: skirtPool[9],
    card: skirtPool[8],
    subcategories: ["Midi", "Wrap", "A-line", "Pleated", "Mini", "Denim", "Printed"],
  },
  {
    slug: "pants",
    name: "Pants",
    tagline: "Tailoring with a softer hand.",
    intro: "Wide-leg linen, sharp suiting and relaxed drawstring pants — designed to move from desk to dinner.",
    banner: pantsPool[20],
    card: pantsPool[19],
    subcategories: ["Wide-leg", "Tailored", "Relaxed", "Cropped", "Printed", "Denim"],
  },
  {
    slug: "dresses",
    name: "Dresses",
    tagline: "For the moments worth dressing for.",
    intro: "Maxi, midi and evening dresses in satin, chiffon and linen — from garden weddings to candlelit dinners.",
    banner: dressPool[5],
    card: dressPool[10],
    subcategories: ["Maxi", "Midi", "Mini", "Party", "Office", "Casual"],
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const categorySlugs = categories.map((c) => c.slug) as CategorySlug[];

export const collections: Collection[] = [
  {
    slug: "the-linen-edit",
    name: "The Linen Edit",
    eyebrow: "Summer 2026",
    description: "Washed linen in sand, sage and ivory — breathable pieces that soften with every wear.",
    story:
      "We sourced our linen from a family mill that has woven flax for four generations. Each piece is garment-washed for a lived-in softness from the very first wear, then finished by hand in our Colombo atelier.",
    image: lifestyleImages.seaside,
    secondary: frockPool[19],
  },
  {
    slug: "evening-muse",
    name: "Evening Muse",
    eyebrow: "Occasion",
    description: "Satin, sequins and chiffon for candlelit dinners, weddings and nights you'll remember.",
    story:
      "Evening Muse began with a single question: what does it feel like to be the most at-ease person in the room? The answer is liquid satin, considered draping and hand-sewn sequins that move with you.",
    image: dressPool[15],
    secondary: dressPool[11],
  },
  {
    slug: "office-hours",
    name: "Office Hours",
    eyebrow: "Workwear",
    description: "Crisp blouses, fluid trousers and polished skirts for the working week — softened, never stiff.",
    story:
      "Office Hours is tailoring that remembers you have a life outside the meeting room: crease-resistant crepes, breathable cottons and silhouettes that carry you from 9am to dinner.",
    image: pantsPool[20],
    secondary: blousePool[5],
  },
  {
    slug: "summer-in-colombo",
    name: "Summer in Colombo",
    eyebrow: "Holiday",
    description: "Prints, colour and lightness — inspired by our home city's markets, gardens and sea breeze.",
    story:
      "Marigold garlands at the flower market, the blue of Galle Face at dusk, frangipani on the pavement — Summer in Colombo is a love letter to the city where every VELORA piece is designed.",
    image: lifestyleImages.field,
    secondary: frockPool[11],
  },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);

/* Mega-menu configuration ------------------------------------------- */

export interface NavItem {
  label: string;
  href: string;
  columns?: { title: string; links: { label: string; href: string }[] }[];
  feature?: { title: string; href: string; image: (typeof frockPool)[number]; cta: string };
  highlight?: boolean;
}

const subLinks = (slug: CategorySlug) =>
  getCategory(slug)!.subcategories.map((s) => ({ label: s, href: `/shop/${slug}?sub=${encodeURIComponent(s)}` }));

export const mainNav: NavItem[] = [
  {
    label: "New In",
    href: "/new-in",
    columns: [
      {
        title: "Just landed",
        links: [
          { label: "All new arrivals", href: "/new-in" },
          { label: "New frocks", href: "/shop/frocks?new=1" },
          { label: "New dresses", href: "/shop/dresses?new=1" },
          { label: "New blouses", href: "/shop/blouses?new=1" },
        ],
      },
      {
        title: "Collections",
        links: [
          { label: "The Linen Edit", href: "/collections/the-linen-edit" },
          { label: "Evening Muse", href: "/collections/evening-muse" },
          { label: "Office Hours", href: "/collections/office-hours" },
          { label: "Summer in Colombo", href: "/collections/summer-in-colombo" },
        ],
      },
    ],
    feature: { title: "The Linen Edit", href: "/collections/the-linen-edit", image: lifestyleImages.seaside, cta: "Shop the edit" },
  },
  {
    label: "Frocks",
    href: "/shop/frocks",
    columns: [
      { title: "Shop by style", links: subLinks("frocks") },
      {
        title: "Occasion",
        links: [
          { label: "Everyday", href: "/shop/frocks?occasion=Everyday" },
          { label: "Weekend", href: "/shop/frocks?occasion=Weekend" },
          { label: "Holiday", href: "/shop/frocks?occasion=Holiday" },
        ],
      },
    ],
    feature: { title: "Summer in Colombo", href: "/collections/summer-in-colombo", image: frockPool[11], cta: "Shop the edit" },
  },
  {
    label: "Blouses",
    href: "/shop/blouses",
    columns: [
      { title: "Shop by style", links: subLinks("blouses") },
      {
        title: "Occasion",
        links: [
          { label: "Office", href: "/shop/blouses?occasion=Office" },
          { label: "Evening", href: "/shop/blouses?occasion=Evening" },
          { label: "Weekend", href: "/shop/blouses?occasion=Weekend" },
        ],
      },
    ],
    feature: { title: "Office Hours", href: "/collections/office-hours", image: blousePool[5], cta: "Shop the edit" },
  },
  {
    label: "Skirts",
    href: "/shop/skirts",
    columns: [
      { title: "Shop by style", links: subLinks("skirts") },
      {
        title: "Length",
        links: [
          { label: "Mini", href: "/shop/skirts?length=Mini" },
          { label: "Knee", href: "/shop/skirts?length=Knee" },
          { label: "Midi", href: "/shop/skirts?length=Midi" },
        ],
      },
    ],
    feature: { title: "Soft movement", href: "/shop/skirts", image: skirtPool[11], cta: "Shop skirts" },
  },
  {
    label: "Pants",
    href: "/shop/pants",
    columns: [
      { title: "Shop by style", links: subLinks("pants") },
      {
        title: "Occasion",
        links: [
          { label: "Office", href: "/shop/pants?occasion=Office" },
          { label: "Everyday", href: "/shop/pants?occasion=Everyday" },
          { label: "Holiday", href: "/shop/pants?occasion=Holiday" },
        ],
      },
    ],
    feature: { title: "Tailoring, softened", href: "/collections/office-hours", image: pantsPool[20], cta: "Shop the edit" },
  },
  {
    label: "Dresses",
    href: "/shop/dresses",
    columns: [
      { title: "Shop by style", links: subLinks("dresses") },
      {
        title: "Occasion",
        links: [
          { label: "Evening", href: "/shop/dresses?occasion=Evening" },
          { label: "Office", href: "/shop/dresses?occasion=Office" },
          { label: "Weekend", href: "/shop/dresses?occasion=Weekend" },
        ],
      },
    ],
    feature: { title: "Evening Muse", href: "/collections/evening-muse", image: dressPool[15], cta: "Shop the edit" },
  },
  { label: "Sale", href: "/sale", highlight: true },
];

export const ourWorldNav = [
  { label: "Our Story", href: "/about" },
  { label: "Lookbook", href: "/lookbook" },
  { label: "Stores", href: "/stores" },
  { label: "Contact", href: "/contact" },
];

export const helpNav = [
  { label: "FAQ", href: "/faq" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "Shipping & Returns", href: "/shipping-returns" },
  { label: "Track Order", href: "/track-order" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms", href: "/terms" },
];

/* Stores ------------------------------------------------------------ */

export const stores = [
  {
    name: "VELORA Ward Place",
    city: "Colombo 07",
    address: "42 Ward Place, Colombo 07",
    phone: "+94 11 234 5678",
    hours: "Mon–Sat 10:00–20:00 · Sun 11:00–17:00",
    image: boutiqueImages.interior,
    flagship: true,
  },
  {
    name: "VELORA Galle Fort",
    city: "Galle",
    address: "18 Church Street, Galle Fort",
    phone: "+94 91 223 4567",
    hours: "Daily 10:00–19:00",
    image: boutiqueImages.neutral,
    flagship: false,
  },
  {
    name: "VELORA Kandy",
    city: "Kandy",
    address: "7 Temple Street, Kandy",
    phone: "+94 81 220 9876",
    hours: "Mon–Sat 10:00–19:00",
    image: boutiqueImages.windowRack,
    flagship: false,
  },
];

/* Reviews ----------------------------------------------------------- */

export const testimonials = [
  {
    name: "Amaya P.",
    city: "Colombo",
    rating: 5,
    product: "Celeste Linen Midi Frock",
    quote: "The linen is beautiful — soft from the first wear and the fit is perfect. I've been stopped twice asking where it's from.",
  },
  {
    name: "Nadeesha R.",
    city: "Kandy",
    rating: 5,
    product: "Aurelia Satin Maxi Dress",
    quote: "Wore it to my sister's wedding and felt incredible all night. The satin moves like water.",
  },
  {
    name: "Sophie L.",
    city: "Galle",
    rating: 5,
    product: "Mila Wide-Leg Linen Trousers",
    quote: "Finally trousers that are elegant and comfortable. I bought a second colour within a week.",
  },
  {
    name: "Tharushi D.",
    city: "Negombo",
    rating: 4,
    product: "Aria Puff-Sleeve Blouse",
    quote: "Crisp, polished and so easy to style for the office. Delivery was quicker than expected too.",
  },
  {
    name: "Hannah W.",
    city: "Colombo",
    rating: 5,
    product: "Nocturne Little Black Dress",
    quote: "The most flattering black dress I own. The quality feels far beyond the price.",
  },
  {
    name: "Dilini S.",
    city: "Matara",
    rating: 5,
    product: "Marina White Midi Skirt",
    quote: "Gorgeous fabric and the waist sits exactly right. Packaging was lovely — felt like a gift.",
  },
];

export const productReviews = [
  {
    name: "Ishara K.",
    rating: 5,
    title: "Beautiful quality",
    body: "Even nicer in person. The fabric feels luxurious and the stitching is immaculate.",
    size: "S",
    fit: "True to size",
    date: "2026-10-22",
  },
  {
    name: "Rachel M.",
    rating: 4,
    title: "Lovely, slightly long",
    body: "Fits well through the body. I'm 5'3\" so it sits a little longer, but I love the drape.",
    size: "M",
    fit: "True to size",
    date: "2026-10-09",
  },
  {
    name: "Kavya N.",
    rating: 5,
    title: "My new favourite",
    body: "Wore it all day without a single crease. Already planning to order another colour.",
    size: "XS",
    fit: "True to size",
    date: "2026-09-28",
  },
  {
    name: "Ama F.",
    rating: 5,
    title: "Compliments everywhere",
    body: "So many people asked where it was from. Easy returns gave me confidence to try it.",
    size: "L",
    fit: "Slightly roomy",
    date: "2026-09-14",
  },
];

/* FAQ --------------------------------------------------------------- */

export const faqs = [
  {
    topic: "Orders & Payment",
    items: [
      {
        q: "Which payment methods do you accept?",
        a: "We accept Visa, Mastercard and American Express, as well as Cash on Delivery within Sri Lanka. All card payments are processed through a PCI-DSS compliant payment partner — we never see or store your card details.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "If your order hasn't been dispatched, we can amend or cancel it. Contact us within 2 hours of ordering via WhatsApp or email and we'll do our best to help.",
      },
      {
        q: "Do you offer gift wrapping?",
        a: "Every VELORA order arrives in our signature recycled tissue and box. Add a handwritten note at checkout at no extra cost.",
      },
    ],
  },
  {
    topic: "Delivery",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 3–5 working days island-wide. Express delivery arrives in 1–2 working days for Colombo and suburbs.",
      },
      { q: "Is delivery free?", a: "Delivery is complimentary on orders over Rs. 15,000. Below that, standard delivery is Rs. 450." },
      {
        q: "Do you ship internationally?",
        a: "We currently ship within Sri Lanka. International shipping to the Maldives, India and the UAE is coming soon — join the VELORA Circle to be the first to know.",
      },
    ],
  },
  {
    topic: "Returns & Exchanges",
    items: [
      {
        q: "What is your returns policy?",
        a: "You can return unworn items with tags attached within 14 days of delivery for a full refund or exchange.",
      },
      {
        q: "How do I start a return?",
        a: "Go to your account, choose the order and select 'Return items', or message us on WhatsApp. We'll arrange a free collection from your door.",
      },
      { q: "Are sale items returnable?", a: "Yes — sale items can be returned within 14 days, unless marked as final sale." },
    ],
  },
  {
    topic: "Sizing & Care",
    items: [
      {
        q: "How do I find my size?",
        a: "Use our Size Guide for measurements by category. Each product page also lists the model's height and size, plus fit notes from our customers.",
      },
      {
        q: "How should I care for linen?",
        a: "Machine wash cold on a gentle cycle and line dry in the shade. Linen softens beautifully with every wash — a few creases are part of its charm.",
      },
      {
        q: "Do you offer alterations?",
        a: "Complimentary hem alterations are available at our Ward Place flagship for full-price purchases.",
      },
    ],
  },
];

/* Brand ------------------------------------------------------------- */

export const timeline = [
  {
    year: "2018",
    title: "A sketchbook and a sewing machine",
    body: "Founder Nethmi Perera starts making frocks for friends from a spare room in Colombo.",
  },
  { year: "2019", title: "The first collection", body: "Twelve pieces in linen and cotton sell out in nine days at a weekend pop-up." },
  { year: "2021", title: "Our own atelier", body: "VELORA opens a light-filled studio on Ward Place, bringing every stitch in-house." },
  {
    year: "2023",
    title: "Responsible fabrics",
    body: "We move to 80% certified, recycled or natural fibres and launch our repair service.",
  },
  { year: "2025", title: "Galle & Kandy", body: "Two new boutiques open, each designed with local craftspeople." },
  { year: "2026", title: "The VELORA Circle", body: "More than 48,000 women now wear VELORA — and we're only getting started." },
];

export const craftSteps = [
  {
    title: "Design",
    body: "Every piece begins as a sketch in our Colombo studio, refined over weeks of fittings.",
    image: atelierImages.sketching,
  },
  {
    title: "Fabric",
    body: "We select linens, silks and cottons from mills we know by name — natural, certified or recycled.",
    image: atelierImages.spools,
  },
  {
    title: "Stitch",
    body: "Our team of 34 makers cut and sew each garment in small batches, by hand and machine.",
    image: atelierImages.cutting,
  },
  {
    title: "Quality Check",
    body: "Every seam, button and hem is checked twice before it's pressed and wrapped.",
    image: atelierImages.fitting,
  },
  {
    title: "You",
    body: "Delivered in recycled tissue with a handwritten note — ready to be worn and loved.",
    image: lifestyleImages.bouquet,
  },
];
