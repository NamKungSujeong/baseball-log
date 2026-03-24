import { NextResponse } from "next/server";

// Health-check endpoint used by the deployment platform.
export async function GET() {
  return NextResponse.json({ ok: true });
}
