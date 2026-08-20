import { NextResponse } from "next/server";
import { destroySession } from "@/lib/auth/session";

export async function POST() {
  try {
    await destroySession();
  } catch (error) {
    console.error("[logout]", error);
  }
  return NextResponse.json({ ok: true });
}
