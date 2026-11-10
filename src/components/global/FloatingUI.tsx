"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Check, Cookie, X } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { scrollToTop } from "@/lib/lenis";
import { useToasts } from "@/store";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

/** Back-to-top button with a circular scroll-progress ring. */
export function BackToTop() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const visible = progress > 0.12;
  const C = 2 * Math.PI * 20;
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.35, ease }}
          onClick={scrollToTop}
          aria-label="Back to top"
          className="bg-ivory/90 text-ink hover:bg-ivory fixed right-4 bottom-24 z-40 grid h-12 w-12 place-items-center rounded-full shadow-lg backdrop-blur transition md:right-24 md:bottom-6"
        >
          <svg viewBox="0 0 44 44" className="absolute inset-0 -rotate-90" aria-hidden>
            <circle cx="22" cy="22" r="20" fill="none" stroke="var(--color-line)" strokeWidth="1.5" />
            <circle
              cx="22"
              cy="22"
              r="20"
              fill="none"
              stroke="var(--color-rose)"
              strokeWidth="1.5"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              strokeLinecap="round"
            />
          </svg>
          <ArrowUp className="h-4 w-4" strokeWidth={1.5} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${siteConfig.contact.whatsapp}?text=${encodeURIComponent("Hi VELORA! I have a question.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="group fixed right-4 bottom-6 z-40 flex h-14 items-center gap-0 overflow-hidden rounded-full bg-[#25d366] pr-4 pl-4 text-white shadow-[0_12px_30px_-10px_rgba(37,211,102,0.8)] transition-all duration-500 hover:gap-2 md:right-6"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="currentColor" aria-hidden>
        <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4ZM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8ZM12 0a12 12 0 0 0-10.3 18L0 24l6.2-1.6A12 12 0 1 0 12 0Z" />
      </svg>
      <span className="max-w-0 overflow-hidden text-sm font-medium whitespace-nowrap transition-all duration-500 group-hover:max-w-40">
        Chat with us
      </span>
    </a>
  );
}

const CONSENT_KEY = "velora-cookie-consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) {
        const t = window.setTimeout(() => setShow(true), 2600);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* storage unavailable */
    }
  }, []);
  const decide = (value: "all" | "essential") => {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
    setShow(false);
  };
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="dialog"
          aria-label="Cookie preferences"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.6, ease }}
          className="border-line bg-ivory fixed right-4 bottom-4 left-4 z-[60] max-w-md border p-6 shadow-2xl sm:right-auto"
        >
          <div className="flex items-start gap-4">
            <Cookie className="text-rose mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.4} />
            <div>
              <p className="font-serif text-xl">A little note on cookies</p>
              <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                We use essential cookies to run the site and optional ones to understand how it’s used. Read our{" "}
                <Link href="/privacy-policy" className="underline underline-offset-2">
                  privacy policy
                </Link>
                .
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => decide("essential")}
                  className="border-ink/70 hover:bg-ink hover:text-ivory h-10 border px-4 text-[0.68rem] font-semibold tracking-[0.18em] uppercase transition"
                >
                  Essential only
                </button>
                <button
                  onClick={() => decide("all")}
                  className="bg-ink text-ivory hover:bg-rose h-10 px-4 text-[0.68rem] font-semibold tracking-[0.18em] uppercase transition"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toaster() {
  const { toasts, dismiss } = useToasts();
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-4 top-24 z-[90] flex flex-col items-end gap-3 sm:right-6 sm:left-auto md:top-28"
    >
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, x: 40, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.96 }}
            transition={{ duration: 0.45, ease }}
            className={cn(
              "bg-ivory pointer-events-auto flex w-full items-center gap-4 border p-3 pr-4 shadow-[0_20px_50px_-20px_rgba(28,26,25,0.45)] sm:w-[360px]",
              t.tone === "error" ? "border-rose" : "border-line",
            )}
            role="status"
          >
            {t.image ? (
              <span className="bg-blush-soft relative h-16 w-12 shrink-0 overflow-hidden">
                <Image src={t.image} alt="" fill sizes="48px" className="object-cover" />
              </span>
            ) : (
              <span
                className={cn(
                  "grid h-9 w-9 shrink-0 place-items-center rounded-full",
                  t.tone === "error" ? "bg-rose/15 text-rose-deep" : "bg-sage/30 text-sage-deep",
                )}
              >
                {t.tone === "error" ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{t.title}</p>
              {t.description && <p className="text-ink-muted truncate text-xs">{t.description}</p>}
            </div>
            {t.action && (
              <button
                onClick={() => {
                  t.action!.onClick();
                  dismiss(t.id);
                }}
                className="text-rose text-[0.66rem] font-semibold tracking-[0.18em] uppercase underline underline-offset-4"
              >
                {t.action.label}
              </button>
            )}
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss notification" className="text-ink-muted hover:text-ink transition">
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
