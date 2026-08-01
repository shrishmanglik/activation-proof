import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const releaseAuthorityDetector: Detector = {
  requirementId: "CV-R10", detectorId: "DET-CV-R10", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { reviewedDigest: string; targetDigest: string; rollbackDigest: string | null; approverIds: string[] };
    const findings = [];
    if (data.reviewedDigest !== data.targetDigest) findings.push(finding("CV_R10_REJECTED", "The target contract digest differs from the reviewed digest.", "Re-run assurance against the exact target digest.", "targetDigest"));
    if (!data.rollbackDigest) findings.push(finding("CV_R10_ROLLBACK_MISSING", "Rollback proof is absent.", "Complete a recovery drill before sandbox authorization.", "rollbackDigest"));
    if (new Set(data.approverIds).size < 2) findings.push(finding("CV_R10_SEPARATION_MISSING", "Two distinct approvers are required.", "Collect a second independent approval."));
    return evaluation("CV-R10", fixture, findings);
  },
};
