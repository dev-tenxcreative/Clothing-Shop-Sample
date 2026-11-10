import type { NextConfig } from "next";

/**
 * Images are served straight from the Unsplash / Pexels CDNs through a custom
 * loader (src/lib/image-loader.ts) that asks each CDN for the exact width and
 * format the browser needs. `remotePatterns` still lists every allowed host so
 * switching back to the built-in optimiser is a one-line change.
 */
/**
 * Cloudflare Workers Builds sets WORKERS_CI. OpenNext (scripts/cloudflare-postbuild.mjs)
 * bundles the Next.js "standalone" output, so produce it there — exactly what
 * `opennextjs-cloudflare build` would set — while local `next start` keeps working.
 */
const isCloudflareBuild = Boolean(process.env.WORKERS_CI || process.env.CLOUDFLARE_BUILD);

const nextConfig: NextConfig = {
  ...(isCloudflareBuild ? { output: "standalone" as const, outputFileTracingRoot: process.cwd() } : {}),
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    qualities: [60, 75, 85],
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "videos.pexels.com" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "gsap"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
