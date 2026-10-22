import { NextRequest, NextResponse } from "next/server";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { assertBuyerTransactionAccess } from "@/lib/transactions/buyer-access";
import { storeKybDocument, validateKybUpload } from "@/lib/files/kyb-upload";
import { Types } from "mongoose";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await requireApiAuth({ permissions: "transactions:write" });
    if ("error" in auth) return auth.error;

    const access = await assertBuyerTransactionAccess(auth.ctx.userId);
    const { id } = await params;

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File required." }, { status: 422 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const validated = validateKybUpload({
      filename: file.name,
      mimeType: file.type || "application/pdf",
      size: file.size,
      buffer,
    });
    if (!validated.ok) {
      return NextResponse.json({ error: validated.error }, { status: 422 });
    }

    const { PurchaseRequest } = await import("@/models");
    const doc = await PurchaseRequest.findOne({
      _id: id,
      organizationId: new Types.ObjectId(access.organizationId),
      status: { $in: ["draft", "more_information_required"] },
    });
    if (!doc) {
      return NextResponse.json({ error: "Request not found or not editable." }, { status: 404 });
    }

    const stored = await storeKybDocument({
      organizationId: access.organizationId,
      cisProfileId: String(doc._id),
      cisVersion: 1,
      documentType: "other",
      filename: file.name,
      mimeType: file.type || "application/pdf",
      buffer,
      uploadedBy: auth.ctx.userId,
    });

    doc.attachments = [
      ...(doc.attachments ?? []),
      {
        storageKey: stored.storageKey,
        filename: file.name,
        mimeType: file.type || "application/pdf",
        size: stored.sizeBytes,
      },
    ];
    await doc.save();

    return NextResponse.json({ ok: true, filename: file.name });
  } catch (error) {
    return handleApiError(error);
  }
}
