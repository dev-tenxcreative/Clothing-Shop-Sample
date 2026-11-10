"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/**
 * Front-end mock of an account session. Replace `login`/`register` with calls
 * to your auth provider; the shape of `user`, `addresses` and `orders` is what
 * the account pages expect.
 */

export interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  district: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export type OrderStatus = "Placed" | "Packed" | "Shipped" | "Out for delivery" | "Delivered";
export const ORDER_STEPS: OrderStatus[] = ["Placed", "Packed", "Shipped", "Out for delivery", "Delivered"];

export interface OrderLine {
  name: string;
  slug: string;
  colour: string;
  size: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  number: string;
  date: string;
  status: OrderStatus;
  total: number;
  subtotal: number;
  shipping: number;
  discount: number;
  lines: OrderLine[];
  deliveryMethod: string;
  paymentMethod: string;
  address: Omit<Address, "id" | "label">;
  email: string;
}

interface AccountState {
  user: { firstName: string; lastName: string; email: string; phone?: string } | null;
  addresses: Address[];
  orders: Order[];
  login: (email: string) => void;
  register: (u: { firstName: string; lastName: string; email: string }) => void;
  logout: () => void;
  updateProfile: (u: Partial<NonNullable<AccountState["user"]>>) => void;
  saveAddress: (a: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  addOrder: (o: Order) => void;
}

const demoOrders: Order[] = [
  {
    number: "VL-240918",
    date: "2026-10-28",
    status: "Shipped",
    subtotal: 15900,
    shipping: 0,
    discount: 0,
    total: 15900,
    deliveryMethod: "Standard Delivery",
    paymentMethod: "Visa •••• 4242",
    email: "you@example.com",
    address: {
      firstName: "Demo",
      lastName: "Customer",
      line1: "12 Flower Road",
      city: "Colombo 07",
      district: "Colombo",
      postalCode: "00700",
      phone: "+94 77 000 0000",
    },
    lines: [
      {
        name: "Celeste Linen Midi Frock",
        slug: "celeste-linen-midi-frock",
        colour: "Ivory",
        size: "S",
        quantity: 1,
        price: 8950,
        image: "https://images.unsplash.com/photo-1602303832953-05d841ee21f7",
      },
      {
        name: "Mila Wide-Leg Linen Trousers",
        slug: "mila-wide-leg-linen-trousers",
        colour: "Sand",
        size: "S",
        quantity: 1,
        price: 6950,
        image: "https://images.unsplash.com/photo-1789110853687-71692f0e86be",
      },
    ],
  },
  {
    number: "VL-238201",
    date: "2026-09-12",
    status: "Delivered",
    subtotal: 7450,
    shipping: 450,
    discount: 745,
    total: 7155,
    deliveryMethod: "Standard Delivery",
    paymentMethod: "Cash on Delivery",
    email: "you@example.com",
    address: {
      firstName: "Demo",
      lastName: "Customer",
      line1: "12 Flower Road",
      city: "Colombo 07",
      district: "Colombo",
      postalCode: "00700",
      phone: "+94 77 000 0000",
    },
    lines: [
      {
        name: "Ruby Silk Blouse",
        slug: "ruby-silk-blouse",
        colour: "Ruby",
        size: "M",
        quantity: 1,
        price: 7450,
        image: "https://images.unsplash.com/photo-1761117228880-df2425bd70da",
      },
    ],
  },
];

export const useAccount = create<AccountState>()(
  persist(
    (set, get) => ({
      user: null,
      addresses: [],
      orders: [],
      login: (email) => {
        const name = email.split("@")[0].replace(/[._-]+/g, " ");
        set({
          user: { firstName: name.charAt(0).toUpperCase() + name.slice(1), lastName: "", email },
          orders: get().orders.length ? get().orders : demoOrders.map((o) => ({ ...o, email })),
        });
      },
      register: (u) => set({ user: u, orders: get().orders }),
      logout: () => set({ user: null }),
      updateProfile: (u) => set({ user: get().user ? { ...get().user!, ...u } : null }),
      saveAddress: (a) => {
        const id = `addr-${Date.now()}`;
        const addresses = a.isDefault ? get().addresses.map((x) => ({ ...x, isDefault: false })) : get().addresses;
        set({ addresses: [...addresses, { ...a, id, isDefault: a.isDefault || addresses.length === 0 }] });
      },
      removeAddress: (id) => set({ addresses: get().addresses.filter((a) => a.id !== id) }),
      addOrder: (o) => set({ orders: [o, ...get().orders] }),
    }),
    { name: "velora-account", storage: createJSONStorage(() => window.localStorage) },
  ),
);
