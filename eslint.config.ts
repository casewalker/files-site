import globals from "globals";
import vitest from "@vitest/eslint-plugin";
import tslint from "typescript-eslint";
import tsParser from "@typescript-eslint/parser";
import eslint from "@eslint/js";
import importX from "eslint-plugin-import-x";
import eslintConfigPrettier from "eslint-config-prettier";

// TODO: Switch from tslint.config() to ESLint's defineConfig() once type incompatibilities with
// third-party plugins (e.g. eslint-plugin-import-x) are resolved upstream.
// See: https://github.com/typescript-eslint/typescript-eslint/issues/11313
//      https://github.com/typescript-eslint/typescript-eslint/issues/10934
//      https://github.com/un-ts/eslint-plugin-import-x/issues/421
//      https://github.com/typescript-eslint/typescript-eslint/issues/11543
export default tslint.config(
  {
    ignores: [
      "**/*.json",
      "**/*.yml",
      "**/*.yaml",
      "**/.github",
      "**/.gitignore",
      "**/.nvmrc",
      "**/.prettierignore",
      "eslint.config.*",
      "coverage",
      "**/cdk.out/**",
      "**/*.d.ts",
      "vitest.config.ts",
      "**/.next/**",
    ],
  },

  // global defaults
  eslint.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  ...tslint.configs.recommended,
  {
    files: ["./api/**/*.ts"],
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: { project: "./api/tsconfig.json" },
    },
  },
  {
    files: ["./infra/**/*.ts"],
    languageOptions: {
      globals: { ...globals.node },
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: { project: "./infra/tsconfig.json" },
    },
  },
  {
    files: ["./webapp/**/*.{ts,tsx}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tsParser,
      parserOptions: { project: "./webapp/tsconfig.json" },
    },
  },
  {
    rules: {
      "no-console": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/explicit-function-return-type": "warn",
      "prefer-template": "error",
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/strict-boolean-expressions": [
        "error",
        {
          allowNumber: false,
          allowString: false,
          allowNullableBoolean: true,
          allowNullableObject: false,
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          disallowTypeAnnotations: true,
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "import-x/consistent-type-specifier-style": ["error", "prefer-top-level"],
      "import-x/order": [
        "error",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index", "object"],
          pathGroups: [
            { pattern: "#**", group: "internal", position: "before" },
            { pattern: "@secure-cloud-files/**", group: "external", position: "after" },
          ],
          pathGroupsExcludedImportTypes: ["builtin", "object"],
        },
      ],
    },
  },

  // tests
  {
    // update this to match your test files
    files: ["**/*.test.*"],
    plugins: { vitest },
    languageOptions: {
      globals: { ...globals.node },
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "vitest/valid-title": ["error", { allowArguments: true }],
    },
  },
  eslintConfigPrettier,
  // override prettier's overrides
  { rules: { curly: "error" } },
);
