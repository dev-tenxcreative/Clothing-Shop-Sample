"use client";

/**
 * Custom next/image loader. Unsplash (imgix) and Pexels both resize and
 * re-encode on their CDNs, so we request the exact width instead of proxying
 * through the Next.js optimiser. Any other source is returned untouched.
 */
type LoaderArgs = { src: string; width: number; quality?: number };

export default function veloraImageLoader({ src, width, quality }: LoaderArgs) {
  const q = quality ?? 75;

  if (src.startsWith("https://images.unsplash.com") || src.startsWith("https://plus.unsplash.com")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(q));
    url.searchParams.set("auto", "format");
    if (!url.searchParams.has("fit")) url.searchParams.set("fit", "crop");
    return url.toString();
  }

  if (src.startsWith("https://images.pexels.com")) {
    const url = new URL(src);
    url.searchParams.set("auto", "compress");
    url.searchParams.set("cs", "tinysrgb");
    url.searchParams.set("w", String(width));
    return url.toString();
  }

  // Local / other assets: append width so next/image's srcset stays unique.
  return src.includes("?") ? `${src}&w=${width}` : `${src}?w=${width}`;
}
