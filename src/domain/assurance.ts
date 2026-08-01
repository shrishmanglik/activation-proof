export const requirementIds = [
  "CV-R1",
  "CV-R2",
  "CV-R3",
  "CV-R4",
  "CV-R5",
  "CV-R6",
  "CV-R7",
  "CV-R8",
  "CV-R9",
  "CV-R10",
  "CV-R11",
  "CV-R12",
] as const;

export type RequirementId = (typeof requirementIds)[number];
export type Decision = "PASS" | "REJECT" | "UNKNOWN";
export type DetectorHealth = "HEALTHY" | "UNHEALTHY" | "UNKNOWN";
export type ControlKind = "NEGATIVE" | "POSITIVE";

export interface SyntheticFixture<TData = unknown> {
  fixtureId: `${RequirementId}-${"BAD" | "GOOD"}`;
  requirementId: RequirementId;
  detectorId: `DET-${RequirementId}`;
  controlKind: ControlKind;
  scenario: string;
  expectedDecision: Exclude<Decision, "UNKNOWN">;
  data: TData;
  classification: "SYNTHETIC";
}

export interface DetectorFinding {
  code: string;
  message: string;
  field?: string;
  recovery: string;
}

export interface DetectorEvaluation {
  requirementId: RequirementId;
  detectorId: `DET-${RequirementId}`;
  detectorVersion: string;
  decision: Decision;
  health: DetectorHealth;
  findings: DetectorFinding[];
  externalCallCount: 0;
}

export interface EvidenceReceipt {
  schemaVersion: "DecisionReceipt.v1";
  fixtureId: SyntheticFixture["fixtureId"];
  requirementId: RequirementId;
  detectorId: `DET-${RequirementId}`;
  detectorVersion: string;
  controlKind: ControlKind;
  decision: Decision;
  detectorHealth: DetectorHealth;
  issueCodes: string[];
  findingCount: number;
  externalCallCount: 0;
  dataClass: "SYNTHETIC";
  evidenceDigest: string;
}

export interface ControlResult {
  fixture: SyntheticFixture;
  evaluation: DetectorEvaluation;
  receipt: EvidenceReceipt;
  expectationMet: boolean;
}

export interface AssuranceRun {
  schemaVersion: "AssuranceRun.v1";
  runId: string;
  fixtureCorpus: "synthetic-renewal-v1";
  executionMode: "OFFLINE_DETERMINISTIC";
  externalCallCount: 0;
  terminalState: "PASSED" | "FAILED";
  results: ControlResult[];
  evidenceDigest: string;
  nextAction: string;
}

export interface Detector {
  requirementId: RequirementId;
  detectorId: `DET-${RequirementId}`;
  version: string;
  evaluate(fixture: SyntheticFixture): DetectorEvaluation;
}
