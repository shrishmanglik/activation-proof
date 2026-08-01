import { describe, expect, it } from "vitest";
import { executeSyntheticCorpus } from "@/application/assurance/engine";
import type { Detector } from "@/domain/assurance";
import { syntheticFixtures } from "@/domain/fixtures";
import { detectorRegistry } from "@/detectors";

describe("enforced outbound capability boundary", () => {
  it("blocks an attempted network-shaped operation before any receipt can be sealed", () => {
    const maliciousDetector: Detector = {
      requirementId: "CV-R4",
      detectorId: "DET-CV-R4",
      version: "mutation-network-attempt",
      evaluate(_fixture, context) {
        return context.outbound.request("mutation-network-attempt");
      },
    };
    const mutatedRegistry = new Map(detectorRegistry);
    mutatedRegistry.set("CV-R4", maliciousDetector);
    const fixture = syntheticFixtures.find((item) => item.fixtureId === "CV-R4-BAD")!;
    const run = executeSyntheticCorpus([fixture], { detectors: mutatedRegistry });
    expect(run.terminalState).toBe("FAILED");
    expect(run.results[0].outboundAttemptCount).toBe(1);
    expect(run.results[0].evaluation.externalCallCount).toBe(0);
    expect(run.results[0].receipt).toBeNull();
    expect(run.results[0].evaluation.findings[0].code).toBe("DETECTOR_EXECUTION_BLOCKED");
  });

  it("intercepts a globalThis.fetch bypass before the underlying transport can run", () => {
    const originalFetch = globalThis.fetch;
    let underlyingCalls = 0;
    globalThis.fetch = (() => {
      underlyingCalls += 1;
      throw new Error("UNDERLYING_TRANSPORT_SHOULD_NOT_RUN");
    }) as typeof fetch;
    try {
      const bypassDetector: Detector = {
        requirementId: "CV-R4",
        detectorId: "DET-CV-R4",
        version: "mutation-global-fetch",
        evaluate() {
          globalThis.fetch("https://invalid.example");
          throw new Error("UNREACHABLE");
        },
      };
      const mutatedRegistry = new Map(detectorRegistry);
      mutatedRegistry.set("CV-R4", bypassDetector);
      const fixture = syntheticFixtures.find((item) => item.fixtureId === "CV-R4-BAD")!;
      const run = executeSyntheticCorpus([fixture], { detectors: mutatedRegistry });
      expect(underlyingCalls).toBe(0);
      expect(run.terminalState).toBe("FAILED");
      expect(run.results[0].outboundAttemptCount).toBe(1);
      expect(run.results[0].evaluation.externalCallCount).toBe(0);
      expect(run.results[0].receipt).toBeNull();
      expect(run.results[0].evaluation.findings[0].message).toContain("OUTBOUND_CAPABILITY_DENIED:globalThis.fetch");
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("intercepts a globalThis.WebSocket bypass before the underlying transport can run", () => {
    const originalWebSocket = globalThis.WebSocket;
    let underlyingCalls = 0;
    globalThis.WebSocket = (function () {
      underlyingCalls += 1;
    }) as unknown as typeof WebSocket;
    try {
      const bypassDetector: Detector = {
        requirementId: "CV-R4",
        detectorId: "DET-CV-R4",
        version: "mutation-global-websocket",
        evaluate() {
          new globalThis.WebSocket("wss://invalid.example");
          throw new Error("UNREACHABLE");
        },
      };
      const mutatedRegistry = new Map(detectorRegistry);
      mutatedRegistry.set("CV-R4", bypassDetector);
      const fixture = syntheticFixtures.find((item) => item.fixtureId === "CV-R4-BAD")!;
      const run = executeSyntheticCorpus([fixture], { detectors: mutatedRegistry });
      expect(underlyingCalls).toBe(0);
      expect(run.terminalState).toBe("FAILED");
      expect(run.results[0].outboundAttemptCount).toBe(1);
      expect(run.results[0].evaluation.externalCallCount).toBe(0);
      expect(run.results[0].receipt).toBeNull();
      expect(run.results[0].evaluation.findings[0].message).toContain("OUTBOUND_CAPABILITY_DENIED:globalThis.WebSocket");
    } finally {
      globalThis.WebSocket = originalWebSocket;
    }
  });
});
