import { NextResponse } from "next/server";

/** Public trade-offer intake removed — suppliers onboard via invitation only. */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Supplier enquiries are handled through invitation only. Please contact Finekarts through your trade desk representative.",
    },
    { status: 403 },
  );
}
