import { NextRequest, NextResponse } from "next/server";
import type { z } from "zod";
import { saveLead, type LeadKind } from "@/lib/leads/store";
import { persistLeadToMongo } from "@/lib/leads/persist";

function clientIp(request: NextRequest) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip")
  );
}

export function leadRoute(kind: LeadKind, schema: z.ZodType) {
  return async function POST(request: NextRequest) {
    try {
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
