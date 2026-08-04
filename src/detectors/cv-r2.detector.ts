import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const mappingCompletenessDetector: Detector = {
  requirementId: "CV-R2", detectorId: "DET-CV-R2", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { sourceValue: number; sourceUnit: string; destinationValue: number; destinationUnit: string; currency: string | null };
    const expected = data.sourceUnit === "cents" && data.destinationUnit === "dollars" ? data.sourceValue / 100 : data.sourceValue;
    const findings = [];
    if (data.destinationValue !== expected) findings.push(finding("CV_R2_REJECTED", `Mapped value ${data.destinationValue} does not equal normalized value ${expected}.`, "Correct and version the semantic mapping.", "destinationValue"));
    if (!data.currency) findings.push(finding("CV_R2_CURRENCY_MISSING", "Currency authority is missing.", "Bind the destination field to an explicit ISO currency.", "currency"));
    return evaluation("CV-R2", fixture, findings);
  },
};
