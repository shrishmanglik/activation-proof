import { NextResponse } from "next/server";
import type { HandoffBundle } from "@/domain/handoff";
import { replayHandoffBundle } from "@/domain/handoff";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: { code: "MALFORMED_JSON" } }, { status: 400 });
  }
  if (!body || typeof body !== "object" || (body as { schemaVersion?: unknown }).schemaVersion !== "HandoffBundle.v1") {
    return NextResponse.json({ error: { code: "HANDOFF_BUNDLE_INVALID" } }, { status: 422 });
  }
  try {
    const receipt = replayHandoffBundle(body as HandoffBundle);
    return NextResponse.json({ receipt }, { status: receipt.decision === "MATCH" ? 200 : 409 });
  } catch {
    return NextResponse.json({ error: { code: "HANDOFF_BUNDLE_INVALID" } }, { status: 422 });
  }
}
