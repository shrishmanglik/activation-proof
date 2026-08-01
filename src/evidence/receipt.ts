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

export function createReceipt(fixture: SyntheticFixture, evaluation: DetectorEvaluation): EvidenceReceipt {
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
    externalCallCount: 0 as const,
    dataClass: "SYNTHETIC" as const,
  };
  return { ...unsigned, evidenceDigest: digest(unsigned) };
}
