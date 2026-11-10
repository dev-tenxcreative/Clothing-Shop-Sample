"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Wordmark, Monogram } from "@/components/brand/Logo";
import { SmartImage } from "@/components/ui/SmartImage";
import { mainNav } from "@/data/catalog";
import { siteConfig } from "@/config/site";
import { useCart } from "@/store/cart";
import { useMounted, useUI, useWishlist } from "@/store";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

function AnnouncementBar() {
  const messages = siteConfig.announcements;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (paused) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % messages.length), 4500);
    return () => window.clearInterval(t);
  }, [paused, messages.length]);

  return (
    <div
      className="bg-ink text-ivory relative flex h-8 items-center justify-center overflow-hidden md:h-9"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={i}
          initial={{ y: 14, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -14, opacity: 0 }}
          transition={{ duration: 0.5, ease }}
          className="max-w-full truncate px-4 text-center text-[0.58rem] font-medium tracking-[0.12em] uppercase sm:text-[0.64rem] sm:tracking-[0.22em] md:text-[0.68rem]"
        >
          {messages[i]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}

function CountBadge({ count, light }: { count: number; light: boolean }) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.span
          key={count}
          initial={{ scale: 0.4, opacity: 0 }}
          animate={{ scale: [1.35, 1], opacity: 1 }}
          exit={{ scale: 0.4, opacity: 0 }}
          transition={{ duration: 0.45, ease }}
          className={cn(
            "absolute -top-1 -right-1.5 grid h-[17px] min-w-[17px] place-items-center rounded-full px-1 text-[0.6rem] font-semibold tabular-nums",
            light ? "bg-ivory text-ink" : "bg-rose text-white",
          )}
        >
          {count}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

export function Header() {
  const pathname = usePathname();
  // The split hero has a light background, so the header starts solid there.
  const isHome = pathname === "/" && siteConfig.heroVariant !== "split";
  const mounted = useMounted();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const lastY = useRef(0);

  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openCart = useCart((s) => s.open);
  const wishCount = useWishlist((s) => s.ids.length);
  const { setSearch, setMenu, menuOpen } = useUI();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 24);
      if (y > 260 && y > lastY.current + 4) setHidden(true);
      else if (y < lastY.current - 4 || y < 260) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mega menu on route change.
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setActive(null);
  }

  const open = (i: number | null) => {
    window.clearTimeout(closeTimer.current);
    setActive(i);
  };
  const scheduleClose = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setActive(null), 160);
  };

  const megaOpen = !hidden && active !== null && Boolean(mainNav[active]?.columns);
  // Distraction-free checkout renders its own minimal header.
  if (pathname.startsWith("/checkout")) return null;
  const transparent = isHome && !scrolled && !megaOpen;
  const light = transparent;

  return (
    <>
      <a href="#main" className="bg-ink text-ivory sr-only z-[100] px-4 py-2 focus:not-sr-only focus:fixed focus:top-4 focus:left-4">
        Skip to content
      </a>
      <motion.header
        className="fixed inset-x-0 top-0 z-50"
        animate={{ y: hidden && !menuOpen ? "-100%" : 0 }}
        transition={{ duration: 0.5, ease }}
        onMouseLeave={scheduleClose}
        onKeyDown={(e) => e.key === "Escape" && setActive(null)}
      >
        <AnnouncementBar />
        <div
          className={cn(
            "relative transition-[background-color,box-shadow,color,backdrop-filter] duration-500",
            transparent
              ? "text-ivory bg-transparent"
              : "bg-ivory/90 text-ink shadow-[0_1px_0_rgba(28,26,25,0.06),0_10px_30px_-20px_rgba(28,26,25,0.35)] backdrop-blur-xl",
          )}
        >
          <div className="container-velora grid h-16 grid-cols-[1fr_auto_1fr] items-center md:h-[76px]">
            {/* Left: categories (desktop) / menu (mobile) */}
            <div className="flex items-center">
              <button
                className="-ml-2 grid h-11 w-11 place-items-center xl:hidden"
                onClick={() => setMenu(true)}
                aria-label="Open menu"
                aria-expanded={menuOpen}
              >
                <Menu className="h-[22px] w-[22px]" strokeWidth={1.3} />
              </button>
              <button className="grid h-11 w-11 place-items-center md:hidden" onClick={() => setSearch(true)} aria-label="Search">
                <Search className="h-5 w-5" strokeWidth={1.3} />
              </button>
              <nav aria-label="Shop categories" className="hidden xl:block">
                <ul className="flex items-center gap-[1.15rem] 2xl:gap-7">
                  {mainNav.map((item, i) => (
                    <li key={item.label} onMouseEnter={() => open(item.columns ? i : null)}>
                      <Link
                        href={item.href}
                        onFocus={() => open(item.columns ? i : null)}
                        aria-expanded={item.columns ? active === i : undefined}
                        aria-haspopup={item.columns ? "true" : undefined}
                        className={cn(
                          "relative py-7 text-[0.68rem] font-semibold tracking-[0.16em] uppercase transition-colors",
                          item.highlight ? (light ? "text-blush" : "text-rose") : "",
                          "after:absolute after:inset-x-0 after:bottom-[22px] after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-500 hover:after:scale-x-100",
                          (active === i || pathname.startsWith(item.href)) && "after:scale-x-100",
                        )}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            {/* Center: logo */}
            <Link href="/" aria-label="VELORA — home" className="flex items-center justify-center px-2">
              <Monogram className="h-9 w-9 sm:hidden" />
              <Wordmark className="hidden h-6 sm:block md:h-[30px]" />
            </Link>

            {/* Right: utilities */}
            <div className="flex items-center justify-end gap-0.5 md:gap-1.5">
              <button className="hidden h-11 w-11 place-items-center md:grid" onClick={() => setSearch(true)} aria-label="Search (press /)">
                <Search className="h-5 w-5" strokeWidth={1.3} />
              </button>
              <Link
                href="/wishlist"
                className="relative grid h-11 w-11 place-items-center"
                aria-label={`Wishlist${mounted ? `, ${wishCount} items` : ""}`}
              >
                <span className="relative">
                  <Heart className="h-5 w-5" strokeWidth={1.3} />
                  {mounted && <CountBadge count={wishCount} light={light} />}
                </span>
              </Link>
              <Link href="/account" className="hidden h-11 w-11 place-items-center sm:grid" aria-label="Account">
                <User className="h-5 w-5" strokeWidth={1.3} />
              </Link>
              <button
                className="relative -mr-2 grid h-11 w-11 place-items-center"
                onClick={openCart}
                aria-label={`Open bag${mounted ? `, ${cartCount} items` : ""}`}
                data-cart-target
              >
                <span className="relative">
                  <ShoppingBag className="h-5 w-5" strokeWidth={1.3} />
                  {mounted && <CountBadge count={cartCount} light={light} />}
                </span>
              </button>
            </div>
          </div>

          {/* Mega menu */}
          <AnimatePresence>
            {megaOpen && active !== null && (
              <motion.div
                key="mega"
                initial={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                animate={{ opacity: 1, clipPath: "inset(0 0 0% 0)" }}
                exit={{ opacity: 0, clipPath: "inset(0 0 100% 0)" }}
                transition={{ duration: 0.5, ease }}
                className="border-line bg-ivory text-ink absolute inset-x-0 top-full hidden border-t shadow-[0_30px_60px_-30px_rgba(28,26,25,0.35)] xl:block"
                onMouseEnter={() => open(active)}
              >
                <MegaPanel index={active} onNavigate={() => setActive(null)} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}

function MegaPanel({ index, onNavigate }: { index: number; onNavigate: () => void }) {
  const item = mainNav[index];
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.35, ease }}
        className="container-velora grid grid-cols-12 gap-10 py-10"
      >
        <div className="col-span-7 grid grid-cols-3 gap-10">
          {item.columns?.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-ink-muted mb-5">{col.title}</p>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      onClick={onNavigate}
                      className="link-underline text-ink hover:text-rose font-serif text-xl transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <p className="eyebrow text-ink-muted mb-5">Discover</p>
            <ul className="text-ink-soft space-y-3 text-sm">
              <li>
                <Link href={item.href} onClick={onNavigate} className="link-underline">
                  Shop all {item.label.toLowerCase()}
                </Link>
              </li>
              <li>
                <Link href="/sale" onClick={onNavigate} className="link-underline">
                  Sale
                </Link>
              </li>
              <li>
                <Link href="/lookbook" onClick={onNavigate} className="link-underline">
                  Lookbook
                </Link>
              </li>
              <li>
                <Link href="/size-guide" onClick={onNavigate} className="link-underline">
                  Size guide
                </Link>
              </li>
            </ul>
          </div>
        </div>
        {item.feature && (
          <Link href={item.feature.href} onClick={onNavigate} className="group col-span-5 grid grid-cols-2 gap-5">
            <div className="bg-blush-soft relative aspect-[4/5] overflow-hidden">
              <SmartImage
                src={item.feature.image.src}
                alt={item.feature.image.alt}
                fill
                sizes="300px"
                className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-velora)] group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col justify-end pb-2">
              <p className="eyebrow text-rose mb-3">Featured</p>
              <p className="font-serif text-4xl leading-none">{item.feature.title}</p>
              <span className="link-underline mt-5 self-start pb-1 text-[0.7rem] font-semibold tracking-[0.22em] uppercase">
                {item.feature.cta}
              </span>
            </div>
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
