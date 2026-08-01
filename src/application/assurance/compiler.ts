import type { SyntheticFixture } from "@/domain/assurance";
import { syntheticFixtures } from "@/domain/fixtures";
import type { JourneyContract } from "@/domain/journey-contract";

export function compileSyntheticFixtures(contract: JourneyContract): SyntheticFixture[] {
  return syntheticFixtures.map((fixture) => {
    const compiled = structuredClone(fixture);
    if (compiled.fixtureId === "CV-R1-GOOD") {
      compiled.data = {
        requiredFields: contract.requiredFields,
        previous: { order_id: "string", value: "number", currency: "string" },
        candidate: Object.fromEntries(contract.requiredFields.map((field) => [field, field === "value" ? "number" : "string"])),
        approvedMigration: true,
      };
    }
    if (compiled.fixtureId === "CV-R2-GOOD") {
      compiled.data = { sourceValue: 1099, sourceUnit: "cents", destinationValue: 1099 / contract.conversionDivisor, destinationUnit: "dollars", currency: contract.currency };
    }
    if (compiled.fixtureId === "CV-R5-GOOD") {
      compiled.data = { events: contract.stateSequence.map((type, index) => ({ id: `evt_${index + 1}`, type })) };
    }
    if (compiled.fixtureId === "CV-R10-GOOD") {
      compiled.data = {
        reviewedDigest: contract.contractDigest,
        targetDigest: contract.contractDigest,
        rollbackProcedure: contract.rollbackProcedure,
        approverRoleSlots: contract.approverRoles,
        humanApprovalReceipts: [],
      };
    }
    return compiled;
  });
}
