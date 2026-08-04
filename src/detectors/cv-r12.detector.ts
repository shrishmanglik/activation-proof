import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const handoffRedactionDetector: Detector = {
  requirementId: "CV-R12", detectorId: "DET-CV-R12", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { fields: string[]; exceptions: Array<{ code: string; owner: string | null }>; replaySteps: string[] };
    const restricted = data.fields.filter((field) => ["raw_email", "access_token", "secret", "raw_phone"].includes(field));
    const findings = restricted.map((field) => finding("CV_R12_REJECTED", `Restricted export field ${field} is present.`, "Remove the field and replace it with a one-way token or redacted sample.", field));
    for (const exception of data.exceptions) if (!exception.owner) findings.push(finding("CV_R12_OWNER_MISSING", `Exception ${exception.code} has no owner.`, "Assign an accountable owner before export."));
    if (data.replaySteps.length === 0) findings.push(finding("CV_R12_REPLAY_MISSING", "The handoff has no replay instructions.", "Add deterministic replay and recovery steps."));
    return evaluation("CV-R12", fixture, findings);
  },
};
