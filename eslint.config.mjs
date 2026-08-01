import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  {
    files: ["src/detectors/**/*.ts"],
    rules: {
      "no-restricted-globals": ["error",
        { name: "fetch", message: "Detectors must use the injected outbound capability seam." },
        { name: "WebSocket", message: "Detectors cannot open a WebSocket transport." },
        { name: "EventSource", message: "Detectors cannot open an EventSource transport." },
        { name: "XMLHttpRequest", message: "Detectors cannot open an XMLHttpRequest transport." },
        { name: "eval", message: "Detectors cannot synthesize a transport with eval." },
        { name: "Function", message: "Detectors cannot synthesize a transport with Function." },
      ],
      "no-restricted-imports": ["error", { paths: ["http", "https", "net", "dgram", "tls", "module", "node:http", "node:https", "node:net", "node:dgram", "node:tls", "node:module", "undici", "axios"] }],
      "no-restricted-syntax": [
        "error",
        { selector: "MemberExpression[property.name='fetch']", message: "Detectors cannot bypass the guarded outbound boundary through a member fetch call." },
        { selector: "MemberExpression[computed=true][property.value='fetch']", message: "Detectors cannot bypass the guarded outbound boundary through a computed fetch call." },
        { selector: "MemberExpression[property.name='WebSocket']", message: "Detectors cannot bypass the guarded outbound boundary through a WebSocket member." },
        { selector: "MemberExpression[computed=true][property.value='WebSocket']", message: "Detectors cannot bypass the guarded outbound boundary through a computed WebSocket member." },
        { selector: "MemberExpression[property.name='EventSource']", message: "Detectors cannot bypass the guarded outbound boundary through an EventSource member." },
        { selector: "MemberExpression[computed=true][property.value='EventSource']", message: "Detectors cannot bypass the guarded outbound boundary through a computed EventSource member." },
        { selector: "MemberExpression[property.name='XMLHttpRequest']", message: "Detectors cannot bypass the guarded outbound boundary through an XMLHttpRequest member." },
        { selector: "MemberExpression[computed=true][property.value='XMLHttpRequest']", message: "Detectors cannot bypass the guarded outbound boundary through a computed XMLHttpRequest member." },
        { selector: "MemberExpression[property.name='getBuiltinModule']", message: "Detectors cannot load network modules dynamically." },
        { selector: "MemberExpression[computed=true][property.value='getBuiltinModule']", message: "Detectors cannot load network modules through a computed member." },
        { selector: "MemberExpression[property.name='eval']", message: "Detectors cannot synthesize a transport through member eval." },
        { selector: "MemberExpression[computed=true][property.value='eval']", message: "Detectors cannot synthesize a transport through computed eval." },
        { selector: "MemberExpression[property.name='Function']", message: "Detectors cannot synthesize a transport through member Function." },
        { selector: "MemberExpression[computed=true][property.value='Function']", message: "Detectors cannot synthesize a transport through computed Function." },
        { selector: "VariableDeclarator[id.type='ObjectPattern'][init.name='globalThis']", message: "Detectors cannot capture global transport bindings before guarded execution." },
        { selector: "ImportExpression", message: "Detectors cannot dynamically import an outbound transport." },
        { selector: "CallExpression[callee.name='eval']", message: "Detectors cannot synthesize an outbound transport." },
        { selector: "CallExpression[callee.name='Function']", message: "Detectors cannot synthesize an outbound transport." },
        { selector: "NewExpression[callee.name='Function']", message: "Detectors cannot synthesize an outbound transport." },
      ],
    },
  },
  globalIgnores([".next/**", "coverage/**", "playwright-report/**", "test-results/**", "next-env.d.ts"]),
]);
