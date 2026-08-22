import { NextRequest, NextResponse } from "next/server";
import { requireBuyerApiSession } from "@/lib/auth/require-buyer-api";
import { getPaymentTermById } from "@/lib/content/payment-terms";
import { formatProductLabel } from "@/lib/content/edible-oils";
import { loadPaymentTermsConfig } from "@/lib/payment-terms/config";
import { persistLeadToMongo } from "@/lib/leads/persist";
import { saveLead } from "@/lib/leads/store";
import { edibleOilOrderSchema } from "@/lib/validation/forms";

export const runtime = "nodejs";

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")
  );
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireBuyerApiSession();
    if ("error" in auth && auth.error) return auth.error;

    const parsed = edibleOilOrderSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please correct the highlighted information.",
          issues: parsed.error.flatten(),
        },
        { status: 422 },
      );
    }

    const data = parsed.data;
    const config = await loadPaymentTermsConfig();
    if (!config.enabledIds.includes(data.paymentTermId)) {
      return NextResponse.json(
        { error: "Selected payment term is not available. Please choose another option." },
        { status: 422 },
      );
    }

    const term = getPaymentTermById(data.paymentTermId);
    if (!term || term.iccCode !== data.iccCode) {
      return NextResponse.json({ error: "Invalid payment term selection." }, { status: 422 });
    }

    const productName = formatProductLabel(data.productSlug, data.productGrade);
    const payload = {
      ...data,
      productName,
      paymentPreference: term.structure,
      quantity: String(data.quantityMt),
      unit: "MT",
      frequency: `${data.contractYears} year contract — ${data.deliveryCount} monthly deliveries`,
      specification: [
        `Product: ${productName}`,
        `Monthly volume: ${data.quantityMt} MT`,
        `Price per MT: USD ${data.pricePerMt}`,
        `Monthly delivery total: USD ${data.monthlyDeliveryTotal}`,
        `Contract total: USD ${data.contractTotal}`,
        `Payment: ${term.structure} (${term.iccCode})`,
      ].join("\n"),
    };

    const ip = clientIp(request);
    const mongoId = await persistLeadToMongo("purchase-request", payload, ip);
    const lead = await saveLead("purchase-request", payload, ip);

    return NextResponse.json({ ok: true, id: mongoId || lead.id }, { status: 201 });
  } catch (error) {
    console.error("[edible-oil-order]", error);
    return NextResponse.json({ error: "Unable to process this request." }, { status: 400 });
  }
}
