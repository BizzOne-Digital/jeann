import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import {
  createPresentationPackage,
  approvePresentationPackage,
  linkPresentationToBankPresentation,
} from "@/lib/shipments/presentation-package-service";

export const runtime = "nodejs";

const createSchema = z.object({
  shipmentLotId: z.string(),
  bankingInstrumentId: z.string(),
  checklistId: z.string(),
});

const approveSchema = z.object({
  action: z.literal("approve"),
  packageId: z.string(),
});

const linkSchema = z.object({
  action: z.literal("link_bank_presentation"),
  packageId: z.string(),
  bankPresentationId: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.action === "approve") {
      const auth = await requireApiAuth({ permissions: "shipments:approve" });
      if ("error" in auth) return auth.error;
      const parsed = approveSchema.parse(body);
      const pkg = await approvePresentationPackage({
        packageId: parsed.packageId,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(pkg._id), status: pkg.status });
    }

    if (body.action === "link_bank_presentation") {
      const auth = await requireApiAuth({ permissions: "banking:review" });
      if ("error" in auth) return auth.error;
      const parsed = linkSchema.parse(body);
      const pkg = await linkPresentationToBankPresentation({
        packageId: parsed.packageId,
        bankPresentationId: parsed.bankPresentationId,
        actorUserId: auth.ctx.userId,
      });
      return NextResponse.json({ id: String(pkg._id), status: pkg.status });
    }

    const auth = await requireApiAuth({ permissions: "shipments:write" });
    if ("error" in auth) return auth.error;
    const parsed = createSchema.parse(body);
    const pkg = await createPresentationPackage({
      ...parsed,
      actorUserId: auth.ctx.userId,
    });

    return NextResponse.json({
      id: String(pkg._id),
      packageReference: pkg.packageReference,
      status: pkg.status,
    });
  } catch (error) {
    if (error instanceof Error && error.message === "blocking_validation_errors") {
      return NextResponse.json(
        { error: "Blocking validation errors prevent package creation." },
        { status: 400 },
      );
    }
    return handleApiError(error);
  }
}
