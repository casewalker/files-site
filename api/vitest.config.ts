import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    target: "esnext",
  },
  test: {
    globals: true,
    environment: "node",
    silent: "passed-only",
    pool: "threads",
  },
  resolve: {
    alias: {
      "@secure-cloud-files/src": path.resolve(__dirname, "./src"),
    },
  },
});
