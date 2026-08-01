import { z } from "zod";
import { digest } from "@/evidence/receipt";

export const journeyContractInputSchema = z.object({
  schemaVersion: z.literal("JourneyContract.v1"),
  dataClass: z.literal("SYNTHETIC"),
  journeyKey: z.string().regex(/^[a-z0-9][a-z0-9-]{2,47}$/),
  sourceSystem: z.string().regex(/^[a-z0-9][a-z0-9-]{2,47}$/),
  destinationSystem: z.string().regex(/^[a-z0-9][a-z0-9-]{2,47}$/),
  ownerRole: z.string().regex(/^[a-z0-9][a-z0-9_-]{2,47}$/),
  requiredFields: z.array(z.enum(["order_id", "value", "currency"])).min(2).refine((fields) => fields.includes("order_id") && fields.includes("value"), "order_id and value are required"),
  currency: z.literal("CAD"),
  conversionDivisor: z.literal(100),
  identityPolicyVersion: z.string().regex(/^identity-v\d+$/),
  consentPolicyVersion: z.string().regex(/^consent-v\d+$/),
  stateSequence: z.tuple([z.literal("subscription_started"), z.literal("renewal_completed")]),
  rollbackProcedure: z.string().min(20).max(240),
  approverRoles: z.tuple([
    z.string().regex(/^[a-z0-9][a-z0-9_-]{2,47}$/),
    z.string().regex(/^[a-z0-9][a-z0-9_-]{2,47}$/),
  ]).refine(([first, second]) => first !== second, "approver roles must be distinct"),
});

export type JourneyContractInput = z.infer<typeof journeyContractInputSchema>;

export interface JourneyContract extends JourneyContractInput {
  version: 1;
  state: "REVIEW_READY";
  contractDigest: string;
  authority: "LOCAL_SYNTHETIC_REVIEW_ONLY";
}

export const journeyContractSchema = journeyContractInputSchema.extend({
  version: z.literal(1),
  state: z.literal("REVIEW_READY"),
  contractDigest: z.string().startsWith("sha256:"),
  authority: z.literal("LOCAL_SYNTHETIC_REVIEW_ONLY"),
});

export const defaultJourneyContractInput: JourneyContractInput = {
  schemaVersion: "JourneyContract.v1",
  dataClass: "SYNTHETIC",
  journeyKey: "renewal-assurance",
  sourceSystem: "fixture-cdp",
  destinationSystem: "lifecycle-simulator",
  ownerRole: "journey_architect",
  requiredFields: ["order_id", "value", "currency"],
  currency: "CAD",
  conversionDivisor: 100,
  identityPolicyVersion: "identity-v1",
  consentPolicyVersion: "consent-v1",
  stateSequence: ["subscription_started", "renewal_completed"],
  rollbackProcedure: "Restore the last accepted contract digest and replay the clean synthetic corpus.",
  approverRoles: ["architecture_reviewer", "privacy_reviewer"],
};

export function sealJourneyContract(input: JourneyContractInput): JourneyContract {
  const parsed = journeyContractInputSchema.parse(input);
  const contractCore = {
    ...parsed,
    version: 1 as const,
    state: "REVIEW_READY" as const,
    authority: "LOCAL_SYNTHETIC_REVIEW_ONLY" as const,
  };
  return { ...contractCore, contractDigest: digest(contractCore) };
}

export function verifyJourneyContract(contract: JourneyContract): boolean {
  const { contractDigest, ...contractCore } = contract;
  return journeyContractSchema.safeParse(contract).success && digest(contractCore) === contractDigest;
}
