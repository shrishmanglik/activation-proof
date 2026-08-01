import { NextResponse } from "next/server";
import { z } from "zod";
import { DeterministicAssuranceService } from "@/application/assurance/engine";

export const runtime = "nodejs";

const requestSchema = z.object({
  fixtureCorpus: z.literal("synthetic-renewal-v1"),
});

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

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: { code: "FIXTURE_CORPUS_NOT_ALLOWED", message: "Only the repository-owned synthetic corpus is allowed.", requestId } },
      { status: 422 },
    );
  }

  try {
    const run = await service.run(parsed.data);
    return NextResponse.json({ requestId, run }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: { code: "ASSURANCE_RUN_FAILED", message: "The deterministic run did not complete; no external action occurred.", requestId } },
      { status: 500 },
    );
  }
}
