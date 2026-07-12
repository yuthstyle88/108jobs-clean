import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    // src/lib/108jobs-client is a self-contained sub-package with its own
    // package.json/node_modules/build pipeline (it publishes the 108jobs-client
    // npm SDK) -- its own test suite needs deps only installed there.
    exclude: ["src/lib/108jobs-client/**", "node_modules/**"],
  },
});
