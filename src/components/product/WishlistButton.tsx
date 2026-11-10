"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import type { Product } from "@/data/types";
import { useMounted, useWishlist } from "@/store";
import { cn } from "@/lib/utils";
import { toggleWishlist } from "./actions";

export function WishlistButton({ product, className, size = "md" }: { product: Product; className?: string; size?: "md" | "lg" }) {
  const mounted = useMounted();
  const active = useWishlist((s) => s.ids.includes(product.id)) && mounted;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleWishlist(product);
      }}
      aria-pressed={active}
      aria-label={active ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      className={cn(
        "bg-ivory/85 text-ink hover:bg-ivory relative grid place-items-center rounded-full backdrop-blur transition active:scale-90",
        size === "lg" ? "border-line h-14 w-14 border" : "h-9 w-9",
        className,
      )}
    >
      <motion.span animate={active ? { scale: [1, 1.35, 1] } : { scale: 1 }} transition={{ duration: 0.45 }}>
        <Heart className={cn(size === "lg" ? "h-5 w-5" : "h-4 w-4", active && "fill-rose text-rose")} strokeWidth={1.5} />
      </motion.span>
      <AnimatePresence>
        {active && (
          <motion.span
            key="burst"
            className="border-rose pointer-events-none absolute inset-0 rounded-full border"
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 1.7, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </button>
  );
}
