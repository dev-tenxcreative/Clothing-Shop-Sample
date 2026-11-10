import { cn } from "@/lib/utils";

/** Simplified, brand-colour payment marks used in the footer and checkout. */
export function VisaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={cn("h-6 w-auto", className)} role="img" aria-label="Visa">
      <rect width="48" height="30" rx="4" fill="#fff" stroke="#e7dfd4" />
      <path
        d="M20.3 20.2h-2.6l1.6-10h2.6l-1.6 10Zm9.5-9.8a6.4 6.4 0 0 0-2.3-.4c-2.6 0-4.4 1.4-4.4 3.3 0 1.4 1.3 2.2 2.3 2.7 1 .5 1.4.8 1.4 1.3 0 .7-.8 1-1.6 1-1.1 0-1.6-.2-2.5-.5l-.4-.2-.4 2.3c.6.3 1.8.5 3 .5 2.7 0 4.5-1.3 4.5-3.4 0-1.1-.7-2-2.2-2.7-.9-.5-1.5-.8-1.5-1.3s.5-.9 1.5-.9c.9 0 1.5.2 2 .4l.2.1.4-2.2Zm6.7-.2h-2c-.6 0-1.1.2-1.4.8l-3.9 9.2h2.7l.6-1.5h3.3l.3 1.5h2.4l-2-10Zm-3.2 6.5 1-2.8.6 2.8h-1.6ZM15.5 10.2l-2.5 6.8-.3-1.4a7.7 7.7 0 0 0-3.6-4.2l2.3 8.8h2.7l4-10h-2.6Z"
        fill="#1a1f71"
      />
      <path d="M10.7 10.2H6.6l-.1.2c3.2.8 5.3 2.8 6.2 5.2l-.9-4.6c-.2-.6-.6-.8-1.1-.8Z" fill="#f7b600" />
    </svg>
  );
}

export function MastercardIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={cn("h-6 w-auto", className)} role="img" aria-label="Mastercard">
      <rect width="48" height="30" rx="4" fill="#fff" stroke="#e7dfd4" />
      <circle cx="20" cy="15" r="7.5" fill="#eb001b" />
      <circle cx="28" cy="15" r="7.5" fill="#f79e1b" />
      <path d="M24 8.6a7.5 7.5 0 0 1 0 12.8 7.5 7.5 0 0 1 0-12.8Z" fill="#ff5f00" />
    </svg>
  );
}

export function AmexIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={cn("h-6 w-auto", className)} role="img" aria-label="American Express">
      <rect width="48" height="30" rx="4" fill="#2e77bc" />
      <text x="24" y="19" textAnchor="middle" fill="#fff" style={{ font: "700 9px Arial, sans-serif", letterSpacing: "0.5px" }}>
        AMEX
      </text>
    </svg>
  );
}

export function CodIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 30" className={cn("h-6 w-auto", className)} role="img" aria-label="Cash on Delivery">
      <rect width="48" height="30" rx="4" fill="#fff" stroke="#e7dfd4" />
      <text x="24" y="19" textAnchor="middle" fill="#1c1a19" style={{ font: "700 9px Arial, sans-serif", letterSpacing: "0.5px" }}>
        COD
      </text>
    </svg>
  );
}

export function PaymentIcons({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <VisaIcon />
      <MastercardIcon />
      <AmexIcon />
      <CodIcon />
    </div>
  );
}
