import type { DetectorEvaluation, DetectorFinding, RequirementId, SyntheticFixture } from "@/domain/assurance";

export function evaluation(
  requirementId: RequirementId,
  fixture: SyntheticFixture,
  findings: DetectorFinding[],
  health: DetectorEvaluation["health"] = "HEALTHY",
): DetectorEvaluation {
  return {
    requirementId,
    detectorId: `DET-${requirementId}`,
    detectorVersion: "1.0.0",
    decision: findings.length > 0 ? "REJECT" : health === "HEALTHY" ? "PASS" : "UNKNOWN",
    health,
    findings,
    externalCallCount: 0,
    outboundAttemptCount: 0,
  };
}

export function finding(code: string, message: string, recovery: string, field?: string): DetectorFinding {
  return { code, message, recovery, ...(field ? { field } : {}) };
}
