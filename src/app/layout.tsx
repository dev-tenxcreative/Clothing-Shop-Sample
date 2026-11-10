import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { QuickView, SizeGuideModal } from "@/components/product/GlobalModals";
import { SmoothScroll } from "@/components/global/SmoothScroll";
import { CustomCursor } from "@/components/global/CustomCursor";
import { BackToTop, CookieConsent, Toaster, WhatsAppButton } from "@/components/global/FloatingUI";
import { IntroLoader } from "@/components/global/IntroLoader";
import { HeaderSpacer, Providers } from "@/components/global/Providers";
import { JsonLd } from "@/components/ui/Bits";
import { lifestyleImages } from "@/data/images";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const ogImage = `${lifestyleImages.seaside.src}?w=1200&h=630&fit=crop&q=80&auto=format`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: ["women's clothing", "frocks", "dresses", "blouses", "skirts", "pants", "linen", "Sri Lanka fashion", "VELORA"],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [{ url: ogImage, width: 1200, height: 630, alt: lifestyleImages.seaside.alt }],
    locale: "en_LK",
  },
  twitter: { card: "summary_large_image", images: [ogImage] },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#FAF7F2",
  width: "device-width",
  initialScale: 1,
};

const introScript = `try{if(sessionStorage.getItem('velora-intro-seen')==='1'||matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.intro='seen'}}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://videos.pexels.com" />
      </head>
      <body className="bg-ivory min-h-dvh">
        <Providers>
          <IntroLoader />
          <SmoothScroll />
          <Header />
          <MobileMenu />
          <HeaderSpacer />
          <main id="main" tabIndex={-1} className="outline-none">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <SearchOverlay />
          <QuickView />
          <SizeGuideModal />
          <Toaster />
          <BackToTop />
          <WhatsAppButton />
          <CookieConsent />
          <CustomCursor />
        </Providers>
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "ClothingStore",
            name: siteConfig.name,
            slogan: siteConfig.tagline,
            url: siteConfig.url,
            logo: `${siteConfig.url}/brand/logo-light.svg`,
            telephone: siteConfig.contact.phone,
            email: siteConfig.contact.email,
            address: {
              "@type": "PostalAddress",
              streetAddress: "42 Ward Place",
              addressLocality: "Colombo",
              postalCode: "00700",
              addressCountry: "LK",
            },
            sameAs: Object.values(siteConfig.social),
          }}
        />
      </body>
    </html>
  );
}
