import Link from "next/link";
import { ChevronRight, Minus, Plus, Star } from "lucide-react";
import type { ReactNode } from "react";
import { cn, formatPrice } from "@/lib/utils";
import type { Badge as BadgeT } from "@/data/types";
import { siteConfig } from "@/config/site";

export function Price({ price, salePrice, className }: { price: number; salePrice?: number; className?: string }) {
  if (salePrice) {
    return (
      <span className={cn("inline-flex items-baseline gap-2", className)}>
        <span className="text-rose-deep">{formatPrice(salePrice)}</span>
        <s className="text-ink-muted text-[0.85em]">
          <span className="sr-only">Was </span>
          {formatPrice(price)}
        </s>
      </span>
    );
  }
  return <span className={className}>{formatPrice(price)}</span>;
}

export function Stars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} role="img" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.max(0, Math.min(1, rating - i));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
            <Star className="text-sand absolute inset-0" style={{ width: size, height: size }} strokeWidth={1.2} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="fill-gold text-gold" style={{ width: size, height: size }} strokeWidth={1.2} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

const badgeTone: Record<BadgeT, string> = {
  New: "bg-ivory text-ink",
  Sale: "bg-rose text-white",
  "Low stock": "bg-gold text-ink",
  "Best seller": "bg-ink text-ivory",
  Limited: "bg-sage text-ink",
};

export function Badge({ children, className }: { children: BadgeT; className?: string }) {
  return (
    <span className={cn("eyebrow inline-flex items-center px-2.5 py-1 text-[0.58rem] tracking-[0.2em]", badgeTone[children], className)}>
      {children}
    </span>
  );
}

export function QuantityInput({
  value,
  onChange,
  max = 10,
  size = "md",
  label = "Quantity",
}: {
  value: number;
  onChange: (n: number) => void;
  max?: number;
  size?: "sm" | "md";
  label?: string;
}) {
  const h = size === "sm" ? "h-9" : "h-12";
  return (
    <div className={cn("border-line inline-flex items-center border bg-white/50", h)} role="group" aria-label={label}>
      <button
        type="button"
        className="text-ink-soft hover:text-ink grid h-full w-9 place-items-center transition disabled:opacity-30"
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-8 text-center text-sm tabular-nums" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className="text-ink-soft hover:text-ink grid h-full w-9 place-items-center transition disabled:opacity-30"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-5 md:mb-14",
        align === "center" ? "items-center text-center" : "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className="eyebrow text-rose mb-4">{eyebrow}</p>}
        <h2 className="font-serif text-4xl leading-[1.02] md:text-6xl">{title}</h2>
        {description && <p className="text-ink-soft mt-5 max-w-xl text-[0.95rem] leading-relaxed">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; href?: string }[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.label,
      item: it.href ? `${siteConfig.url}${it.href}` : undefined,
    })),
  };
  return (
    <nav aria-label="Breadcrumb" className="text-ink-muted text-xs">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {it.href && i < items.length - 1 ? (
              <Link href={it.href} className="hover:text-ink transition">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {it.label}
              </span>
            )}
            {i < items.length - 1 && <ChevronRight className="h-3 w-3" aria-hidden />}
          </li>
        ))}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </nav>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
