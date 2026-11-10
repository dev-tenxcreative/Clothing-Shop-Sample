"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronDown, Heart, MessageCircle, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/brand/Logo";
import { SmartImage } from "@/components/ui/SmartImage";
import { categories, helpNav, mainNav, ourWorldNav } from "@/data/catalog";
import { siteConfig } from "@/config/site";
import { lockScroll, unlockScroll } from "@/lib/lenis";
import { useUI } from "@/store";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function MobileMenu() {
  const { menuOpen, setMenu } = useUI();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => setMenu(false), [pathname, setMenu]);

  useEffect(() => {
    if (!menuOpen) return;
    lockScroll();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("keydown", onKey);
    return () => {
      unlockScroll();
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, setMenu]);

  return (
    <AnimatePresence>
      {menuOpen && (
        <motion.div
          key="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="bg-ivory fixed inset-0 z-[70] flex flex-col overflow-y-auto xl:hidden"
          data-lenis-prevent
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="container-velora border-line flex h-16 shrink-0 items-center justify-between border-b">
            <Wordmark className="h-6" />
            <button
              onClick={() => setMenu(false)}
              aria-label="Close menu"
              className="-mr-2 grid h-11 w-11 place-items-center"
              data-autofocus
            >
              <X className="h-6 w-6" strokeWidth={1.3} />
            </button>
          </div>

          <div className="container-velora flex-1 pt-6 pb-10">
            {/* Category image strip */}
            <motion.div
              className="no-scrollbar -mx-4 mb-8 flex gap-3 overflow-x-auto px-4"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease, delay: 0.25 }}
            >
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  href={`/shop/${c.slug}`}
                  className="group bg-blush-soft relative aspect-[3/4] w-[38vw] max-w-[180px] shrink-0 overflow-hidden"
                >
                  <SmartImage src={c.card.src} alt={c.card.alt} fill sizes="180px" className="object-cover" />
                  <span className="from-ink/60 absolute inset-0 bg-gradient-to-t to-transparent" />
                  <span className="text-ivory absolute bottom-3 left-3 font-serif text-xl">{c.name}</span>
                </Link>
              ))}
            </motion.div>

            <nav aria-label="Shop">
              <ul>
                {mainNav.map((item, i) => (
                  <motion.li
                    key={item.label}
                    className="border-line border-b"
                    initial={{ opacity: 0, y: 26 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease, delay: 0.3 + i * 0.05 }}
                  >
                    <div className="flex items-center justify-between">
                      <Link
                        href={item.href}
                        className={cn("block py-4 font-serif text-[2rem] leading-none", item.highlight && "text-rose")}
                      >
                        {item.label}
                      </Link>
                      {item.columns && (
                        <button
                          aria-label={`Show ${item.label} sub-categories`}
                          aria-expanded={expanded === item.label}
                          onClick={() => setExpanded((e) => (e === item.label ? null : item.label))}
                          className="grid h-11 w-11 place-items-center"
                        >
                          <ChevronDown
                            className={cn("h-5 w-5 transition-transform duration-500", expanded === item.label && "rotate-180")}
                            strokeWidth={1.3}
                          />
                        </button>
                      )}
                    </div>
                    <AnimatePresence initial={false}>
                      {expanded === item.label && item.columns && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.45, ease }}
                          className="overflow-hidden"
                        >
                          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 pb-5">
                            {item.columns[0].links.map((l) => (
                              <li key={l.href}>
                                <Link href={l.href} className="text-ink-soft text-sm">
                                  {l.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="mt-10 grid grid-cols-2 gap-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease, delay: 0.7 }}
            >
              <div>
                <p className="eyebrow text-ink-muted mb-4">Our World</p>
                <ul className="space-y-3">
                  {ourWorldNav.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-flex items-center gap-1 text-[0.95rem]">
                        {l.label} <ArrowUpRight className="text-ink-muted h-3.5 w-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow text-ink-muted mb-4">Help</p>
                <ul className="space-y-3">
                  {helpNav.slice(0, 4).map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-[0.95rem]">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/account" className="border-line inline-flex h-11 items-center gap-2 border px-4 text-sm">
                <User className="h-4 w-4" strokeWidth={1.4} /> Account
              </Link>
              <Link href="/wishlist" className="border-line inline-flex h-11 items-center gap-2 border px-4 text-sm">
                <Heart className="h-4 w-4" strokeWidth={1.4} /> Wishlist
              </Link>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-line inline-flex h-11 items-center gap-2 border px-4 text-sm"
              >
                <MessageCircle className="h-4 w-4" strokeWidth={1.4} /> WhatsApp us
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
