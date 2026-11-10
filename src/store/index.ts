"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

/* Wishlist ---------------------------------------------------------- */

interface WishlistState {
  ids: string[];
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
  has: (id: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const exists = get().ids.includes(id);
        set({ ids: exists ? get().ids.filter((x) => x !== id) : [id, ...get().ids] });
        return !exists;
      },
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
      has: (id) => get().ids.includes(id),
    }),
    { name: "velora-wishlist", storage: createJSONStorage(() => window.localStorage) },
  ),
);

/* Recently viewed ------------------------------------------------- */

interface RecentState {
  ids: string[];
  push: (id: string) => void;
}

export const useRecentlyViewed = create<RecentState>()(
  persist(
    (set, get) => ({
      ids: [],
      push: (id) => set({ ids: [id, ...get().ids.filter((x) => x !== id)].slice(0, 12) }),
    }),
    { name: "velora-recent", storage: createJSONStorage(() => window.localStorage) },
  ),
);

/* Recent searches ------------------------------------------------- */

interface SearchHistoryState {
  terms: string[];
  add: (t: string) => void;
  clear: () => void;
}

export const useSearchHistory = create<SearchHistoryState>()(
  persist(
    (set, get) => ({
      terms: [],
      add: (t) => {
        const term = t.trim();
        if (!term) return;
        set({ terms: [term, ...get().terms.filter((x) => x.toLowerCase() !== term.toLowerCase())].slice(0, 6) });
      },
      clear: () => set({ terms: [] }),
    }),
    { name: "velora-searches", storage: createJSONStorage(() => window.localStorage) },
  ),
);

/* Global UI ------------------------------------------------------- */

interface UIState {
  searchOpen: boolean;
  menuOpen: boolean;
  quickViewSlug: string | null;
  sizeGuideCategory: string | null;
  setSearch: (open: boolean) => void;
  setMenu: (open: boolean) => void;
  openQuickView: (slug: string | null) => void;
  openSizeGuide: (category: string | null) => void;
}

export const useUI = create<UIState>()((set) => ({
  searchOpen: false,
  menuOpen: false,
  quickViewSlug: null,
  sizeGuideCategory: null,
  setSearch: (searchOpen) => set({ searchOpen }),
  setMenu: (menuOpen) => set({ menuOpen }),
  openQuickView: (quickViewSlug) => set({ quickViewSlug }),
  openSizeGuide: (sizeGuideCategory) => set({ sizeGuideCategory }),
}));

/* Toasts ---------------------------------------------------------- */

export interface Toast {
  id: number;
  title: string;
  description?: string;
  tone?: "default" | "success" | "error";
  image?: string;
  action?: { label: string; onClick: () => void };
}

interface ToastState {
  toasts: Toast[];
  push: (t: Omit<Toast, "id">) => void;
  dismiss: (id: number) => void;
}

let toastId = 0;
export const useToasts = create<ToastState>()((set, get) => ({
  toasts: [],
  push: (t) => {
    const id = ++toastId;
    set({ toasts: [...get().toasts.slice(-2), { ...t, id }] });
    window.setTimeout(() => get().dismiss(id), t.action ? 6000 : 3800);
  },
  dismiss: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));

export const toast = (t: Omit<Toast, "id">) => useToasts.getState().push(t);

/* Hydration helpers ---------------------------------------------- */

const noop = () => () => {};
/** True only after the client has mounted — use before reading persisted state. */
export function useMounted() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false,
  );
}

/** Subscribes to a CSS media query; always false during SSR. */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Persisted listing preferences (grid density). */
interface PrefsState {
  gridCols: 2 | 3 | 4;
  setGridCols: (n: 2 | 3 | 4) => void;
}
export const usePrefs = create<PrefsState>()(
  persist((set) => ({ gridCols: 3, setGridCols: (gridCols) => set({ gridCols }) }), {
    name: "velora-prefs",
    storage: createJSONStorage(() => window.localStorage),
  }),
);

/** Returns true while the user prefers reduced motion. */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}
