import Link from "next/link";
import { Wordmark } from "@/components/brand/Logo";
import { NewsletterForm } from "@/components/ui/Newsletter";
import { PaymentIcons } from "@/components/ui/PaymentIcons";
import { helpNav, mainNav, ourWorldNav } from "@/data/catalog";
import { siteConfig } from "@/config/site";
import { FooterYear } from "./FooterYear";

const socials = [
  {
    label: "Instagram",
    href: siteConfig.social.instagram,
    path: "M12 7.4a4.6 4.6 0 1 0 0 9.2 4.6 4.6 0 0 0 0-9.2Zm0 7.6a3 3 0 1 1 0-6 3 3 0 0 1 0 6Zm4.8-8.9a1.1 1.1 0 1 0 0 2.2 1.1 1.1 0 0 0 0-2.2ZM12 3.6c2.7 0 3 0 4.1.1 2.7.1 4 1.4 4.1 4.1.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c-.1 2.7-1.4 4-4.1 4.1-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-2.7-.1-4-1.4-4.1-4.1C3.7 15 3.6 14.7 3.6 12s0-3 .1-4.1C3.8 5.2 5.1 3.9 7.9 3.7 9 3.6 9.3 3.6 12 3.6Z",
  },
  {
    label: "Facebook",
    href: siteConfig.social.facebook,
    path: "M13.4 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.6V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.3H7.5V13h2.7v8h3.2Z",
  },
  {
    label: "Pinterest",
    href: siteConfig.social.pinterest,
    path: "M12 3a9 9 0 0 0-3.3 17.4c-.1-.7-.1-1.8 0-2.6l1.1-4.6s-.3-.6-.3-1.4c0-1.3.8-2.3 1.7-2.3.8 0 1.2.6 1.2 1.3 0 .8-.5 2-.8 3.1-.2.9.5 1.7 1.4 1.7 1.7 0 3-1.8 3-4.4 0-2.3-1.6-3.9-4-3.9-2.7 0-4.3 2-4.3 4.2 0 .8.3 1.7.7 2.2.1.1.1.2.1.3l-.3 1.1c0 .2-.1.2-.3.1-1.2-.6-2-2.4-2-3.8 0-3.1 2.3-6 6.5-6 3.4 0 6.1 2.5 6.1 5.7 0 3.4-2.1 6.2-5.1 6.2-1 0-2-.5-2.3-1.1l-.6 2.4c-.2.9-.8 1.9-1.2 2.6A9 9 0 1 0 12 3Z",
  },
  {
    label: "TikTok",
    href: siteConfig.social.tiktok,
    path: "M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.8a5.7 5.7 0 1 0 4.9 5.6V9.1a7.3 7.3 0 0 0 4.3 1.4V7.4a4.3 4.3 0 0 1-3.2-1.6Z",
  },
];

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h2 className="eyebrow text-ivory/50 mb-6 font-sans">{title}</h2>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="link-underline text-ivory/85 hover:text-ivory text-[0.92rem] transition-colors">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Small gold diamond with hairlines either side, used between bottom-bar items. */
function FooterDivider() {
  return (
    <span aria-hidden className="hidden items-center gap-1.5 sm:inline-flex">
      <span className="bg-gold/40 h-px w-4" />
      <svg viewBox="0 0 10 10" className="text-gold h-2 w-2">
        <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
      </svg>
      <span className="bg-gold/40 h-px w-4" />
    </span>
  );
}

export function Footer() {
  return (
    <footer className="bg-ink text-ivory relative overflow-hidden" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container-velora pt-20 pb-10 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Wordmark className="text-ivory h-8" />
            <p className="text-blush mt-4 font-serif text-2xl italic">{siteConfig.tagline}</p>
            <p className="text-ivory/65 mt-5 max-w-sm text-[0.92rem] leading-relaxed">
              Modern womenswear designed in Colombo — made in small batches from natural and responsible fabrics, for everyday elegance and
              the moments worth dressing for.
            </p>
            <div className="mt-8 flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`VELORA on ${s.label}`}
                  className="border-ivory/20 hover:border-blush hover:bg-blush hover:text-ink grid h-10 w-10 place-items-center rounded-full border transition-all duration-300 hover:-translate-y-0.5"
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-5">
            <FooterCol title="Shop" links={mainNav.map((n) => ({ label: n.label, href: n.href }))} />
            <FooterCol title="Our World" links={ourWorldNav} />
            <FooterCol title="Help" links={helpNav} />
          </div>

          <div className="lg:col-span-3">
            <h2 className="eyebrow text-ivory/50 mb-6 font-sans">The VELORA Circle</h2>
            <p className="text-ivory/75 mb-4 text-[0.92rem]">New arrivals, private sales and 10% off your first order.</p>
            <NewsletterForm variant="mini" tone="light" />
            <div className="text-ivory/60 mt-8 space-y-1 text-[0.85rem]">
              <p>{siteConfig.contact.phone}</p>
              <p>{siteConfig.contact.email}</p>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="text-ivory/[0.045] pointer-events-none mt-20 text-center font-serif text-[22vw] leading-[0.75] tracking-[0.08em] select-none"
        >
          VELORA
        </div>

        <div className="border-ivory/10 text-ivory/55 mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-4 border-t pt-8 text-center text-[0.78rem] lg:flex-nowrap lg:whitespace-nowrap">
          <span>
            © <FooterYear /> VELORA. All rights reserved.
          </span>
          <FooterDivider />
          <span>
            Designed &amp; Developed by{" "}
            <a
              href="http://tenxcreative.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ivory/80 decoration-ivory/30 hover:text-ivory hover:decoration-blush font-medium underline underline-offset-4 transition-colors"
            >
              10XCreative
            </a>
          </span>
          <FooterDivider />
          <PaymentIcons />
        </div>
      </div>
    </footer>
  );
}
