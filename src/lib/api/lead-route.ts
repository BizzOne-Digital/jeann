import { NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { requireBuyerApiSession } from "@/lib/auth/require-buyer-api";
import { saveLead, type LeadKind } from "@/lib/leads/store";
import { persistLeadToMongo } from "@/lib/leads/persist";

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")
  );
}

type LeadRouteOptions = {
  /** Buyer must be signed in (portal forms). */
  requireBuyer?: boolean;
};

export function leadRoute(kind: LeadKind, schema: z.ZodType, options: LeadRouteOptions = {}) {
  return async function POST(request: NextRequest) {
    try {
      if (options.requireBuyer) {
        const auth = await requireBuyerApiSession();
        if ("error" in auth && auth.error) return auth.error;
      }

      const parsed = schema.safeParse(await request.json());
      if (!parsed.success) {
        return NextResponse.json(
          {
            error: "Please correct the highlighted information.",
            issues: parsed.error.flatten(),
          },
          { status: 422 },
        );
      }
      const data = parsed.data as Record<string, unknown>;
      if ("website" in data && data.website) {
        return NextResponse.json({ ok: true }, { status: 202 });
      }

      const ip = clientIp(request);
      const mongoId = await persistLeadToMongo(kind, data, ip);
      const lead = await saveLead(kind, data, ip);

      return NextResponse.json(
        { ok: true, id: mongoId || lead.id },
        { status: 201 },
      );
    } catch (error) {
      console.error("[lead-route]", kind, error);
      return NextResponse.json({ error: "Unable to process this request." }, { status: 400 });
    }
  };
}
