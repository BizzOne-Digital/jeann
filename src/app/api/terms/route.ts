import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  getCurrentTerms,
  recordTermsAcceptance,
  BUYER_REQUIRED_TERMS_KEYS,
  SUPPLIER_REQUIRED_TERMS_KEYS,
} from "@/lib/terms/service";
import { requireApiAuth } from "@/lib/api/require-api-auth";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import { getClientIp } from "@/lib/api/request-meta";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const portal = request.nextUrl.searchParams.get("portal") ?? "buyer";
  const keys =
    portal === "supplier" ? SUPPLIER_REQUIRED_TERMS_KEYS : BUYER_REQUIRED_TERMS_KEYS;
  const docs = await getCurrentTerms([...keys]);
  return NextResponse.json({
    terms: docs.map((d) => ({
      key: d.key,
      version: d.version,
      title: d.title,
      body: d.body,
      effectiveAt: d.effectiveAt,
      requiresAcceptance: d.requiresAcceptance,
    })),
  });
}

const acceptSchema = z.object({
  termsKey: z.string().trim().min(1),
  termsVersion: z.number().int().min(1),
  organizationId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth();
  if ("error" in auth) return auth.error;

  const parsed = acceptSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid terms acceptance." }, { status: 422 });
  }

  const ip = getClientIp(request);
  const ua = request.headers.get("user-agent");
  const meta = auditRequestMeta(request);

  await recordTermsAcceptance({
    userId: auth.ctx.userId,
    organizationId: parsed.data.organizationId,
    termsKey: parsed.data.termsKey,
    termsVersion: parsed.data.termsVersion,
    ip,
    userAgent: ua ?? undefined,
  });

  await writeAuditEvent({
    action: "terms.accepted",
    targetType: "terms",
    targetId: `${parsed.data.termsKey}:${parsed.data.termsVersion}`,
    actorUserId: auth.ctx.userId,
    organizationId: parsed.data.organizationId,
    ...meta,
  });

  return NextResponse.json({ ok: true });
}
