"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Order } from "./account";

/**
 * Checkout progress, kept in sessionStorage so a refresh doesn't lose it.
 * Payment details are deliberately NOT part of this store.
 */
export interface ShippingAddress {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  district: string;
  postalCode: string;
  phone: string;
  saveAddress?: boolean;
}

interface CheckoutState {
  step: number;
  contact: { email: string; phone: string; marketing?: boolean } | null;
  shipping: ShippingAddress | null;
  delivery: "standard" | "express";
  paymentMethod: "card" | "cod";
  /** Display-only summary of the tokenised card (brand + last 4). */
  cardSummary: { brand: string; last4: string; token: string } | null;
  lastOrder: Order | null;
  setStep: (n: number) => void;
  setContact: (c: CheckoutState["contact"]) => void;
  setShipping: (s: ShippingAddress) => void;
  setDelivery: (d: CheckoutState["delivery"]) => void;
  setPayment: (m: CheckoutState["paymentMethod"], card: CheckoutState["cardSummary"]) => void;
  complete: (o: Order) => void;
  reset: () => void;
}

export const useCheckout = create<CheckoutState>()(
  persist(
    (set) => ({
      step: 0,
      contact: null,
      shipping: null,
      delivery: "standard",
      paymentMethod: "card",
      cardSummary: null,
      lastOrder: null,
      setStep: (step) => set({ step }),
      setContact: (contact) => set({ contact }),
      setShipping: (shipping) => set({ shipping }),
      setDelivery: (delivery) => set({ delivery }),
      setPayment: (paymentMethod, cardSummary) => set({ paymentMethod, cardSummary }),
      complete: (lastOrder) => set({ lastOrder, step: 0, cardSummary: null }),
      reset: () => set({ step: 0, cardSummary: null }),
    }),
    { name: "velora-checkout", storage: createJSONStorage(() => window.sessionStorage) },
  ),
);
