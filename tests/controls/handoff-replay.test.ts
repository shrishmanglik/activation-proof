import { describe, expect, it } from "vitest";
import { compileSyntheticFixtures } from "@/application/assurance/compiler";
import { executeSyntheticCorpus } from "@/application/assurance/engine";
import { createHandoffBundle, replayHandoffBundle } from "@/domain/handoff";
import { defaultJourneyContractInput, sealJourneyContract } from "@/domain/journey-contract";

describe("non-builder handoff and replay", () => {
  const contract = sealJourneyContract(defaultJourneyContractInput);
  const run = executeSyntheticCorpus(compileSyntheticFixtures(contract), { contractDigest: contract.contractDigest });
  const bundle = createHandoffBundle(contract, run);

  it("exports every sealed receipt with recovery and replay instructions", () => {
    expect(bundle.receipts).toHaveLength(24);
    expect(bundle.replayInstructions.length).toBeGreaterThanOrEqual(4);
    expect(bundle.recoveryProcedure).toBe(contract.rollbackProcedure);
  });

  it("replays an untampered bundle to the exact run digest", () => {
    expect(replayHandoffBundle(bundle)).toMatchObject({ decision: "MATCH", originalRunDigest: run.evidenceDigest, replayRunDigest: run.evidenceDigest });
  });

  it("rejects a bundle whose embedded contract was changed", () => {
    const tampered = structuredClone(bundle);
    tampered.contract.ownerRole = "different_owner";
    expect(replayHandoffBundle(tampered)).toMatchObject({ decision: "REJECT", reason: "BUNDLE_DIGEST_MISMATCH" });
  });
});
