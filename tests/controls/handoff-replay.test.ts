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

  it("does not synthesize human approval or recovery-drill evidence from contract role slots", () => {
    const releaseControl = compileSyntheticFixtures(contract).find((fixture) => fixture.fixtureId === "CV-R10-GOOD")!;
    const data = releaseControl.data as Record<string, unknown>;
    const releaseResult = run.results.find((result) => result.fixture.fixtureId === "CV-R10-GOOD")!;
    expect(data.approverRoleSlots).toEqual(contract.approverRoles);
    expect(data.humanApprovalReceipts).toEqual([]);
    expect(data).not.toHaveProperty("approverIds");
    expect(data).not.toHaveProperty("rollbackDigest");
    expect(releaseResult.evaluation).toMatchObject({ decision: "UNKNOWN", findings: [{ code: "CV_R10_HUMAN_AUTHORITY_REQUIRED" }] });
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
