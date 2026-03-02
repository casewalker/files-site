import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    environment: "node",
    globals: true,
    name: { label: "api/unit", color: "yellow" },
  },
});
