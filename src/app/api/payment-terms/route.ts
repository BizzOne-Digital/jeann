import { NextResponse } from "next/server";
import {
  getEnabledPaymentTerms,
  loadPaymentTermsConfig,
} from "@/lib/payment-terms/config";

export const runtime = "nodejs";

export async function GET() {
  const config = await loadPaymentTermsConfig();
  const terms = getEnabledPaymentTerms(config);
  return NextResponse.json({
    terms: terms.map((item) => ({
      id: item.id,
      structure: item.structure,
      iccCode: item.iccCode,
      primaryFunction: item.primaryFunction,
      recommended: Boolean(item.recommended),
      preferred: config.preferredId === item.id,
    })),
    preferredId: config.preferredId,
  });
}
