import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./test-setup.ts"],
    name: { label: "webapp/unit", color: "cyan" },
  },
});
