import { describe, expect, it } from "vitest";
import { executeSyntheticCorpus } from "@/application/assurance/engine";
import { syntheticFixtures } from "@/domain/fixtures";
import { detectorRegistry } from "@/detectors";
import { createReceipt, digest } from "@/evidence/receipt";

describe("the declared detector registry", () => {
  it("registers exactly one detector for every P0 requirement", () => {
    expect([...detectorRegistry.keys()]).toEqual([
      "CV-R1", "CV-R2", "CV-R3", "CV-R4", "CV-R5", "CV-R6",
      "CV-R7", "CV-R8", "CV-R9", "CV-R10", "CV-R11", "CV-R12",
    ]);
  });
});

describe("synthetic negative-before-positive controls", () => {
  const run = executeSyntheticCorpus();
  const byFixture = new Map(run.results.map((result) => [result.fixture.fixtureId, result]));

  it.each(syntheticFixtures)("$fixtureId returns the declared decision", (fixture) => {
    const result = byFixture.get(fixture.fixtureId);
    expect(result?.evaluation.decision).toBe(fixture.expectedDecision);
    expect(result?.expectationMet).toBe(true);
    expect(result?.receipt?.externalCallCount).toBe(0);
    expect(result?.receipt?.outboundAttemptCount).toBe(0);
    expect(result?.receipt?.dataClass).toBe("SYNTHETIC");
  });

  it("runs all 24 controls and seals a passing corpus", () => {
    expect(run.results).toHaveLength(24);
    expect(run.terminalState).toBe("PASSED");
    expect(run.externalCallCount).toBe(0);
  });
});

describe("repeatability", () => {
  it("produces an identical normalized receipt digest on a second full run", () => {
    const first = executeSyntheticCorpus();
    const second = executeSyntheticCorpus();
    expect(second.evidenceDigest).toBe(first.evidenceDigest);
    expect(second.runId).toBe(first.runId);
    expect(second.results.map((result) => result.receipt?.evidenceDigest)).toEqual(first.results.map((result) => result.receipt?.evidenceDigest));
  });

  it("changes the sealed receipt and run digests when semantic input changes but issue shape does not", () => {
    const original = structuredClone(syntheticFixtures.find((fixture) => fixture.fixtureId === "CV-R2-BAD")!);
    const mutated = structuredClone(original);
    mutated.data = { ...(mutated.data as Record<string, unknown>), sourceValue: 2099 };
    const first = executeSyntheticCorpus([original]);
    const second = executeSyntheticCorpus([mutated]);
    expect(first.results[0].evaluation.findings.map((finding) => finding.code)).toEqual(second.results[0].evaluation.findings.map((finding) => finding.code));
    expect(first.results[0].receipt?.fixtureInputDigest).not.toBe(second.results[0].receipt?.fixtureInputDigest);
    expect(first.results[0].receipt?.evidenceDigest).not.toBe(second.results[0].receipt?.evidenceDigest);
    expect(first.evidenceDigest).not.toBe(second.evidenceDigest);
  });

  it("binds scenario text independently of fixture data and issue shape", () => {
    const original = structuredClone(syntheticFixtures.find((fixture) => fixture.fixtureId === "CV-R2-BAD")!);
    const mutated = structuredClone(original);
    mutated.scenario = `${original.scenario} Semantic scenario revision.`;
    const first = executeSyntheticCorpus([original]);
    const second = executeSyntheticCorpus([mutated]);
    expect(first.results[0].evaluation.findings).toEqual(second.results[0].evaluation.findings);
    expect(first.results[0].receipt?.fixtureInputDigest).toBe(second.results[0].receipt?.fixtureInputDigest);
    expect(first.results[0].receipt?.scenarioDigest).not.toBe(second.results[0].receipt?.scenarioDigest);
    expect(first.results[0].receipt?.evidenceDigest).not.toBe(second.results[0].receipt?.evidenceDigest);
    expect(first.evidenceDigest).not.toBe(second.evidenceDigest);
  });

  it("binds the complete normalized finding trace, not only issue codes", () => {
    const fixture = structuredClone(syntheticFixtures.find((item) => item.fixtureId === "CV-R2-BAD")!);
    const first = executeSyntheticCorpus([fixture]);
    const originalResult = first.results[0];
    const traceMutation = {
      ...originalResult.evaluation,
      findings: originalResult.evaluation.findings.map((entry) => ({ ...entry, recovery: `${entry.recovery} Escalate the revised trace.` })),
    };
    const mutatedReceipt = createReceipt(fixture, traceMutation, first.contractDigest);
    const originalNormalized = [{ fixtureId: fixture.fixtureId, receipt: originalResult.receipt, expectationMet: true, outboundAttemptCount: 0 }];
    const mutatedNormalized = [{ fixtureId: fixture.fixtureId, receipt: mutatedReceipt, expectationMet: true, outboundAttemptCount: 0 }];
    expect(originalResult.receipt?.issueCodes).toEqual(mutatedReceipt.issueCodes);
    expect(originalResult.receipt?.findingCount).toBe(mutatedReceipt.findingCount);
    expect(originalResult.receipt?.decisionTraceDigest).not.toBe(mutatedReceipt.decisionTraceDigest);
    expect(originalResult.receipt?.evidenceDigest).not.toBe(mutatedReceipt.evidenceDigest);
    expect(digest(originalNormalized)).not.toBe(digest(mutatedNormalized));
  });

  it("binds the sealed contract digest independently of the compiled fixture", () => {
    const fixture = structuredClone(syntheticFixtures.find((item) => item.fixtureId === "CV-R2-GOOD")!);
    const first = executeSyntheticCorpus([fixture], { contractDigest: "sha256:contract-a" });
    const second = executeSyntheticCorpus([fixture], { contractDigest: "sha256:contract-b" });
    expect(first.results[0].evaluation).toEqual(second.results[0].evaluation);
    expect(first.results[0].receipt?.fixtureInputDigest).toBe(second.results[0].receipt?.fixtureInputDigest);
    expect(first.results[0].receipt?.contractDigest).not.toBe(second.results[0].receipt?.contractDigest);
    expect(first.results[0].receipt?.evidenceDigest).not.toBe(second.results[0].receipt?.evidenceDigest);
    expect(first.evidenceDigest).not.toBe(second.evidenceDigest);
  });
});
