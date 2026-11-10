import type { Metadata } from "next";
import { WishlistView } from "@/components/checkout/WishlistView";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false },
};

export default function WishlistPage() {
  return <WishlistView />;
}
