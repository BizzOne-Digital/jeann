import { NextResponse } from "next/server";
import { integrationStatus } from "@/lib/config/env";

export function GET() {
  return NextResponse.json({ ok: true, service: "finekarts", integrations: integrationStatus() });
}
