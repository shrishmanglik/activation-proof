import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const migrationParityDetector: Detector = {
  requirementId: "CV-R6", detectorId: "DET-CV-R6", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { legacy: Record<string, unknown>; target: Record<string, unknown>; approvedDifferences: string[] };
    const changed = Object.keys(data.legacy).filter((key) => data.legacy[key] !== data.target[key] && !data.approvedDifferences.includes(key));
    const findings = changed.map((field) => finding("CV_R6_REJECTED", `Unapproved legacy/target divergence at ${field}.`, "Keep cutover blocked until the journey owner approves equivalence.", field));
    return evaluation("CV-R6", fixture, findings);
  },
};
