import { describe, expect, it } from "vitest";
import { POST } from "@/app/api/v1/assurance-runs/route";

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
});
