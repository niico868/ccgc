// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, deployment (build-only),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... } }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// The preview wrapper merges the default export as an object. Resolve the helper's
// async factory before exporting it so that merge retains TanStack's entry plugins.
// Preserve Vite CLI command/mode behavior for dev, development builds and production.
const args = process.argv.slice(2);
const command = args.includes("build") ? "build" : "serve";
const modeIndex = args.findIndex((arg) => arg === "--mode" || arg === "-m");
const inlineMode = args.find((arg) => arg.startsWith("--mode="))?.slice(7);
const mode = inlineMode ?? (modeIndex >= 0 ? args[modeIndex + 1] : undefined)
  ?? (command === "build" || args.includes("preview") ? "production" : "development");

const config = await defineConfig({
  // Keep our existing SSR error wrapper as the server entry.
  tanstackStart: {
    server: { entry: "server" },
  },
})({ command, mode });

export default config;
