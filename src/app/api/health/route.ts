import { NextResponse } from "next/server";
import { getSessionConfigError } from "@/lib/auth/session-config";
import { integrationStatus } from "@/lib/config/env";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export async function GET() {
  const integrations = integrationStatus();
  let databaseReady = false;

  if (isMongoConfigured()) {
    try {
      databaseReady = Boolean(await tryConnectMongo());
    } catch {
      databaseReady = false;
    }
  }

  return NextResponse.json({
    ok: true,
    service: "finekarts",
    integrations: {
      ...integrations,
      databaseReady,
      sessionReady: !getSessionConfigError(),
    },
  });
}
