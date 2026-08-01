import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const idempotencyDetector: Detector = {
  requirementId: "CV-R7", detectorId: "DET-CV-R7", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { operationKey: string | null; deliveryCount: number; providerState: string; retryRequested: boolean };
    const findings = [];
    if (!data.operationKey) findings.push(finding("CV_R7_REJECTED", "The logical effect has no stable operation key.", "Assign one key before any sandbox adapter action.", "operationKey"));
    if (data.deliveryCount > 1) findings.push(finding("CV_R7_DUPLICATE_EFFECT", "More than one delivery was observed for one logical operation.", "Freeze retries and reconcile by operation key."));
    if (data.providerState === "INDETERMINATE" && data.retryRequested) findings.push(finding("CV_R7_BLIND_RETRY", "A blind retry was requested after possible provider commit.", "Query provider state; retain INDETERMINATE until authoritative evidence exists."));
    return evaluation("CV-R7", fixture, findings);
  },
};
