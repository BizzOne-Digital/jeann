import { NextRequest, NextResponse } from "next/server";
import { adminDeniedResponse, requireAdminApiSession } from "@/lib/admin/require-admin-api";
import { writeAuditEvent } from "@/lib/audit/log";
import {
  deleteCompanyImage,
  loadCompanyImage,
  prepareCompanyImage,
  saveCompanyImage,
  type CompanyImageKind,
} from "@/lib/documents/signature-image";

function kindOf(request: NextRequest): CompanyImageKind {
  return request.nextUrl.searchParams.get("kind") === "seal" ? "seal" : "signature";
}

export const runtime = "nodejs";

/** The signature, for the admin preview. */
export async function GET(request: NextRequest) {
  const session = await requireAdminApiSession();
  if (!session) return adminDeniedResponse();
  const png = await loadCompanyImage(kindOf(request));
  if (!png) return NextResponse.json({ error: "No signature saved." }, { status: 404 });
  return new NextResponse(new Uint8Array(png), {
    headers: { "Content-Type": "image/png", "Cache-Control": "private, no-store" },
  });
}

/** Admin uploads the signature once. It is printed on final documents. */
export async function POST(request: NextRequest) {
  const session = await requireAdminApiSession();
  if (!session) return adminDeniedResponse();
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose an image file." }, { status: 422 });
  if (!/^image\/(png|jpeg|jpg|webp)$/.test(file.type)) {
    return NextResponse.json({ error: "Use a PNG or JPG picture of the signature." }, { status: 422 });
  }
  if (file.size > 2 * 1024 * 1024) return NextResponse.json({ error: "The picture is too large (2 MB maximum)." }, { status: 413 });
  try {
    const kind = kindOf(request);
    const png = await prepareCompanyImage(kind, Buffer.from(await file.arrayBuffer()));
    await saveCompanyImage(kind, png, session.userId);
    await writeAuditEvent({
      action: kind === "seal" ? "company_seal.saved" : "company_signature.saved",
      targetType: "company_signature",
      actorUserId: session.userId,
      result: "success",
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "That picture could not be read. Try a PNG or JPG." }, { status: 422 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await requireAdminApiSession();
  if (!session) return adminDeniedResponse();
  const kind = kindOf(request);
  await deleteCompanyImage(kind);
  await writeAuditEvent({
    action: kind === "seal" ? "company_seal.removed" : "company_signature.removed",
    targetType: "company_signature",
    actorUserId: session.userId,
    result: "success",
  });
  return NextResponse.json({ ok: true });
}
