import { ESLint } from "eslint";
import { describe, expect, it } from "vitest";

describe("detector static outbound boundary", () => {
  it.each([
    "export const bypass = () => globalThis.fetch('https://invalid.example');",
    "export const bypass = () => globalThis['fetch']('https://invalid.example');",
    "export const bypass = () => import('node:https');",
    "export const bypass = () => process.getBuiltinModule('https');",
    "export const bypass = () => new WebSocket('wss://invalid.example');",
    "import { createRequire } from 'node:module'; export const bypass = () => createRequire(import.meta.url)('node:https');",
    "export const bypass = () => new globalThis['WebSocket']('wss://invalid.example');",
    "export const bypass = () => new globalThis['EventSource']('https://invalid.example');",
    "export const bypass = () => new globalThis['XMLHttpRequest']();",
    "export const bypass = () => process['getBuiltinModule']('https');",
    "export const bypass = () => globalThis.eval('fetch(1)');",
    "export const bypass = () => Function('return fetch(1)')();",
    "export const bypass = () => globalThis.Function('return fetch(1)')();",
    "const { fetch: captured } = globalThis; export const bypass = () => captured('https://invalid.example');",
  ])("rejects a network bypass form", async (source) => {
    const eslint = new ESLint();
    const [result] = await eslint.lintText(source, { filePath: "src/detectors/mutation.detector.ts" });
    expect(result.errorCount).toBeGreaterThan(0);
  });
});
