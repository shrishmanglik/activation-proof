import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/v1/assurance-runs/route";
import { POST as registerContract } from "@/app/api/v1/journey-contracts/route";
import { POST as replayHandoff } from "@/app/api/v1/handoff-bundles/replay/route";
import { defaultJourneyContractInput, sealJourneyContract } from "@/domain/journey-contract";

describe("assurance API boundary", () => {
  it("rejects an undeclared corpus without running an adapter", async () => {
    const response = await POST(new Request("http://localhost/api/v1/assurance-runs", { method: "POST", body: JSON.stringify({ fixtureCorpus: "customer-production" }) }));
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({ error: { code: "FIXTURE_CORPUS_NOT_ALLOWED" } });
  });

  it("returns a typed 400 for malformed JSON", async () => {
    const response = await POST(new Request("http://localhost/api/v1/assurance-runs", { method: "POST", body: "{" }));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toMatchObject({ error: { code: "MALFORMED_JSON" } });
  });

  it("distinguishes a missing sealed contract from an undeclared corpus", async () => {
    const response = await POST(new Request("http://localhost/api/v1/assurance-runs", { method: "POST", body: JSON.stringify({ fixtureCorpus: "synthetic-renewal-v1", contract: {} }) }));
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({ error: { code: "CONTRACT_VALIDATION_FAILED" } });
  });

  it("seals a valid synthetic contract and executes its compiled controls", async () => {
    const contractResponse = await registerContract(new Request("http://localhost/api/v1/journey-contracts", { method: "POST", body: JSON.stringify(defaultJourneyContractInput) }));
    expect(contractResponse.status).toBe(201);
    const { contract } = await contractResponse.json();
    const runResponse = await POST(new Request("http://localhost/api/v1/assurance-runs", { method: "POST", body: JSON.stringify({ fixtureCorpus: "synthetic-renewal-v1", contract }) }));
    expect(runResponse.status).toBe(200);
    const body = await runResponse.json();
    expect(body.run).toMatchObject({ terminalState: "PASSED", contractDigest: contract.contractDigest, externalCallCount: 0 });
    expect(body.handoffBundle.receipts).toHaveLength(24);
  });

  it("rejects a contract whose sealed digest was changed", async () => {
    const contract = sealJourneyContract(defaultJourneyContractInput);
    contract.ownerRole = "changed_owner";
    const response = await POST(new Request("http://localhost/api/v1/assurance-runs", { method: "POST", body: JSON.stringify({ fixtureCorpus: "synthetic-renewal-v1", contract }) }));
    expect(response.status).toBe(422);
    await expect(response.json()).resolves.toMatchObject({ error: { code: "CONTRACT_DIGEST_INVALID" } });
  });

  it("returns a replay receipt for an independently portable handoff", async () => {
    const contract = sealJourneyContract(defaultJourneyContractInput);
    const runResponse = await POST(new Request("http://localhost/api/v1/assurance-runs", { method: "POST", body: JSON.stringify({ fixtureCorpus: "synthetic-renewal-v1", contract }) }));
    const { handoffBundle } = await runResponse.json();
    const replayResponse = await replayHandoff(new Request("http://localhost/api/v1/handoff-bundles/replay", { method: "POST", body: JSON.stringify(handoffBundle) }));
    expect(replayResponse.status).toBe(200);
    await expect(replayResponse.json()).resolves.toMatchObject({ receipt: { decision: "MATCH", reason: "DETERMINISTIC_REPLAY_MATCH" } });
  });
});
