import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const journeyStateDetector: Detector = {
  requirementId: "CV-R5", detectorId: "DET-CV-R5", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { events: Array<{ id: string; type: string }> };
    const ids = new Set(data.events.map((event) => event.id));
    const sequence = data.events.map((event) => event.type).join(">");
    const findings = [];
    if (ids.size !== data.events.length) findings.push(finding("CV_R5_DUPLICATE_EVENT", "Duplicate event identity would repeat a logical transition.", "Quarantine the replay and preserve the idempotency receipt."));
    if (sequence !== "subscription_started>renewal_completed") findings.push(finding("CV_R5_REJECTED", `Journey order ${sequence} violates the approved state machine.`, "Restore the prior state and replay the canonical sequence."));
    return evaluation("CV-R5", fixture, findings);
  },
};
