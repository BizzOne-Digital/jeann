import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "finekarts",
    timestamp: new Date().toISOString(),
  });
}
