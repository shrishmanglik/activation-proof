import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const releaseAuthorityDetector: Detector = {
  requirementId: "CV-R10", detectorId: "DET-CV-R10", version: "1.1.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { reviewedDigest: string; targetDigest: string; rollbackProcedure: string | null; approverRoleSlots: string[]; humanApprovalReceipts: unknown[] };
    const findings = [];
    if (data.reviewedDigest !== data.targetDigest) findings.push(finding("CV_R10_REJECTED", "The target contract digest differs from the reviewed digest.", "Re-run assurance against the exact target digest.", "targetDigest"));
    if (!data.rollbackProcedure) findings.push(finding("CV_R10_ROLLBACK_MISSING", "A rollback procedure is absent.", "Declare recovery before requesting any human authorization.", "rollbackProcedure"));
    if (new Set(data.approverRoleSlots).size < 2) findings.push(finding("CV_R10_SEPARATION_MISSING", "Two distinct review role slots are required.", "Assign separate review roles without treating role names as approvals."));
    if (findings.length > 0) return evaluation("CV-R10", fixture, findings);
    const authorityRequired = finding("CV_R10_HUMAN_AUTHORITY_REQUIRED", "Deterministic prerequisites do not create human release authority.", "Collect separately authenticated approval and recovery-drill receipts outside this local product.");
    return { ...evaluation("CV-R10", fixture, [authorityRequired]), decision: "UNKNOWN" };
  },
};
