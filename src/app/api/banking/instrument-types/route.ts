import { NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";

export const runtime = "nodejs";

const DEFAULT_TYPES = [
  {
    code: "irrevocable_documentary_lc_sight",
    name: "Irrevocable Documentary LC at Sight",
    buyerSideAvailable: true,
    supplierSideAvailable: true,
  },
  {
    code: "deferred_payment_lc",
    name: "Deferred Payment Documentary LC",
    buyerSideAvailable: true,
    supplierSideAvailable: true,
  },
  {
    code: "confirmed_documentary_lc",
    name: "Confirmed Documentary LC",
    buyerSideAvailable: true,
    supplierSideAvailable: true,
  },
  {
    code: "standby_lc",
    name: "Standby Letter of Credit",
    buyerSideAvailable: true,
    supplierSideAvailable: true,
  },
];

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:read" });
    if ("error" in auth) return auth.error;

    const { BankingInstrumentType } = await import("@/models");
    const items = await BankingInstrumentType.find({ active: true }).lean();
    if (items.length === 0) {
      return NextResponse.json({ items: DEFAULT_TYPES });
    }
    return NextResponse.json({ items });
  } catch (error) {
    return handleApiError(error);
  }
}
