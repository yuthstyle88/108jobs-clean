import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Ignore vendored library code from root lint to avoid noise.
    "src/lib/lemmy-js-client/**",
    // src/lib/108jobs-client is a standalone sub-package with its own
    // package.json/tsconfig/build pipeline (already excluded from the root
    // tsconfig.json and vitest.config.ts for the same reason) -- its dist/
    // output and generated types aren't code this app's React Compiler
    // lint rules apply to.
    "src/lib/108jobs-client/**",
  ]),
  {
    rules: {
      // Surface explicit any usages as warnings to guide cleanup.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
]);

export default eslintConfig;
