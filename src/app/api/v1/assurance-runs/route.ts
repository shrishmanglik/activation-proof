import { NextResponse } from "next/server";
import { z } from "zod";
import { DeterministicAssuranceService } from "@/application/assurance/engine";
import { journeyContractSchema } from "@/domain/journey-contract";
import { createHandoffBundle } from "@/domain/handoff";

export const runtime = "nodejs";

const service = new DeterministicAssuranceService();

export async function POST(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: { code: "MALFORMED_JSON", message: "Request body must be valid JSON.", requestId } },
      { status: 400 },
    );
  }

  const envelope = z.object({ fixtureCorpus: z.unknown(), contract: z.unknown() }).safeParse(body);
  if (!envelope.success || envelope.data.fixtureCorpus !== "synthetic-renewal-v1") {
    return NextResponse.json(
      { error: { code: "FIXTURE_CORPUS_NOT_ALLOWED", message: "Only the repository-owned synthetic corpus is allowed.", requestId } },
      { status: 422 },
    );
  }
  const contract = journeyContractSchema.safeParse(envelope.data.contract);
  if (!contract.success) {
    return NextResponse.json(
      { error: { code: "CONTRACT_VALIDATION_FAILED", message: "A complete sealed synthetic contract is required.", requestId } },
      { status: 422 },
    );
  }

  try {
    const run = await service.run({ fixtureCorpus: "synthetic-renewal-v1", contract: contract.data });
    const handoffBundle = run.terminalState === "PASSED" ? createHandoffBundle(contract.data, run) : null;
    return NextResponse.json({ requestId, run, handoffBundle }, { status: 200 });
  } catch (caught) {
    if (caught instanceof Error && caught.message === "CONTRACT_DIGEST_INVALID") {
      return NextResponse.json(
        { error: { code: "CONTRACT_DIGEST_INVALID", message: "The contract changed after sealing; re-register the exact input.", requestId } },
        { status: 422 },
      );
    }
    return NextResponse.json(
      { error: { code: "ASSURANCE_RUN_FAILED", message: "The deterministic run did not complete; no external action occurred.", requestId } },
      { status: 500 },
    );
  }
}
