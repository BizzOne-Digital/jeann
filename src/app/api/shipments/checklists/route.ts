import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  createShipmentChecklist,
  submitBuyerDocumentRequests,
  approveAndLockChecklist,
} from "@/lib/shipments/checklist-service";

export const runtime = "nodejs";

const createSchema = z.object({
  shipmentLotId: z.string(),
  transactionId: z.string(),
  bankingInstrumentId: z.string().optional(),
  destinationCountry: z.string().optional(),
  destinationPort: z.string().optional(),
});

const buyerInputSchema = z.object({
  action: z.literal("buyer_input"),
  checklistId: z.string(),
  buyerAuthorityNoticeConfirmed: z.boolean(),
  additionalDocumentTypes: z.array(z.string()).optional(),
  customsNotes: z.string().optional(),
});

const lockSchema = z.object({
  action: z.literal("lock"),
  checklistId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;

    const body = await request.json();

    if (body.action === "buyer_input") {
      const parsed = buyerInputSchema.parse(body);
      const checklist = await submitBuyerDocumentRequests({
        checklistId: parsed.checklistId,
        actorUserId: auth.ctx.userId,
        buyerAuthorityNoticeConfirmed: parsed.buyerAuthorityNoticeConfirmed,
        additionalDocumentTypes: parsed.additionalDocumentTypes,
        customsNotes: parsed.customsNotes,
      });
      return NextResponse.json({ id: String(checklist._id), status: checklist.status });
    }

    if (body.action === "lock") {
      const authApprove = await requireApiAuth({ permissions: "shipments:approve" });
      if ("error" in authApprove) return authApprove.error;
      const parsed = lockSchema.parse(body);
      const checklist = await approveAndLockChecklist({
        checklistId: parsed.checklistId,
        actorUserId: authApprove.ctx.userId,
      });
      return NextResponse.json({ id: String(checklist._id), status: checklist.status });
    }

    const authWrite = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in authWrite) return authWrite.error;
    const parsed = createSchema.parse(body);
    const checklist = await createShipmentChecklist({
      ...parsed,
      actorUserId: authWrite.ctx.userId,
    });

    return NextResponse.json({ id: String(checklist._id), version: checklist.version });
  } catch (error) {
    if (error instanceof Error && error.message === "authority_notice_required") {
      return NextResponse.json(
        {
          error:
            "Buyer must confirm destination authority notice before submitting document requests.",
        },
        { status: 400 },
      );
    }
    return handleApiError(error);
  }
}
