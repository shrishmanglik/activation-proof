import { ESLint } from "eslint";
import { beforeAll, describe, expect, it } from "vitest";

const eslint = new ESLint();
const detectorFilePath = "src/detectors/mutation.detector.ts";

describe("detector static outbound boundary", () => {
  beforeAll(async () => {
    await eslint.lintText("export const detector = true;", { filePath: detectorFilePath });
  }, 15_000);

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
    const [result] = await eslint.lintText(source, { filePath: detectorFilePath });
    expect(result.errorCount).toBeGreaterThan(0);
  });
});
