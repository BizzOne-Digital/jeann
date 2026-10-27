import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBankingInstrumentAccess } from "@/lib/banking/access";
import {
  COURIER_STATUSES,
  PAYMENT_STATUSES,
  VERIFICATION_STATUSES,
  createCourierRecord,
  updateCourierRecord,
} from "@/lib/banking/courier-service";

export const runtime = "nodejs";

const createSchema = z.object({
  bankingInstrumentId: z.string().min(1),
  presentationPackageId: z.string().optional(),
  courierCompany: z.string().min(1),
  trackingNumber: z.string().optional(),
  sender: z.string().min(1),
  recipient: z.string().min(1),
  recipientBankName: z.string().optional(),
  recipientAdviserName: z.string().optional(),
  dispatchDate: z.string().optional(),
  expectedDeliveryDate: z.string().optional(),
  packageDescription: z.string().optional(),
});

const updateSchema = z.object({
  courierId: z.string().min(1),
  status: z.enum(COURIER_STATUSES).optional(),
  trackingNumber: z.string().optional(),
  dispatchDate: z.string().optional(),
  receivedDate: z.string().optional(),
  verificationStatus: z.enum(VERIFICATION_STATUSES).optional(),
  paymentStatus: z.enum(PAYMENT_STATUSES).optional(),
  paymentReference: z.string().optional(),
  statusNotes: z.string().optional(),
});

/** Courier records: staff with banking:review or the assigned external banking adviser only. */
export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "banking:review" });
    if ("error" in auth) return auth.error;
    const body = createSchema.parse(await request.json());
    const { roles, instrument } = await assertBankingInstrumentAccess(
      auth.ctx.userId,
      body.bankingInstrumentId,
    );
    const rec = await createCourierRecord({
      ...body,
      bankingInstrumentId: String(instrument!._id),
      actorUserId: auth.ctx.userId,
      senderIsAdviser: !auth.ctx.isInternal && roles.includes("banking_advisor"),
    });
    return NextResponse.json({ id: String(rec._id) });
  } catch (error) {
    return courierError(error);
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "banking:review" });
    if ("error" in auth) return auth.error;
    const body = updateSchema.parse(await request.json());
    const { CourierRecord } = await import("@/models");
    const existing = await CourierRecord.findById(body.courierId).lean();
    if (!existing) return NextResponse.json({ error: "Not found." }, { status: 404 });
    await assertBankingInstrumentAccess(auth.ctx.userId, String(existing.bankingInstrumentId));
    const rec = await updateCourierRecord({ ...body, actorUserId: auth.ctx.userId });
    return NextResponse.json({
      id: String(rec._id),
      status: rec.status,
      verificationStatus: rec.verificationStatus,
      paymentStatus: rec.paymentStatus,
    });
  } catch (error) {
    return courierError(error);
  }
}

function courierError(error: unknown) {
  if (error instanceof Error) {
    const map: Record<string, string> = {
      payment_requires_verification:
        "Payment can only be confirmed after the buyer bank has verified the documents as authentic.",
      verification_requires_delivery:
        "Verification can only be recorded after the package is marked as received.",
      package_instrument_mismatch: "Presentation package does not belong to this instrument.",
      not_found: "Not found.",
    };
    if (map[error.message]) {
      return NextResponse.json({ error: map[error.message] }, { status: 400 });
    }
  }
  return handleApiError(error);
}
