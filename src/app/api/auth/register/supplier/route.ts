import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Supplier self-registration is not permitted in Phase 2. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Supplier accounts must be created through an administrator invitation. Contact Finekarts to request access.",
    },
    { status: 403 },
  );
}

export async function GET() {
  return NextResponse.json({ allowed: false }, { status: 403 });
}
