"use client";

import { motion } from "framer-motion";
import { CreditCard, Lock } from "lucide-react";
import { useState } from "react";
import { AmexIcon, MastercardIcon, VisaIcon } from "@/components/ui/PaymentIcons";
import { Field } from "@/components/ui/Form";
import { cardLength, cvvLength, detectBrand, formatCardNumber, formatExpiry, luhn, validateExpiry, type CardInput } from "@/lib/payment";
import { cn } from "@/lib/utils";

export type CardErrors = Partial<Record<keyof CardInput, string>>;

export function validateCard(c: CardInput): CardErrors {
  const brand = detectBrand(c.number);
  const digits = c.number.replace(/\D/g, "");
  const e: CardErrors = {};
  if (digits.length !== cardLength(brand) || !luhn(digits)) e.number = "Enter a valid card number";
  if (c.name.trim().length < 3) e.name = "Enter the name shown on the card";
  if (!validateExpiry(c.expiry)) e.expiry = "Enter a valid expiry date (MM / YY)";
  if (c.cvv.length !== cvvLength(brand)) e.cvv = `Enter the ${cvvLength(brand)}-digit security code`;
  return e;
}

const brandGradient = {
  visa: "from-[#1c1a19] via-[#3b3330] to-[#6b5048]",
  mastercard: "from-[#3a1f24] via-[#7a3b45] to-[#b76e79]",
  amex: "from-[#20334a] via-[#2f5d82] to-[#6f95b3]",
  unknown: "from-[#2a2624] via-[#4a4542] to-[#8a7c70]",
};

function BrandMark({ brand, className }: { brand: ReturnType<typeof detectBrand>; className?: string }) {
  if (brand === "visa") return <VisaIcon className={className} />;
  if (brand === "mastercard") return <MastercardIcon className={className} />;
  if (brand === "amex") return <AmexIcon className={className} />;
  return <CreditCard className={cn("text-ivory/70", className)} strokeWidth={1.2} />;
}

/** Animated 3D card that mirrors the inputs and flips when the CVV is focused. */
export function CardPreview({ card, flipped }: { card: CardInput; flipped: boolean }) {
  const brand = detectBrand(card.number);
  const masked = (() => {
    const digits = card.number.replace(/\D/g, "");
    const template = brand === "amex" ? "#### ###### #####" : "#### #### #### ####";
    let k = 0;
    return template.replace(/#/g, () => digits[k++] ?? "•");
  })();

  return (
    <div className="mx-auto w-full max-w-[340px] [perspective:1200px] 2xl:max-w-[360px]" aria-hidden>
      <motion.div
        className="relative aspect-[1.586] w-full [transform-style:preserve-3d]"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Front */}
        <div
          className={cn(
            "text-ivory absolute inset-0 overflow-hidden rounded-2xl bg-gradient-to-br p-6 shadow-[0_30px_60px_-25px_rgba(28,26,25,0.6)] transition-colors duration-700 [backface-visibility:hidden]",
            brandGradient[brand],
          )}
        >
          <div className="pointer-events-none absolute -top-20 -right-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="bg-blush/20 pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full blur-2xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div className="flex items-start justify-between">
              <span className="font-serif text-xl tracking-[0.3em]">VELORA</span>
              <motion.span key={brand} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}>
                <BrandMark brand={brand} className="h-8 w-auto" />
              </motion.span>
            </div>
            <div className="from-gold/90 to-sand/80 h-9 w-12 rounded-md bg-gradient-to-br" />
            <p className="font-mono text-[1.15rem] tracking-[0.14em] sm:text-[1.3rem]">{masked}</p>
            <div className="text-ivory/70 flex items-end justify-between gap-4 text-[0.62rem] tracking-[0.18em] uppercase">
              <div className="min-w-0">
                <p>Card holder</p>
                <p className="text-ivory mt-1 truncate text-sm tracking-wide normal-case">{card.name || "Your name"}</p>
              </div>
              <div className="text-right">
                <p>Expires</p>
                <p className="text-ivory mt-1 text-sm tracking-wide">{card.expiry || "MM / YY"}</p>
              </div>
            </div>
          </div>
        </div>
        {/* Back */}
        <div
          className={cn(
            "text-ivory absolute inset-0 [transform:rotateY(180deg)] overflow-hidden rounded-2xl bg-gradient-to-br shadow-xl [backface-visibility:hidden]",
            brandGradient[brand],
          )}
        >
          <div className="bg-ink/80 mt-7 h-11 w-full" />
          <div className="mx-6 mt-6 flex items-center gap-3">
            <div className="bg-ivory/85 h-9 flex-1 rounded" />
            <div className="bg-ivory text-ink grid h-9 w-16 place-items-center rounded font-mono text-sm tracking-widest">
              {card.cvv.replace(/./g, "•") || "CVV"}
            </div>
          </div>
          <p className="text-ivory/60 mx-6 mt-5 text-[0.6rem] leading-relaxed">
            This preview is generated on your device. VELORA never stores your card details.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function CardForm({ card, onChange, errors }: { card: CardInput; onChange: (c: CardInput) => void; errors: CardErrors }) {
  const [flipped, setFlipped] = useState(false);
  const brand = detectBrand(card.number);

  return (
    <div className="grid items-start gap-8 2xl:grid-cols-[1fr_360px]">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          className="sm:col-span-2"
          label="Card number"
          inputMode="numeric"
          autoComplete="cc-number"
          value={card.number}
          maxLength={brand === "amex" ? 17 : 19}
          onChange={(e) => onChange({ ...card, number: formatCardNumber(e.target.value) })}
          error={errors.number}
          trailing={<BrandMark brand={brand} className="h-6 w-auto" />}
        />
        <Field
          className="sm:col-span-2"
          label="Name on card"
          autoComplete="cc-name"
          value={card.name}
          onChange={(e) => onChange({ ...card, name: e.target.value.toUpperCase() })}
          error={errors.name}
        />
        <Field
          label="Expiry (MM / YY)"
          inputMode="numeric"
          autoComplete="cc-exp"
          value={card.expiry}
          maxLength={7}
          onChange={(e) => onChange({ ...card, expiry: formatExpiry(e.target.value, card.expiry) })}
          error={errors.expiry}
        />
        <Field
          label={`CVV (${cvvLength(brand)} digits)`}
          inputMode="numeric"
          autoComplete="cc-csc"
          type="password"
          value={card.cvv}
          maxLength={cvvLength(brand)}
          onFocus={() => setFlipped(true)}
          onBlur={() => setFlipped(false)}
          onChange={(e) => onChange({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, cvvLength(brand)) })}
          error={errors.cvv}
        />
        <p className="text-ink-muted flex items-center gap-2 text-xs sm:col-span-2">
          <Lock className="h-3.5 w-3.5" /> Encrypted and tokenised by our payment partner. Test card: 4242 4242 4242 4242.
        </p>
      </div>
      <div className="order-first 2xl:order-last">
        <CardPreview card={card} flipped={flipped} />
      </div>
    </div>
  );
}
