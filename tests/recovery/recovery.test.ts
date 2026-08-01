import { describe, expect, it } from "vitest";
import { executeSyntheticCorpus } from "@/application/assurance/engine";

const results = new Map(executeSyntheticCorpus().results.map((result) => [result.fixture.fixtureId, result]));

describe("recovery and indeterminate-state controls", () => {
  it("blocks blind retry after possible provider commit", () => {
    const result = results.get("CV-R7-BAD");
    expect(result?.evaluation.decision).toBe("REJECT");
    expect(result?.evaluation.findings.map((finding) => finding.code)).toContain("CV_R7_BLIND_RETRY");
  });

  it("blocks sandbox authorization when rollback proof is absent", () => {
    const result = results.get("CV-R10-BAD");
    expect(result?.evaluation.findings.map((finding) => finding.code)).toContain("CV_R10_ROLLBACK_MISSING");
  });

  it("keeps the clean operation bounded to one simulator acknowledgement", () => {
    const result = results.get("CV-R7-GOOD");
    expect(result?.evaluation.decision).toBe("PASS");
    expect(result?.evaluation.externalCallCount).toBe(0);
  });
});
