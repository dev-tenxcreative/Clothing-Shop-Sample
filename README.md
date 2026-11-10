# VELORA — *Grace, in every thread.*

A production-quality, fully responsive e-commerce storefront for **VELORA**, a modern women’s clothing label (frocks, blouses, skirts, pants and dresses). Built with the Next.js App Router, TypeScript and Tailwind CSS, with editorial motion design throughout.

> This is a front-end complete demo: catalogue, cart, wishlist, checkout and account flows all work in the browser with local data and a mock payment gateway, structured so a real CMS, auth provider and payment gateway can be plugged in.

---

## Tech stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router, static generation) + React 19 + TypeScript |
| Styling | Tailwind CSS v4 with brand design tokens (`src/app/globals.css`) |
| Motion | Framer Motion (components, page transitions), GSAP + ScrollTrigger (parallax, pinned scroll), Lenis (smooth scroll) |
| Carousels | Swiper |
| State | Zustand (cart, wishlist, recently viewed, account, checkout) persisted to local/session storage |
| Forms | React Hook Form + Zod |
| Icons | lucide-react + custom SVG brand/payment marks |
| Images | `next/image` with a custom CDN loader (Unsplash/Pexels), blur placeholders, elegant fallback |

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build (85 statically generated pages) |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint (Next.js core-web-vitals + React compiler rules) |
| `npm run typecheck` | TypeScript, no emit |
| `npm run format` | Prettier (+ Tailwind class sorting) |

Requires Node.js 20.9+. Set `NEXT_PUBLIC_SITE_URL` in production so canonical URLs, Open Graph tags and the sitemap use your domain.

## Project structure

```
src/
  app/                 Routes (App Router) — every page, sitemap, robots, manifest, 404, error
  components/
    brand/             Logo/monogram SVGs, About story, info pages (contact, FAQ, tracking), legal layout
    layout/            Header + mega menu, mobile menu, footer, cart drawer, search overlay
    home/              Hero variants (heroes/), homepage sections, testimonials
    product/           Product card, carousel, gallery, purchase panel, reviews, quick view, size guide
    shop/              Listing with filters, price slider, page header, lookbook
    checkout/          Cart page, wishlist page, multi-step checkout, card form, confirmation
    account/           Auth forms and account dashboard
    global/            Smooth scroll, custom cursor, intro loader, toasts, back-to-top, WhatsApp, cookies
    ui/                Buttons, modal, accordion, form fields, reveal animations, image with fallback
  config/site.ts       Brand, currency, delivery, promo codes, contact details, hero variant
  data/                Products, categories, collections, navigation, FAQs, stores, sizes, image pools
  lib/                 Data access (products.ts), validation schemas, payment service, utilities
  store/               Zustand stores
```

## Configuration — `src/config/site.ts`

Everything brand- or commerce-related lives in one file:

- **Currency** — `commerce.currency` / `currencySymbol` (default `LKR` / `Rs.`)
- **Free-delivery threshold, delivery prices and lead times** — `commerce.freeDeliveryThreshold`, `commerce.delivery`
- **Promo codes** — `commerce.promoCodes` (demo: `VELORA10` = 10% off, `WELCOME500` = Rs. 500 off)
- **Cash on Delivery** — `commerce.cashOnDelivery`
- **Contact, WhatsApp number, opening hours, socials**
- **Announcement bar messages**

### Switching the hero variant

```ts
// src/config/site.ts
heroVariant: "cinematic", // "cinematic" | "split" | "fabric"
```

| Variant | Description |
| --- | --- |
| `cinematic` (default) | Full-screen video, letter-by-letter headline, scroll parallax and text mask, magnetic CTAs |
| `split` | Editorial split layout, clip-path cross-fading images with 3D pointer tilt, rotating “New Collection” tag |
| `fabric` | Collection slider with curtain-wipe transitions, timer bar, `01 / 04` counter and staggered titles |

The header automatically starts solid (instead of transparent) for the light `split` hero. Set `showIntroLoader: false` to disable the branded intro.

## Adding products

Products live in `src/data/products.ts` as compact definitions that are expanded into full `Product` objects (sizes/stock, badges, rating, alt text, care instructions):

```ts
{
  name: "Celeste Linen Midi Frock", sub: "Midi", price: 8950, sale: 7450, // optional sale price
  fabric: "Linen", composition: "100% European linen",
  colours: [["Ivory", "#f2ede3", [3, 4, 19]], ["Sage", "#a3b18a", [18, 17]]], // image indexes into the category pool
  occasion: ["Everyday", "Weekend"], length: "Midi",
  isNew: true, best: true, lowStock: false, collections: ["the-linen-edit"],
  description: "…",
}
```

- Image pools per category are in `src/data/images.ts`; add your own photos there (any HTTPS host listed in `next.config.ts` `remotePatterns`).
- Categories, collections, mega-menu columns, stores, FAQs and testimonials are in `src/data/catalog.ts`.
- All pages read data through `src/lib/products.ts`. **To move to a CMS or commerce API** (Shopify, Sanity, Medusa, your own backend), replace the functions in that file — the UI doesn’t need to change.

