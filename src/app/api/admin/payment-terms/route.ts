import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApiSession } from "@/lib/admin/require-admin-api";
import {
  loadPaymentTermsConfig,
  mergePaymentTermsWithConfig,
  savePaymentTermsConfig,
} from "@/lib/payment-terms/config";
import { PAYMENT_TERM_STRUCTURES } from "@/lib/content/payment-terms";

export const runtime = "nodejs";

const updateSchema = z.object({
  enabledIds: z.array(z.string()).min(1),
  preferredId: z.string().nullable(),
});

export async function GET() {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const config = await loadPaymentTermsConfig();
  return NextResponse.json({
    config,
    terms: mergePaymentTermsWithConfig(config),
  });
}

export async function PUT(request: NextRequest) {
  if (!(await requireAdminApiSession())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 422 });
  }

  const validIds = new Set(PAYMENT_TERM_STRUCTURES.map((item) => item.id));
  const enabledIds = parsed.data.enabledIds.filter((id) => validIds.has(id));
  if (!enabledIds.length) {
    return NextResponse.json({ error: "At least one payment term must be enabled." }, { status: 422 });
  }

  const preferredId =
    parsed.data.preferredId && validIds.has(parsed.data.preferredId)
      ? parsed.data.preferredId
      : null;

  if (preferredId && !enabledIds.includes(preferredId)) {
    return NextResponse.json(
      { error: "Preferred payment term must be enabled." },
      { status: 422 },
    );
  }

  const config = await savePaymentTermsConfig({ enabledIds, preferredId });
  return NextResponse.json({
    ok: true,
    config,
    terms: mergePaymentTermsWithConfig(config),
  });
}
