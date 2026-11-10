/**
 * Card helpers for the checkout UI. Pure functions — nothing here stores,
 * logs or transmits card data.
 */

export type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

export function detectBrand(number: string): CardBrand {
  const n = number.replace(/\D/g, "");
  if (/^4/.test(n)) return "visa";
  if (/^(5[1-5]|2(2[2-9]|[3-6]\d|7[01]|720))/.test(n)) return "mastercard";
  if (/^3[47]/.test(n)) return "amex";
  return "unknown";
}

export const cardLength = (brand: CardBrand) => (brand === "amex" ? 15 : 16);
export const cvvLength = (brand: CardBrand) => (brand === "amex" ? 4 : 3);

/** Groups digits as the card would be embossed: 4-4-4-4 or 4-6-5 for Amex. */
export function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "");
  const brand = detectBrand(digits);
  const max = cardLength(brand);
  const d = digits.slice(0, max);
  if (brand === "amex") return [d.slice(0, 4), d.slice(4, 10), d.slice(10, 15)].filter(Boolean).join(" ");
  return d.match(/.{1,4}/g)?.join(" ") ?? "";
}

export function formatExpiry(value: string, previous = "") {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length === 0) return "";
  if (digits.length === 1 && Number(digits) > 1) return `0${digits} / `;
  if (digits.length < 2) return digits;
  // Allow deleting the separator naturally.
  if (digits.length === 2 && previous.length > value.length) return digits;
  return `${digits.slice(0, 2)} / ${digits.slice(2)}`;
}

export function luhn(number: string) {
  const digits = number.replace(/\D/g, "");
  let sum = 0;
  let dbl = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = Number(digits[i]);
    if (dbl) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    dbl = !dbl;
  }
  return digits.length > 0 && sum % 10 === 0;
}

export function validateExpiry(value: string, now = new Date()) {
  const [mm, yy] = value.split("/").map((s) => s.trim());
  const month = Number(mm);
  const year = 2000 + Number(yy);
  if (!mm || !yy || yy.length !== 2 || month < 1 || month > 12) return false;
  const endOfMonth = new Date(year, month, 0, 23, 59, 59);
  return endOfMonth >= now;
}

export const last4 = (number: string) => number.replace(/\D/g, "").slice(-4);
