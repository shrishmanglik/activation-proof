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
      "no-restricted-imports": ["error", { paths: ["http", "https", "net", "dgram", "tls", "node:http", "node:https", "node:net", "node:dgram", "node:tls", "undici", "axios"] }],
      "no-restricted-syntax": [
        "error",
        { selector: "MemberExpression[property.name='fetch']", message: "Detectors cannot bypass the guarded outbound boundary through a member fetch call." },
        { selector: "MemberExpression[computed=true][property.value='fetch']", message: "Detectors cannot bypass the guarded outbound boundary through a computed fetch call." },
        { selector: "MemberExpression[property.name='getBuiltinModule']", message: "Detectors cannot load network modules dynamically." },
        { selector: "ImportExpression", message: "Detectors cannot dynamically import an outbound transport." },
        { selector: "CallExpression[callee.name='eval']", message: "Detectors cannot synthesize an outbound transport." },
        { selector: "NewExpression[callee.name='Function']", message: "Detectors cannot synthesize an outbound transport." },
      ],
    },
  },
  globalIgnores([".next/**", "coverage/**", "playwright-report/**", "test-results/**", "next-env.d.ts"]),
]);
