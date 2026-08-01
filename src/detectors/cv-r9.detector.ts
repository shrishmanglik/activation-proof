import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const detectorCanary: Detector = {
  requirementId: "CV-R9", detectorId: "DET-CV-R9", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { canarySeeded: boolean; detectorMatchCount: number; cleanCorpusMatchCount: number | null };
    const findings = [];
    if (!data.canarySeeded || data.detectorMatchCount < 1) findings.push(finding("CV_R9_REJECTED", "The detector did not find its known-positive canary.", "Classify the detector UNHEALTHY and repair it before trusting a clean result."));
    if (data.cleanCorpusMatchCount !== null && data.cleanCorpusMatchCount !== 0) findings.push(finding("CV_R9_FALSE_POSITIVE", "The clean corpus still contains detector matches.", "Inspect the exact matches before making a clean-state claim."));
    return evaluation("CV-R9", fixture, findings, findings.some((item) => item.code === "CV_R9_REJECTED") ? "UNHEALTHY" : "HEALTHY");
  },
};
