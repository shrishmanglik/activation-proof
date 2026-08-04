import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const identityCollisionDetector: Detector = {
  requirementId: "CV-R3", detectorId: "DET-CV-R3", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { customerIds: string[]; approvedMergeKey: string | null };
    const findings = data.customerIds.length > 1 && !data.approvedMergeKey
      ? [finding("CV_R3_REJECTED", "Shared contact token spans distinct customers without an approved subject key.", "Keep profiles separate and route the collision to the identity owner.")]
      : [];
    return evaluation("CV-R3", fixture, findings);
  },
};
