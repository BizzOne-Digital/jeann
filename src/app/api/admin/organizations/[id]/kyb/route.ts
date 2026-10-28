import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { writeAuditEvent } from "@/lib/audit/log";
import { auditRequestMeta } from "@/lib/api/request-meta";
import {
  KybGateError,
  loadStaffKybView,
  recordValidationOutcome,
  setSupplierWaiver,
  updateKybItem,
} from "@/lib/kyb/kyb-service";
import { KYB_ITEM_STATUSES, VALIDATION_OUTCOMES } from "@/lib/kyb/checklist";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

const text = z.string().trim().max(2000).optional();

const bodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("update_item"),
    group: z.enum(["checklist", "commodityChecks", "validationChecks"]),
    key: z.string().min(1).max(100),
    status: z.enum(KYB_ITEM_STATUSES).optional(),
    notes: text,
    source: z.string().trim().max(500).optional(),
    evidence: text,
    discrepancies: text,
    outstandingRisks: text,
  }),
  z.object({
    action: z.literal("record_outcome"),
    outcome: z.enum(VALIDATION_OUTCOMES),
    report: z.string().trim().min(1).max(8000),
  }),
  z.object({
    action: z.literal("set_waiver"),
    waived: z.boolean(),
    reason: z.string().trim().max(2000).optional(),
  }),
]);

/** STAFF ONLY: KYB checklist, validation and waiver data must never reach buyer/supplier sessions. */
export async function GET(_request: NextRequest, { params }: Ctx) {
  try {
    const auth = await requireApiAuth({ permissions: "orgs:verify" });
    if ("error" in auth) return auth.error;
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id." }, { status: 400 });
    const view = await loadStaffKybView(id);
    if (!view.organization) return NextResponse.json({ error: "Not found." }, { status: 404 });
    return NextResponse.json(view);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PATCH(request: NextRequest, { params }: Ctx) {
  try {
    const auth = await requireApiAuth({ permissions: "orgs:verify" });
    if ("error" in auth) return auth.error;
    const { id } = await params;
    if (!Types.ObjectId.isValid(id)) return NextResponse.json({ error: "Invalid id." }, { status: 400 });

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Invalid KYB update." }, { status: 422 });
    const body = parsed.data;
    const actor = auth.ctx.userId;
    const meta = auditRequestMeta(request);

    if (body.action === "update_item") {
      await updateKybItem({
        organizationId: id,
        group: body.group,
        key: body.key,
        actorUserId: actor,
        patch: {
          status: body.status,
          notes: body.notes,
          source: body.source,
          evidence: body.evidence,
          discrepancies: body.discrepancies,
          outstandingRisks: body.outstandingRisks,
        },
      });
      await writeAuditEvent({
        action: "kyb.item_updated",
        targetType: "organization",
        targetId: id,
        actorUserId: actor,
        organizationId: id,
        ...meta,
        metadata: { group: body.group, key: body.key, status: body.status },
      });
    } else if (body.action === "record_outcome") {
      await recordValidationOutcome({ organizationId: id, outcome: body.outcome, report: body.report, actorUserId: actor });
      await writeAuditEvent({
        action: "kyb.outcome_recorded",
        targetType: "organization",
        targetId: id,
        actorUserId: actor,
        organizationId: id,
        ...meta,
        metadata: { outcome: body.outcome },
      });
    } else {
      await setSupplierWaiver({ organizationId: id, waived: body.waived, reason: body.reason, actorUserId: actor });
      await writeAuditEvent({
        action: body.waived ? "kyb.waiver_granted" : "kyb.waiver_revoked",
        targetType: "organization",
        targetId: id,
        actorUserId: actor,
        organizationId: id,
        ...meta,
        metadata: { reason: body.reason },
      });
    }

    return NextResponse.json(await loadStaffKybView(id));
  } catch (error) {
    if (error instanceof KybGateError) {
      return NextResponse.json({ error: error.message, code: error.code }, { status: 422 });
    }
    if (error instanceof Error && error.message === "unknown_item") {
      return NextResponse.json({ error: "Unknown checklist item." }, { status: 422 });
    }
    return handleApiError(error);
  }
}
