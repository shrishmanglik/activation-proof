import type { Detector, SyntheticFixture } from "@/domain/assurance";
import { evaluation, finding } from "@/detectors/shared";

export const consentEligibilityDetector: Detector = {
  requirementId: "CV-R4", detectorId: "DET-CV-R4", version: "1.0.0",
  evaluate(fixture: SyntheticFixture) {
    const data = fixture.data as { channel: string; purpose: string; consent: "GRANTED" | "OPTED_OUT" | "UNKNOWN"; adapterRequested: boolean };
    if (process.env.ACTIVATIONPROOF_DISABLE_DETECTOR === "CV-R4") {
      return evaluation("CV-R4", fixture, []);
    }
    const findings = data.consent !== "GRANTED"
      ? [finding("CV_R4_REJECTED", `${data.channel} activation for ${data.purpose} lacks granted consent.`, "Suppress before adapter creation and route to the policy owner.", "consent")]
      : [];
    return evaluation("CV-R4", fixture, findings);
  },
};
