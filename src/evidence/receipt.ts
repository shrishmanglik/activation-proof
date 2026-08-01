import { createHash } from "node:crypto";
import type { DetectorEvaluation, EvidenceReceipt, SyntheticFixture } from "@/domain/assurance";

function canonicalize(value: unknown): string {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const entries = Object.entries(value as Record<string, unknown>)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, entry]) => `${JSON.stringify(key)}:${canonicalize(entry)}`);
  return `{${entries.join(",")}}`;
}

export function digest(value: unknown): string {
  return `sha256:${createHash("sha256").update(canonicalize(value)).digest("hex")}`;
}

export function createReceipt(fixture: SyntheticFixture, evaluation: DetectorEvaluation, contractDigest: string): EvidenceReceipt {
  if (evaluation.outboundAttemptCount !== 0 || evaluation.externalCallCount !== 0) throw new Error("RECEIPT_SEAL_BLOCKED_BY_OUTBOUND_ACTIVITY");
  const normalizedTrace = evaluation.findings
    .map(({ code, field = null, message, recovery }) => ({ code, field, message, recovery }))
    .sort((left, right) => `${left.code}:${left.field}`.localeCompare(`${right.code}:${right.field}`));
  const unsigned = {
    schemaVersion: "DecisionReceipt.v1" as const,
    fixtureId: fixture.fixtureId,
    requirementId: fixture.requirementId,
    detectorId: evaluation.detectorId,
    detectorVersion: evaluation.detectorVersion,
    controlKind: fixture.controlKind,
    decision: evaluation.decision,
    detectorHealth: evaluation.health,
    issueCodes: evaluation.findings.map((finding) => finding.code).sort(),
    findingCount: evaluation.findings.length,
    fixtureInputDigest: digest(fixture.data),
    scenarioDigest: digest(fixture.scenario),
    decisionTraceDigest: digest(normalizedTrace),
    contractDigest,
    externalCallCount: evaluation.externalCallCount,
    outboundAttemptCount: evaluation.outboundAttemptCount,
    dataClass: "SYNTHETIC" as const,
  };
  return { ...unsigned, evidenceDigest: digest(unsigned) };
}