## Payment gateway integration

Checkout is complete up to payment and uses a **mock gateway** — no real money moves and card data is never stored, logged or sent anywhere.

```
src/lib/payment/
  types.ts   PaymentService interface (tokenizeCard, createPayment) and request/result types
  mock.ts    MockPaymentService — approves Luhn-valid cards; numbers ending 0002 are declined
  card.ts    Brand detection (Visa / Mastercard / Amex), formatting, Luhn and expiry validation
  index.ts   export const paymentService = new MockPaymentService();   // ← swap here
```

To go live:

1. Create an adapter implementing `PaymentService` (e.g. `stripe.ts` or `payhere.ts`).
2. In `tokenizeCard`, hand card data to the provider’s SDK / hosted fields so your servers only ever receive a token. For redirect-based gateways such as **PayHere**, return a `redirectUrl` from `createPayment` instead.
3. In `createPayment`, call your own server (a Route Handler or Server Action) that holds the secret key and creates the charge/intent.
4. Export your adapter from `src/lib/payment/index.ts`.

Search the codebase for `TODO: integrate payment gateway` for every touch-point. Raw card details only exist in `PaymentStep` component state and are cleared immediately after tokenisation; only the brand, last four digits and token are kept for the review step.

Test card for the demo: `4242 4242 4242 4242`, any future expiry, any CVV. Use `…0002` to see the decline state.

## Other back-end hooks

| Feature | Where | Replace with |
| --- | --- | --- |
| Sign in / register / reset | `src/components/account/AuthForms.tsx`, `src/store/account.ts` | Auth.js, Clerk, Supabase… |
| Newsletter | `src/components/ui/Newsletter.tsx` | Klaviyo, Mailchimp… |
| Contact form | `src/components/brand/InfoPages.tsx` | Route Handler → email/helpdesk |
| Reviews | `src/components/product/Reviews.tsx` | Judge.me, Yotpo, your API |
| Order tracking | `TrackOrder` in `InfoPages.tsx` | Your OMS/courier API |
| Map | `MapPlaceholder` in `InfoPages.tsx` | Google Maps / Mapbox embed |

## Features at a glance

- Branded intro loader (monogram draws itself, curtain reveal, once per session) and route transitions
- Premium header: category nav with hover mega menus, centred logo, transparent-to-blur on scroll, hide on scroll down; full-screen animated mobile menu with “Our World” section
- Homepage: 3 hero variants, marquee, category cards, new-arrivals carousel, parallax collection banner, tabbed best sellers, shop-the-look hotspots, brand story, Why VELORA, testimonials, lookbook masonry, newsletter
- Listing: size, colour-family swatches, dual price slider, style, fabric, occasion, length, new/sale toggles, active chips, sort, 2/3/4-column density, load more + infinite scroll, skeletons, empty state, shareable URL filters
- Product page: thumbnail gallery with hover zoom, full-screen pinch-zoom lightbox, mobile swipe, colour-driven images, size selector with sold-out/low-stock states, size guide drawer, fly-to-bag animation, buy now, accordions, delivery estimate, reviews with breakdown and write-a-review, complete-the-look, related, recently viewed, sticky add-to-bag bar, Product JSON-LD
- Cart drawer + page (quantity, remove with undo, move to wishlist, promo codes, free-delivery progress), wishlist with move-to-bag
- Full-screen search: live results, popular & recent searches, no-results suggestions, `/` or `Ctrl/⌘+K` shortcut
- 5-step checkout with animated progress, collapsible mobile summary, Zod-validated forms, Standard/Express delivery, 3D flipping card preview with brand detection, Cash on Delivery, review & confirmation with animated checkmark
- Account dashboard: order history with status tracker, profile, saved addresses, wishlist link, sign out
- Brand pages: Our Story (timeline, craft process, counters, sustainability), contact (form, WhatsApp, hours, map), stores, searchable FAQ (FAQPage JSON-LD), size guide, shipping & returns, privacy, terms, track order, branded 404 and error page
- Micro-interactions: custom cursor (mouse only), magnetic CTAs, toasts, back-to-top progress ring, WhatsApp button, cookie consent
- Accessibility: skip link, focus rings, keyboard-trappable dialogs, ARIA labels, alt text, `prefers-reduced-motion` respected (video, Lenis, cursor and motion disabled/reduced)
- SEO: per-page metadata and Open Graph, canonical URLs, sitemap.xml, robots.txt, web manifest, Organization/Breadcrumb/Product/FAQ structured data

## Credits

All images and videos are royalty-free from Unsplash and Pexels — see [CREDITS.md](CREDITS.md). Product photography is stock lifestyle imagery assigned to fictional products for demo purposes; replace it with your own before launch.
