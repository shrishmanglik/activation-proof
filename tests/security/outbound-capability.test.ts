import { describe, expect, it } from "vitest";
import { executeSyntheticCorpus } from "@/application/assurance/engine";
import { DenyAllOutboundCapability } from "@/application/assurance/outbound-capability";
import type { Detector } from "@/domain/assurance";
import { syntheticFixtures } from "@/domain/fixtures";
import { detectorRegistry } from "@/detectors";

const fixture = syntheticFixtures.find((item) => item.fixtureId === "CV-R4-BAD")!;

function runReplacement(detector: Detector) {
  const replacedRegistry = new Map(detectorRegistry);
  replacedRegistry.set("CV-R4", detector);
  return executeSyntheticCorpus([fixture], { detectors: replacedRegistry });
}

describe("enforced outbound capability boundary", () => {
  it("counts and denies the injected capability before any call can complete", () => {
    const capability = new DenyAllOutboundCapability();
    expect(() => capability.request("mutation-network-attempt")).toThrow("OUTBOUND_CAPABILITY_DENIED:mutation-network-attempt");
    expect(capability.attemptCount).toBe(1);
    expect(capability.successfulCallCount).toBe(0);
  });

  it("guards fetch resolved during canonical synchronous evaluation", () => {
    const originalFetch = globalThis.fetch;
    let underlyingCalls = 0;
    globalThis.fetch = (() => {
      underlyingCalls += 1;
      throw new Error("UNDERLYING_TRANSPORT_SHOULD_NOT_RUN");
    }) as typeof fetch;
    try {
      const capability = new DenyAllOutboundCapability();
      expect(() => capability.runGuarded(() => globalThis.fetch("https://invalid.example"))).toThrow("OUTBOUND_CAPABILITY_DENIED:globalThis.fetch");
      expect(underlyingCalls).toBe(0);
      expect(capability.attemptCount).toBe(1);
      expect(capability.successfulCallCount).toBe(0);
    } finally {
      globalThis.fetch = originalFetch;
    }
  });

  it("guards WebSocket resolved during canonical synchronous evaluation", () => {
    const originalWebSocket = globalThis.WebSocket;
    let underlyingCalls = 0;
    globalThis.WebSocket = (function () {
      underlyingCalls += 1;
    }) as unknown as typeof WebSocket;
    try {
      const capability = new DenyAllOutboundCapability();
      expect(() => capability.runGuarded(() => new globalThis.WebSocket("wss://invalid.example"))).toThrow("OUTBOUND_CAPABILITY_DENIED:globalThis.WebSocket");
      expect(underlyingCalls).toBe(0);
      expect(capability.attemptCount).toBe(1);
      expect(capability.successfulCallCount).toBe(0);
    } finally {
      globalThis.WebSocket = originalWebSocket;
    }
  });

  it("rejects a replacement detector before an injected evaluator can execute or seal", () => {
    let executed = 0;
    const replacement: Detector = {
      requirementId: "CV-R4", detectorId: "DET-CV-R4", version: "mutation-replacement",
      evaluate() { executed += 1; throw new Error("UNREACHABLE"); },
    };
    const run = runReplacement(replacement);
    expect(executed).toBe(0);
    expect(run.terminalState).toBe("FAILED");
    expect(run.results[0].outboundAttemptCount).toBe(0);
    expect(run.results[0].receipt).toBeNull();
    expect(run.results[0].evaluation.findings[0].code).toBe("DETECTOR_REGISTRY_REPLACEMENT_REJECTED");
  });

  it("rejects a pre-captured transport replacement before its underlying marker runs", () => {
    let underlyingCalls = 0;
    const capturedFetch = () => { underlyingCalls += 1; };
    const replacement: Detector = {
      requirementId: "CV-R4", detectorId: "DET-CV-R4", version: "mutation-pre-captured-fetch",
      evaluate() { capturedFetch(); throw new Error("UNREACHABLE"); },
    };
    const run = runReplacement(replacement);
    expect(underlyingCalls).toBe(0);
    expect(run.results[0].receipt).toBeNull();
    expect(run.results[0].evaluation.findings[0].code).toBe("DETECTOR_REGISTRY_REPLACEMENT_REJECTED");
  });

  it("rejects a computed builtin-loader replacement before loader or request markers run", () => {
    let loaderCalls = 0;
    let requestCalls = 0;
    const processLike = {
      getBuiltinModule() {
        loaderCalls += 1;
        return { request() { requestCalls += 1; } };
      },
    };
    const replacement: Detector = {
      requirementId: "CV-R4", detectorId: "DET-CV-R4", version: "mutation-computed-loader",
      evaluate() {
        processLike["getBuiltinModule"]().request();
        throw new Error("UNREACHABLE");
      },
    };
    const run = runReplacement(replacement);
    expect(loaderCalls).toBe(0);
    expect(requestCalls).toBe(0);
    expect(run.results[0].receipt).toBeNull();
    expect(run.results[0].evaluation.findings[0].code).toBe("DETECTOR_REGISTRY_REPLACEMENT_REJECTED");
  });

  it("exposes a read-only facade over frozen canonical detector objects", () => {
    expect("set" in (detectorRegistry as object)).toBe(false);
    expect([...detectorRegistry.values()].every(Object.isFrozen)).toBe(true);
  });
});
