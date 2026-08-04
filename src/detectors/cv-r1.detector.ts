import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const schemaCompatibilityDetector: Detector = {
  requirementId: "CV-R1", detectorId: "DET-CV-R1", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { requiredFields: string[]; previous: Record<string, string>; candidate: Record<string, string>; approvedMigration: boolean };
    const findings = data.requiredFields.flatMap((field) => {
      if (!(field in data.candidate)) return [finding("CV_R1_REJECTED", `Required field ${field} is missing.`, "Restore the field or approve a versioned migration.", field)];
      if (data.previous[field] !== data.candidate[field]) return [finding("CV_R1_REJECTED", `Field ${field} changed type.`, "Publish a breaking contract version with dual-read migration.", field)];
      return [];
    });
    if (!data.approvedMigration && findings.length > 0) findings.push(finding("CV_R1_MIGRATION_UNAPPROVED", "Breaking drift has no approved migration.", "Hold promotion at the last accepted digest."));
    return evaluation("CV-R1", fixture, findings);
  },
};
