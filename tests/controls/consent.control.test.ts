import { describe, expect, it } from "vitest";
import { executeSyntheticCorpus } from "@/application/assurance/engine";

describe("critical consent eligibility control", () => {
  const results = new Map(executeSyntheticCorpus().results.map((result) => [result.fixture.fixtureId, result]));

  it("rejects the opted-out bad fixture before any adapter call", () => {
    const bad = results.get("CV-R4-BAD");
    expect(bad?.evaluation.decision).toBe("REJECT");
    expect(bad?.evaluation.findings.map((finding) => finding.code)).toContain("CV_R4_REJECTED");
    expect(bad?.evaluation.externalCallCount).toBe(0);
  });

  it("passes the consented clean control in the same run", () => {
    const good = results.get("CV-R4-GOOD");
    expect(good?.evaluation.decision).toBe("PASS");
    expect(good?.evaluation.externalCallCount).toBe(0);
  });
});
