// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.

// ⚠️ IMPORTANT: The top-level `nitro: { ... }` option in @lovable.dev/vite-tanstack-config v2.4.0
// is NOT forwarded to the actual Nitro build. The default Cloudflare preset silently remains.
// To override the preset for Vercel deployment, we must explicitly import and inject the
// nitro plugin inside the `vite.plugins` array below.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { nitro } from "nitro/vite";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  // Override the default Cloudflare Nitro preset with Vercel for serverless deployment.
  // Injecting via vite.plugins ensures the override is actually applied.
  vite: {
    plugins: [
      nitro({
        preset: "vercel",
        output: {
          dir: ".vercel/output",
          publicDir: ".vercel/output/static",
        },
      }),
    ],
  },
});
