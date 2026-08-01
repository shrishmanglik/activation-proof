import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ["src/detectors/**/*.ts"],
    rules: {
      "no-restricted-globals": ["error", { name: "fetch", message: "Detectors must use the injected outbound capability seam." }],
      "no-restricted-imports": ["error", { paths: ["node:http", "node:https", "node:net", "node:dgram", "axios"] }],
    },
  },
  globalIgnores([".next/**", "coverage/**", "playwright-report/**", "test-results/**", "next-env.d.ts"]),
]);
