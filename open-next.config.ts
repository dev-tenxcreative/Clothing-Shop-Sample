import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

/**
 * Every VELORA page is prerendered at build time and nothing revalidates,
 * so prerendered HTML is served straight from Workers static assets —
 * no R2 bucket or KV namespace is needed.
 */
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
