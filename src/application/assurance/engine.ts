import type { AssuranceRun, ControlResult, DetectorEvaluation, SyntheticFixture } from "@/domain/assurance";
import { syntheticFixtures } from "@/domain/fixtures";
import { detectorRegistry } from "@/detectors";
import { createReceipt, digest } from "@/evidence/receipt";
import type { AssuranceService, RunAssuranceRequest } from "@/application/assurance/service";

function unavailableDetector(fixture: SyntheticFixture): DetectorEvaluation {
  return {
    requirementId: fixture.requirementId,
    detectorId: fixture.detectorId,
    detectorVersion: "UNAVAILABLE",
    decision: "UNKNOWN",
    health: "UNHEALTHY",
    findings: [{
      code: "DETECTOR_UNAVAILABLE",
      message: `${fixture.detectorId} is not registered.`,
      recovery: "Restore the declared detector before making a clean-state claim.",
    }],
    externalCallCount: 0,
  };
}

export function executeSyntheticCorpus(fixtures: SyntheticFixture[] = syntheticFixtures): AssuranceRun {
  const results: ControlResult[] = fixtures.map((fixture) => {
    const detector = detectorRegistry.get(fixture.requirementId);
    const evaluation = detector?.evaluate(fixture) ?? unavailableDetector(fixture);
    const receipt = createReceipt(fixture, evaluation);
    return {
      fixture,
      evaluation,
      receipt,
      expectationMet: evaluation.decision === fixture.expectedDecision,
    };
  });

  const normalized = results.map(({ receipt, expectationMet }) => ({ receipt, expectationMet }));
  const evidenceDigest = digest(normalized);
  const terminalState = results.every((result) => result.expectationMet) ? "PASSED" : "FAILED";

  return {
    schemaVersion: "AssuranceRun.v1",
    runId: `run_${evidenceDigest.slice(-16)}`,
    fixtureCorpus: "synthetic-renewal-v1",
    executionMode: "OFFLINE_DETERMINISTIC",
    externalCallCount: 0,
    terminalState,
    results,
    evidenceDigest,
    nextAction: terminalState === "PASSED"
      ? "Review the exact receipts; production authority remains absent."
      : "Keep release blocked and repair the failed detector or contract.",
  };
}

export class DeterministicAssuranceService implements AssuranceService {
  async run(request: RunAssuranceRequest): Promise<AssuranceRun> {
    if (request.fixtureCorpus !== "synthetic-renewal-v1") throw new Error("FIXTURE_CORPUS_NOT_ALLOWED");
    return executeSyntheticCorpus();
  }
}
