import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  createPaymentRecord,
  uploadPaymentEvidence,
  verifyPayment,
  allocatePayment,
} from "@/lib/finance/payment-service";

export const runtime = "nodejs";

const createSchema = z.object({
  direction: z.enum(["incoming", "outgoing"]),
  payerOrganizationId: z.string().optional(),
  payeeOrganizationId: z.string().optional(),
  amount: z.string(),
  currency: z.string(),
  paymentDate: z.string(),
  method: z.string().optional(),
  bankReference: z.string().optional(),
  buyerVisible: z.boolean().optional(),
  supplierVisible: z.boolean().optional(),
});

const allocateSchema = z.object({
  action: z.literal("allocate"),
  paymentId: z.string(),
  buyerInvoiceId: z.string().optional(),
  supplierBillId: z.string().optional(),
  allocatedAmount: z.string(),
  currency: z.string(),
});

const verifySchema = z.object({
  action: z.literal("verify"),
  paymentId: z.string(),
  approved: z.boolean(),
});

const evidenceSchema = z.object({
  action: z.literal("upload_evidence"),
  paymentId: z.string(),
  evidenceDocumentId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "allocate") {
      const auth = await requireApiAuth({ permissions: "finance:write" });
      if ("error" in auth) return auth.error;
      const parsed = allocateSchema.parse(body);
      const alloc = await allocatePayment({
        ...parsed,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(alloc._id) });
    }

    if (body.action === "verify") {
      const auth = await requireApiAuth({ permissions: "finance:write" });
      if ("error" in auth) return auth.error;
      const parsed = verifySchema.parse(body);
      const payment = await verifyPayment({
        paymentId: parsed.paymentId,
        actorUserId: auth.ctx.userId,
        approved: parsed.approved,
      });
      return NextResponse.json({ id: String(payment._id), status: payment.status });
    }

    if (body.action === "upload_evidence") {
      const auth = await requireApiAuth({ permissions: "finance:write" });
      if ("error" in auth) return auth.error;
      const parsed = evidenceSchema.parse(body);
      const payment = await uploadPaymentEvidence({
        paymentId: parsed.paymentId,
        evidenceDocumentId: parsed.evidenceDocumentId,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({
        id: String(payment._id),
        status: payment.status,
        verificationStatus: payment.verificationStatus,
      });
    }

    const auth = await requireApiAuth({ permissions: "finance:write" });
    if ("error" in auth) return auth.error;
    const parsed = createSchema.parse(body);
    const payment = await createPaymentRecord({
      ...parsed,
      actorUserId: auth.ctx.userId,
    });
    return NextResponse.json({
      id: String(payment._id),
      paymentNumber: payment.paymentNumber,
      status: payment.status,
    });
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === "over_allocation") {
        return NextResponse.json({ error: "Over-allocation blocked." }, { status: 400 });
      }
      if (error.message === "payment_not_verified") {
        return NextResponse.json({ error: "Payment must be verified before allocation." }, { status: 400 });
      }
    }
    return handleApiError(error);
  }
}
