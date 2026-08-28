import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getAuthContext } from "@/lib/auth/auth-context";

export const runtime = "nodejs";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const ctx = await getAuthContext(session.userId);
  if (!ctx) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    userId: ctx.userId,
    user: ctx.user,
    memberships: ctx.memberships,
    permissions: ctx.permissions,
    isInternal: ctx.isInternal,
  });
}
