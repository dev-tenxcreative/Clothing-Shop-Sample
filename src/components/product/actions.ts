"use client";

import type { Product, ProductColour, Size } from "@/data/types";
import { effectivePrice } from "@/lib/products";
import { flyToCart } from "@/lib/fly-to-cart";
import { useCart } from "@/store/cart";
import { toast, useWishlist } from "@/store";

/** Adds a product variant to the bag with toast + fly animation. */
export function addProductToCart(
  product: Product,
  colour: ProductColour,
  size: Size,
  quantity = 1,
  opts: { fromEl?: Element | null; openDrawer?: boolean } = {},
) {
  const stock = product.sizes.find((s) => s.size === size)?.stock ?? 0;
  if (stock <= 0) {
    toast({ title: "That size is sold out", tone: "error" });
    return false;
  }
  const image = colour.images[0];
  useCart.getState().add({
    productId: product.id,
    slug: product.slug,
    name: product.name,
    colour: colour.name,
    size,
    price: effectivePrice(product),
    compareAt: product.salePrice ? product.price : undefined,
    image: image.src,
    imageAlt: image.alt,
    maxQuantity: Math.min(stock, 10),
    quantity,
  });
  flyToCart(opts.fromEl ?? null, `${image.src}?w=320&q=60&auto=format&fit=crop`);
  if (opts.openDrawer) {
    window.setTimeout(() => useCart.getState().open(), opts.fromEl ? 650 : 0);
  } else {
    toast({
      title: "Added to your bag",
      description: `${product.name} · ${colour.name} · ${size}`,
      image: `${image.src}?w=96&q=60&auto=format&fit=crop`,
      action: { label: "View bag", onClick: () => useCart.getState().open() },
    });
  }
  return true;
}

export function toggleWishlist(product: Product) {
  const added = useWishlist.getState().toggle(product.id);
  toast({
    title: added ? "Saved to your wishlist" : "Removed from wishlist",
    description: product.name,
    image: `${product.colours[0].images[0].src}?w=96&q=60&auto=format&fit=crop`,
  });
  return added;
}
