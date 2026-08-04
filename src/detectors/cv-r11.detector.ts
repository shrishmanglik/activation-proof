import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const attributionIntegrityDetector: Detector = {
  requirementId: "CV-R11", detectorId: "DET-CV-R11", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { campaignState: string; conversionAgeDays: number; approvedWindowDays: number; source: string | null };
    const findings = [];
    if (data.campaignState !== "ACTIVE") findings.push(finding("CV_R11_REJECTED", "The campaign is not active at conversion time.", "Exclude the conversion and resolve campaign authority."));
    if (data.conversionAgeDays > data.approvedWindowDays) findings.push(finding("CV_R11_WINDOW_EXCEEDED", "The conversion is outside the approved attribution window.", "Recalculate with the versioned window rule."));
    if (!data.source) findings.push(finding("CV_R11_SOURCE_UNKNOWN", "Attribution source is unknown.", "Retain UNKNOWN until a source receipt exists."));
    return evaluation("CV-R11", fixture, findings);
  },
};
