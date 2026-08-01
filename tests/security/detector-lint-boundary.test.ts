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
  ])("rejects a network bypass form", async (source) => {
    const eslint = new ESLint();
    const [result] = await eslint.lintText(source, { filePath: "src/detectors/mutation.detector.ts" });
    expect(result.errorCount).toBeGreaterThan(0);
  });
});
