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

const canonicalDetectorRegistry = new Map<RequirementId, Detector>([
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
].map((detector) => {
  Object.freeze(detector);
  return [detector.requirementId, detector] as const;
}));

export function getCanonicalDetector(requirementId: RequirementId): Detector | undefined {
  return canonicalDetectorRegistry.get(requirementId);
}

export const detectorRegistry: ReadonlyMap<RequirementId, Detector> = Object.freeze({
  get size() { return canonicalDetectorRegistry.size; },
  get: (key: RequirementId) => canonicalDetectorRegistry.get(key),
  has: (key: RequirementId) => canonicalDetectorRegistry.has(key),
  entries: () => canonicalDetectorRegistry.entries(),
  keys: () => canonicalDetectorRegistry.keys(),
  values: () => canonicalDetectorRegistry.values(),
  [Symbol.iterator]: () => canonicalDetectorRegistry[Symbol.iterator](),
  forEach(callback: (value: Detector, key: RequirementId, map: ReadonlyMap<RequirementId, Detector>) => void, thisArg?: unknown) {
    canonicalDetectorRegistry.forEach((value, key) => callback.call(thisArg, value, key, detectorRegistry));
  },
});
