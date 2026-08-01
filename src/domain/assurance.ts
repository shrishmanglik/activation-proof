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
  externalCallCount: number;
  outboundAttemptCount: number;
}

export interface OutboundCapability {
  readonly attemptCount: number;
  readonly successfulCallCount: number;
  request(operation: string): never;
}

export interface EvaluationContext {
  outbound: OutboundCapability;
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
  fixtureInputDigest: string;
  scenarioDigest: string;
  decisionTraceDigest: string;
  contractDigest: string;
  externalCallCount: number;
  outboundAttemptCount: number;
  dataClass: "SYNTHETIC";
  evidenceDigest: string;
}

export interface ControlResult {
  fixture: SyntheticFixture;
  evaluation: DetectorEvaluation;
  receipt: EvidenceReceipt | null;
  expectationMet: boolean;
  outboundAttemptCount: number;
}

export interface AssuranceRun {
  schemaVersion: "AssuranceRun.v1";
  runId: string;
  fixtureCorpus: "synthetic-renewal-v1";
  contractDigest: string;
  executionMode: "OFFLINE_DETERMINISTIC";
  externalCallCount: number;
  terminalState: "PASSED" | "FAILED";
  results: ControlResult[];
  evidenceDigest: string;
  nextAction: string;
}

export interface Detector {
  requirementId: RequirementId;
  detectorId: `DET-${RequirementId}`;
  version: string;
  evaluate(fixture: SyntheticFixture, context: EvaluationContext): DetectorEvaluation;
}
