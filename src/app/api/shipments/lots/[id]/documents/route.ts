import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertShipmentLotAccess } from "@/lib/shipments/access";
import {
  uploadShippingDocument,
  submitShippingDocumentRevision,
  reviewShippingDocumentRevision,
} from "@/lib/shipments/shipping-document-service";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

const reviewSchema = z.object({
  action: z.literal("review"),
  documentId: z.string(),
  versionId: z.string(),
  decision: z.enum(["approved", "changes_requested", "rejected"]),
  comments: z.string().optional(),
  checklistRequirementId: z.string().optional(),
});

const submitSchema = z.object({
  action: z.literal("submit"),
  documentId: z.string(),
  versionId: z.string(),
});

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;

    const { lot } = await assertShipmentLotAccess(auth.ctx.userId, id);

    const contentType = request.headers.get("content-type") ?? "";
    if (contentType.includes("multipart/form-data")) {
      const authWrite = await requireApiAuth({ permissions: "documents:write" });
      if ("error" in authWrite) return authWrite.error;

      const form = await request.formData();
      const file = form.get("file");
      if (!(file instanceof File)) {
        return NextResponse.json({ error: "File required." }, { status: 422 });
      }

      const meta = z
        .object({
          organizationId: z.string(),
          transactionId: z.string(),
          shippingDocumentType: z.string(),
          title: z.string(),
          checklistRequirementId: z.string().optional(),
          buyerVisible: z.coerce.boolean().optional(),
          supplierVisible: z.coerce.boolean().optional(),
          bankingVisible: z.coerce.boolean().optional(),
        })
        .parse({
          organizationId: form.get("organizationId"),
          transactionId: form.get("transactionId"),
          shippingDocumentType: form.get("shippingDocumentType"),
          title: form.get("title"),
          checklistRequirementId: form.get("checklistRequirementId") ?? undefined,
          buyerVisible: form.get("buyerVisible") ?? undefined,
          supplierVisible: form.get("supplierVisible") ?? undefined,
          bankingVisible: form.get("bankingVisible") ?? undefined,
        });

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await uploadShippingDocument({
        shipmentLotId: String(lot._id),
        organizationId: meta.organizationId,
        transactionId: meta.transactionId,
        checklistRequirementId: meta.checklistRequirementId,
        shippingDocumentType: meta.shippingDocumentType,
        title: meta.title,
        actorUserId: authWrite.ctx.userId,
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        buffer,
        buyerVisible: meta.buyerVisible,
        supplierVisible: meta.supplierVisible,
        bankingVisible: meta.bankingVisible,
      });

      return NextResponse.json({
        documentId: String(result.document._id),
        versionId: String(result.version._id),
        version: result.version.version,
      });
    }

    const body = await request.json();
    if (body.action === "submit") {
      const authWrite = await requireApiAuth({ permissions: "documents:write" });
      if ("error" in authWrite) return authWrite.error;
      const parsed = submitSchema.parse(body);
      const version = await submitShippingDocumentRevision({
        documentId: parsed.documentId,
        versionId: parsed.versionId,
        actorUserId: authWrite.ctx.userId,
      });
      return NextResponse.json({ versionId: String(version._id), status: version.status });
    }

    if (body.action === "review") {
      const authReview = await requireApiAuth({ permissions: "documents:approve" });
      if ("error" in authReview) return authReview.error;
      const parsed = reviewSchema.parse(body);
      const version = await reviewShippingDocumentRevision({
        documentId: parsed.documentId,
        versionId: parsed.versionId,
        reviewerUserId: authReview.ctx.userId,
        decision: parsed.decision,
        comments: parsed.comments,
        checklistRequirementId: parsed.checklistRequirementId,
      });
      return NextResponse.json({ versionId: String(version._id), status: version.status });
    }

    return NextResponse.json({ error: "Unsupported request." }, { status: 400 });
  } catch (error) {
    return handleApiError(error);
  }
}
