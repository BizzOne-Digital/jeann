import { NextResponse } from "next/server";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { validateProductionEnvironment } from "@/lib/security/production-guards";

export const runtime = "nodejs";

export async function GET() {
  const checks: Record<string, { ok: boolean; message?: string }> = {};

  if (isMongoConfigured()) {
    const connected = await tryConnectMongo();
    checks.database = connected
      ? { ok: true }
      : { ok: false, message: "MongoDB connection failed." };
  } else {
    checks.database = { ok: false, message: "MONGODB_URI not configured." };
  }

  const prodCheck = validateProductionEnvironment();
  if (process.env.NODE_ENV === "production") {
    checks.production_config = {
      ok: prodCheck.ok,
      message: prodCheck.blockers.join("; ") || undefined,
    };
  }

  const allOk = Object.values(checks).every((c) => c.ok);

  return NextResponse.json(
    {
      status: allOk ? "ready" : "degraded",
      checks,
      timestamp: new Date().toISOString(),
    },
    { status: allOk ? 200 : 503 },
  );
}
