import { NextResponse } from "next/server";
import { journeyContractInputSchema, sealJourneyContract } from "@/domain/journey-contract";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const requestId = request.headers.get("x-request-id") ?? crypto.randomUUID();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: { code: "MALFORMED_JSON", requestId } }, { status: 400 });
  }
  const parsed = journeyContractInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "CONTRACT_VALIDATION_FAILED", requestId, issues: parsed.error.issues.map(({ path, code }) => ({ path: path.join("."), code })) } }, { status: 422 });
  }
  return NextResponse.json({ requestId, contract: sealJourneyContract(parsed.data) }, { status: 201 });
}
