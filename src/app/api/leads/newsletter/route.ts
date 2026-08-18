import { NextResponse } from "next/server";

/** Public newsletter signup removed — buyer enquiries use the signed-in portal. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Public newsletter signup is not available. Sign in to the buyer portal for trade desk contact and updates.",
    },
    { status: 403 },
  );
}
