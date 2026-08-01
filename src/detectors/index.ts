import type { Detector, RequirementId } from "@/domain/assurance";
import { schemaCompatibilityDetector } from "@/detectors/cv-r1.detector";
import { mappingCompletenessDetector } from "@/detectors/cv-r2.detector";
import { identityCollisionDetector } from "@/detectors/cv-r3.detector";
import { consentEligibilityDetector } from "@/detectors/cv-r4.detector";
import { journeyStateDetector } from "@/detectors/cv-r5.detector";
import { migrationParityDetector } from "@/detectors/cv-r6.detector";
import { idempotencyDetector } from "@/detectors/cv-r7.detector";
import { lineageCompletenessDetector } from "@/detectors/cv-r8.detector";
import { detectorCanary } from "@/detectors/cv-r9.detector";
import { releaseAuthorityDetector } from "@/detectors/cv-r10.detector";
import { attributionIntegrityDetector } from "@/detectors/cv-r11.detector";
import { handoffRedactionDetector } from "@/detectors/cv-r12.detector";

export const detectorRegistry: ReadonlyMap<RequirementId, Detector> = new Map([
  schemaCompatibilityDetector,
  mappingCompletenessDetector,
  identityCollisionDetector,
  consentEligibilityDetector,
  journeyStateDetector,
  migrationParityDetector,
  idempotencyDetector,
  lineageCompletenessDetector,
  detectorCanary,
  releaseAuthorityDetector,
  attributionIntegrityDetector,
  handoffRedactionDetector,
].map((detector) => [detector.requirementId, detector]));
