import { NextRequest, NextResponse } from "next/server";
import { persistLeadToMongo } from "@/lib/leads/persist";
import { tradeOfferSchema } from "@/lib/validation/forms";

export const runtime = "nodejs";

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")
  );
}

/** Public supplier trade offer intake — creates a lead, not portal access. */
export async function POST(request: NextRequest) {
  try {
    const body = tradeOfferSchema.parse(await request.json());
    const ip = clientIp(request);
    const reference = await persistLeadToMongo(
      "trade-offer",
      {
        contactName: body.contactName,
        email: body.email,
        phone: body.phone,
        companyName: body.companyName,
        productName: body.productName,
        quantity: body.quantity,
        unit: body.unit,
        originCountry: body.originCountry,
        incoterm: body.incoterm,
        packaging: body.packaging,
        notes: body.notes,
      },
      ip,
    );

    if (!reference) {
      return NextResponse.json(
        { error: "Unable to store submission. Database may be unavailable." },
        { status: 503 },
      );
    }

    return NextResponse.json({
      ok: true,
      id: reference,
      message:
        "Your enquiry has been received for staff review. This does not grant supplier portal access.",
    });
  } catch (error) {
    console.error("[trade-offer]", error);
    return NextResponse.json({ error: "Invalid submission." }, { status: 400 });
  }
}
