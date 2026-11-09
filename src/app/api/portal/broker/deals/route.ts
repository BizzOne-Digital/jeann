import { NextRequest } from "next/server";
import { listIntermediaryDeals, submitIntermediaryDeal } from "@/lib/portal/intermediary-deals";

export const runtime = "nodejs";

export async function GET() {
  return listIntermediaryDeals("broker");
}

export async function POST(request: NextRequest) {
  return submitIntermediaryDeal(request, "broker");
}
