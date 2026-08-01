import type { AssuranceRun, ControlResult, Detector, DetectorEvaluation, RequirementId, SyntheticFixture } from "@/domain/assurance";
import { syntheticFixtures } from "@/domain/fixtures";
import { detectorRegistry, getCanonicalDetector } from "@/detectors";
import { createReceipt, digest } from "@/evidence/receipt";
import type { AssuranceService, RunAssuranceRequest } from "@/application/assurance/service";
import { DenyAllOutboundCapability } from "@/application/assurance/outbound-capability";
import { compileSyntheticFixtures } from "@/application/assurance/compiler";
import { verifyJourneyContract } from "@/domain/journey-contract";

const defaultContractDigest = digest({
  schemaVersion: "JourneyContract.v1",
  journeyKey: "synthetic-renewal",
  source: "repository-fixture-adapter",
  destination: "lifecycle-simulator",
  dataClass: "SYNTHETIC",
});

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
    outboundAttemptCount: 0,
  };
}

function rejectedDetectorReplacement(fixture: SyntheticFixture): DetectorEvaluation {
  return {
    ...unavailableDetector(fixture),
    findings: [{
      code: "DETECTOR_REGISTRY_REPLACEMENT_REJECTED",
      message: `${fixture.detectorId} is not the frozen repository-owned detector.`,
      recovery: "Restore the canonical detector and rerun the controls.",
    }],
  };
}

export interface ExecutionOptions {
  contractDigest?: string;
  detectors?: ReadonlyMap<RequirementId, Detector>;
}

export function executeSyntheticCorpus(fixtures: SyntheticFixture[] = syntheticFixtures, options: ExecutionOptions = {}): AssuranceRun {
  const contractDigest = options.contractDigest ?? defaultContractDigest;
  const detectors = options.detectors ?? detectorRegistry;
  const results: ControlResult[] = fixtures.map((fixture) => {
    const detector = detectors.get(fixture.requirementId);
    const canonicalDetector = getCanonicalDetector(fixture.requirementId);
    const detectorIsCanonical = detector !== undefined && detector === canonicalDetector;
    const outbound = new DenyAllOutboundCapability();
    let evaluation: DetectorEvaluation;
    try {
      evaluation = detectorIsCanonical
        ? outbound.runGuarded(() => detector.evaluate(fixture, { outbound }))
        : detector === undefined
          ? unavailableDetector(fixture)
          : rejectedDetectorReplacement(fixture);
    } catch (caught) {
      evaluation = {
        ...unavailableDetector(fixture),
        findings: [{
          code: "DETECTOR_EXECUTION_BLOCKED",
          message: caught instanceof Error ? caught.message : "Detector execution failed.",
          recovery: "Keep promotion blocked and inspect the detector capability boundary.",
        }],
        outboundAttemptCount: outbound.attemptCount,
      };
    }
    evaluation = { ...evaluation, externalCallCount: outbound.successfulCallCount, outboundAttemptCount: outbound.attemptCount };
    const receipt = detectorIsCanonical && outbound.attemptCount === 0 ? createReceipt(fixture, evaluation, contractDigest) : null;
    return {
      fixture,
      evaluation,
      receipt,
      expectationMet: receipt !== null && evaluation.decision === fixture.expectedDecision,
      outboundAttemptCount: outbound.attemptCount,
    };
  });

  const normalized = results.map(({ fixture, receipt, expectationMet, outboundAttemptCount }) => ({ fixtureId: fixture.fixtureId, receipt, expectationMet, outboundAttemptCount }));
  const evidenceDigest = digest(normalized);
  const terminalState = results.every((result) => result.expectationMet) ? "PASSED" : "FAILED";
  const externalCallCount = results.reduce((total, result) => total + result.evaluation.externalCallCount, 0);

  return {
    schemaVersion: "AssuranceRun.v1",
    runId: `run_${evidenceDigest.slice(-16)}`,
    fixtureCorpus: "synthetic-renewal-v1",
    contractDigest,
    executionMode: "OFFLINE_DETERMINISTIC",
    externalCallCount,
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
    if (!verifyJourneyContract(request.contract)) throw new Error("CONTRACT_DIGEST_INVALID");
    return executeSyntheticCorpus(compileSyntheticFixtures(request.contract), { contractDigest: request.contract.contractDigest });
  }
}
