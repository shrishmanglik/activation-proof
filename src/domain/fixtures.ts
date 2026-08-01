import type { SyntheticFixture } from "@/domain/assurance";

export const syntheticFixtures: SyntheticFixture[] = [
  {
    fixtureId: "CV-R1-BAD", requirementId: "CV-R1", detectorId: "DET-CV-R1", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "A purchase event removes order_id and changes value from number to string without an approved migration.",
    data: { requiredFields: ["order_id", "value"], previous: { order_id: "string", value: "number" }, candidate: { value: "string" }, approvedMigration: false },
  },
  {
    fixtureId: "CV-R1-GOOD", requirementId: "CV-R1", detectorId: "DET-CV-R1", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "A compatible event preserves required fields and adds an optional campaign code.",
    data: { requiredFields: ["order_id", "value"], previous: { order_id: "string", value: "number" }, candidate: { order_id: "string", value: "number", campaign_code: "string?" }, approvedMigration: true },
  },
  {
    fixtureId: "CV-R2-BAD", requirementId: "CV-R2", detectorId: "DET-CV-R2", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "The source emits 1099 cents while the destination treats it as 1099 dollars and omits currency.",
    data: { sourceValue: 1099, sourceUnit: "cents", destinationValue: 1099, destinationUnit: "dollars", currency: null },
  },
  {
    fixtureId: "CV-R2-GOOD", requirementId: "CV-R2", detectorId: "DET-CV-R2", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "The approved mapping converts 1099 cents to 10.99 CAD.",
    data: { sourceValue: 1099, sourceUnit: "cents", destinationValue: 10.99, destinationUnit: "dollars", currency: "CAD" },
  },
  {
    fixtureId: "CV-R3-BAD", requirementId: "CV-R3", detectorId: "DET-CV-R3", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "Two distinct customers share a household email without an approved merge key.",
    data: { customerIds: ["cust_synth_101", "cust_synth_202"], sharedEmailToken: "email_hash_household", approvedMergeKey: null },
  },
  {
    fixtureId: "CV-R3-GOOD", requirementId: "CV-R3", detectorId: "DET-CV-R3", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "One stable customer carries an approved alias and consented email token.",
    data: { customerIds: ["cust_synth_101"], sharedEmailToken: "email_hash_primary", approvedMergeKey: "subject_key_synth_101" },
  },
  {
    fixtureId: "CV-R4-BAD", requirementId: "CV-R4", detectorId: "DET-CV-R4", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "A globally opted-out profile is included in an email activation segment.",
    data: { subjectToken: "subject_hash_opted_out", channel: "email", purpose: "renewal", consent: "OPTED_OUT", adapterRequested: true },
  },
  {
    fixtureId: "CV-R4-GOOD", requirementId: "CV-R4", detectorId: "DET-CV-R4", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "A consented synthetic profile meets the channel and purpose policy.",
    data: { subjectToken: "subject_hash_consented", channel: "email", purpose: "renewal", consent: "GRANTED", adapterRequested: true },
  },
  {
    fixtureId: "CV-R5-BAD", requirementId: "CV-R5", detectorId: "DET-CV-R5", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "renewal_completed arrives before subscription_started and is replayed twice.",
    data: { events: [{ id: "evt_2", type: "renewal_completed" }, { id: "evt_2", type: "renewal_completed" }] },
  },
  {
    fixtureId: "CV-R5-GOOD", requirementId: "CV-R5", detectorId: "DET-CV-R5", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "subscription_started then renewal_completed arrives with stable unique event IDs.",
    data: { events: [{ id: "evt_1", type: "subscription_started" }, { id: "evt_2", type: "renewal_completed" }] },
  },
  {
    fixtureId: "CV-R6-BAD", requirementId: "CV-R6", detectorId: "DET-CV-R6", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "The target excludes a valid renewal segment and changes channel priority.",
    data: { legacy: { eligible: true, channel: "push" }, target: { eligible: false, channel: "email" }, approvedDifferences: [] },
  },
  {
    fixtureId: "CV-R6-GOOD", requirementId: "CV-R6", detectorId: "DET-CV-R6", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "Legacy and target produce approved equivalent eligibility and channel priority.",
    data: { legacy: { eligible: true, channel: "push" }, target: { eligible: true, channel: "push" }, approvedDifferences: [] },
  },
  {
    fixtureId: "CV-R7-BAD", requirementId: "CV-R7", detectorId: "DET-CV-R7", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "A duplicate request follows a timeout after possible provider commit without an operation key.",
    data: { operationKey: null, deliveryCount: 2, providerState: "INDETERMINATE", retryRequested: true },
  },
  {
    fixtureId: "CV-R7-GOOD", requirementId: "CV-R7", detectorId: "DET-CV-R7", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "A unique sandbox activation returns one authoritative acknowledgement.",
    data: { operationKey: "op_synth_renewal_001", deliveryCount: 1, providerState: "ACKNOWLEDGED", retryRequested: false },
  },
  {
    fixtureId: "CV-R8-BAD", requirementId: "CV-R8", detectorId: "DET-CV-R8", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "The destination accepts a record but the transformation has no correlation ID.",
    data: { requiredHops: ["source", "transform", "policy", "adapter", "ack"], observedHops: ["source", "policy", "adapter", "ack"], correlationId: null },
  },
  {
    fixtureId: "CV-R8-GOOD", requirementId: "CV-R8", detectorId: "DET-CV-R8", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "One stable correlation ID links every source-to-acknowledgement hop.",
    data: { requiredHops: ["source", "transform", "policy", "adapter", "ack"], observedHops: ["source", "transform", "policy", "adapter", "ack"], correlationId: "corr_synth_001" },
  },
  {
    fixtureId: "CV-R9-BAD", requirementId: "CV-R9", detectorId: "DET-CV-R9", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "The anomaly query returns zero while a seeded invalid-consent canary is present.",
    data: { canarySeeded: true, detectorMatchCount: 0, cleanCorpusMatchCount: null },
  },
  {
    fixtureId: "CV-R9-GOOD", requirementId: "CV-R9", detectorId: "DET-CV-R9", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "The detector finds the seeded record, then finds zero in the clean corpus.",
    data: { canarySeeded: true, detectorMatchCount: 1, cleanCorpusMatchCount: 0 },
  },
  {
    fixtureId: "CV-R10-BAD", requirementId: "CV-R10", detectorId: "DET-CV-R10", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "Tests pass but the contract digest drifted and rollback proof is absent.",
    data: { reviewedDigest: "sha256:reviewed", targetDigest: "sha256:changed", rollbackDigest: null, approverIds: ["reviewer_a"] },
  },
  {
    fixtureId: "CV-R10-GOOD", requirementId: "CV-R10", detectorId: "DET-CV-R10", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "Exact reviewed digests, two approvers, and rollback proof are present for sandbox authority.",
    data: { reviewedDigest: "sha256:reviewed", targetDigest: "sha256:reviewed", rollbackDigest: "sha256:rollback", approverIds: ["reviewer_a", "reviewer_b"] },
  },
  {
    fixtureId: "CV-R11-BAD", requirementId: "CV-R11", detectorId: "DET-CV-R11", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "A conversion uses a retired campaign outside the approved attribution window.",
    data: { campaignState: "RETIRED", conversionAgeDays: 42, approvedWindowDays: 30, source: "synthetic_campaign" },
  },
  {
    fixtureId: "CV-R11-GOOD", requirementId: "CV-R11", detectorId: "DET-CV-R11", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "A conversion links to an active campaign within the approved window.",
    data: { campaignState: "ACTIVE", conversionAgeDays: 7, approvedWindowDays: 30, source: "synthetic_campaign" },
  },
  {
    fixtureId: "CV-R12-BAD", requirementId: "CV-R12", detectorId: "DET-CV-R12", controlKind: "NEGATIVE", expectedDecision: "REJECT", classification: "SYNTHETIC",
    scenario: "The evidence pack contains raw email, an access token, and an ownerless exception.",
    data: { fields: ["raw_email", "access_token", "contract_digest"], exceptions: [{ code: "UNRESOLVED_MAPPING", owner: null }], replaySteps: [] },
  },
  {
    fixtureId: "CV-R12-GOOD", requirementId: "CV-R12", detectorId: "DET-CV-R12", controlKind: "POSITIVE", expectedDecision: "PASS", classification: "SYNTHETIC",
    scenario: "The evidence pack contains hashes, redacted samples, owners, and recovery steps.",
    data: { fields: ["email_hash", "redacted_sample", "contract_digest"], exceptions: [{ code: "ACCEPTED_LIMIT", owner: "journey_owner" }], replaySteps: ["verify digest", "run clean corpus", "inspect receipt"] },
  },
];
