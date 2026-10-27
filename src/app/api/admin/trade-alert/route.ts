import { NextRequest, NextResponse } from "next/server";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import {
  getTradeAlert,
  sanitizeTradeAlert,
  saveTradeAlert,
} from "@/lib/content/trade-alert-store";

export const runtime = "nodejs";

export async function GET() {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ tradeAlert: await getTradeAlert() });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const data = sanitizeTradeAlert(body);
  if (!data) return NextResponse.json({ error: "Invalid input." }, { status: 422 });

  if (!(await saveTradeAlert(data))) {
    return NextResponse.json({ error: "Unable to save. Check MongoDB connection." }, { status: 503 });
  }
  return NextResponse.json({ ok: true, tradeAlert: data });
}
