import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const lineageCompletenessDetector: Detector = {
  requirementId: "CV-R8", detectorId: "DET-CV-R8", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { requiredHops: string[]; observedHops: string[]; correlationId: string | null };
    const missing = data.requiredHops.filter((hop) => !data.observedHops.includes(hop));
    const findings = missing.map((hop) => finding("CV_R8_REJECTED", `Lineage hop ${hop} is missing.`, "Restore the hop collector and rerun from the source snapshot.", hop));
    if (!data.correlationId) findings.push(finding("CV_R8_CORRELATION_MISSING", "No stable correlation ID closes the evidence graph.", "Bind every hop to one synthetic journey correlation ID."));
    return evaluation("CV-R8", fixture, findings);
  },
};
