import { defineProject } from "vitest/config";

export default defineProject({
  test: {
    environment: "node",
    globals: true,
    name: { label: "api/unit", color: "yellow" },
    // Required env vars
    env: {
      FILE_SYSTEM_TABLE: "FileSystemTable-test",
      FILES_BUCKET_NAME: "files-bucket-test",
      REGION: "us-west-2",
    },
  },
});
