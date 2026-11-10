"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { siteConfig } from "@/config/site";
import type { Size } from "@/data/types";

export interface CartItem {
  key: string;
  productId: string;
  slug: string;
  name: string;
  colour: string;
  size: Size;
  price: number;
  compareAt?: number;
  image: string;
  imageAlt: string;
  quantity: number;
  maxQuantity: number;
}

export type AppliedPromo = { code: string; type: "percent" | "fixed"; value: number; label: string };

interface CartState {
  items: CartItem[];
  promo: AppliedPromo | null;
  isOpen: boolean;
  lastRemoved: { item: CartItem; index: number } | null;
  add: (item: Omit<CartItem, "key" | "quantity"> & { quantity?: number }) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  undoRemove: () => void;
  clear: () => void;
  applyPromo: (code: string) => { ok: boolean; message: string };
  removePromo: () => void;
  open: () => void;
  close: () => void;
}

export const cartKey = (productId: string, colour: string, size: string) => `${productId}__${colour}__${size}`;

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      promo: null,
      isOpen: false,
      lastRemoved: null,
      add: ({ quantity = 1, ...item }) => {
        const key = cartKey(item.productId, item.colour, item.size);
        set((s) => {
          const existing = s.items.find((i) => i.key === key);
          if (existing) {
            return {
              items: s.items.map((i) => (i.key === key ? { ...i, quantity: Math.min(i.maxQuantity, i.quantity + quantity) } : i)),
            };
          }
          return { items: [...s.items, { ...item, key, quantity: Math.min(item.maxQuantity, quantity) }] };
        });
      },
      setQuantity: (key, quantity) =>
        set((s) => ({
          items: s.items.map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(i.maxQuantity, quantity)) } : i)),
        })),
      remove: (key) =>
        set((s) => {
          const index = s.items.findIndex((i) => i.key === key);
          if (index < 0) return s;
          return { items: s.items.filter((i) => i.key !== key), lastRemoved: { item: s.items[index], index } };
        }),
      undoRemove: () =>
        set((s) => {
          if (!s.lastRemoved) return s;
          const items = [...s.items];
          items.splice(s.lastRemoved.index, 0, s.lastRemoved.item);
          return { items, lastRemoved: null };
        }),
      clear: () => set({ items: [], promo: null, lastRemoved: null }),
      applyPromo: (raw) => {
        const code = raw.trim().toUpperCase();
        const promo = siteConfig.commerce.promoCodes[code];
        if (!promo) return { ok: false, message: "That code isn't valid. Try VELORA10." };
        if (get().promo?.code === code) return { ok: true, message: "Code already applied." };
        set({ promo: { code, ...promo } });
        return { ok: true, message: `${code} applied — ${promo.label}.` };
      },
      removePromo: () => set({ promo: null }),
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
    }),
    {
      name: "velora-cart",
      storage: createJSONStorage(() => window.localStorage),
      partialize: (s) => ({ items: s.items, promo: s.promo }),
    },
  ),
);

/* Derived totals ---------------------------------------------------- */

export function computeTotals(items: CartItem[], promo: AppliedPromo | null, shipping?: number) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const savings = items.reduce((sum, i) => sum + ((i.compareAt ?? i.price) - i.price) * i.quantity, 0);
  const discount = promo ? (promo.type === "percent" ? Math.round((subtotal * promo.value) / 100) : Math.min(promo.value, subtotal)) : 0;
  const { freeDeliveryThreshold, delivery } = siteConfig.commerce;
  const qualifiesFree = subtotal >= freeDeliveryThreshold;
  const shippingCost = items.length === 0 ? 0 : (shipping ?? (qualifiesFree ? 0 : delivery.standard.price));
  const count = items.reduce((n, i) => n + i.quantity, 0);
  return {
    count,
    subtotal,
    savings,
    discount,
    shipping: shippingCost,
    total: Math.max(0, subtotal - discount + shippingCost),
    remainingForFree: Math.max(0, freeDeliveryThreshold - subtotal),
    freeProgress: Math.min(1, subtotal / freeDeliveryThreshold),
    qualifiesFree,
  };
}
