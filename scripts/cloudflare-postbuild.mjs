/**
 * Runs after `npm run build`.
 *
 * On Cloudflare Workers Builds (WORKERS_CI is set) the deploy step runs
 * `wrangler deploy`, which hands over to `opennextjs-cloudflare deploy` and
 * expects a ready `.open-next/` bundle. This script creates that bundle from
 * the Next.js build that just finished, without rebuilding Next.js.
 *
 * Locally this is a no-op, so `npm run build` stays a plain `next build`.
 * Set CLOUDFLARE_BUILD=1 to force it (e.g. to test the bundle locally).
 */
import { spawnSync } from "node:child_process";

if (!process.env.WORKERS_CI && !process.env.CLOUDFLARE_BUILD) {
  process.exit(0);
}

console.log("\n▲ Cloudflare build detected — bundling with OpenNext (skipping second Next.js build)\n");
const result = spawnSync("npx", ["opennextjs-cloudflare", "build", "--skipNextBuild"], {
  stdio: "inherit",
  shell: process.platform === "win32",
});
process.exit(result.status ?? 1);
