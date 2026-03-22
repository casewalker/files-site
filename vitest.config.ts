import { coverageConfigDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    silent: "passed-only",
    pool: "threads",
    coverage: {
      exclude: [
        "**/vitest.global-setup.ts",
        "**/vitest.setup.ts",
        ...coverageConfigDefaults.exclude,
      ],
    },
    projects: ["**/vitest.config.*.ts", "**/vitest.config.ts"],
  },
});
