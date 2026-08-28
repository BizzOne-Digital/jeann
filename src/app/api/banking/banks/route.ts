import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";

export const runtime = "nodejs";

const bankSchema = z.object({
  bankId: z.string(),
  legalName: z.string(),
  country: z.string(),
  swiftBic: z.string().optional(),
  branch: z.string().optional(),
});

export async function GET() {
  try {
    const auth = await requireApiAuth({ permissions: "banking:review" });
    if ("error" in auth) return auth.error;

    const { BankOrganization } = await import("@/models");
    const items = await BankOrganization.find({ verificationStatus: { $ne: "archived" } })
      .sort({ legalName: 1 })
      .limit(200)
      .lean();

    return NextResponse.json({ items });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth({ permissions: "banking:review" });
    if ("error" in auth) return auth.error;

    const body = bankSchema.parse(await request.json());
    const { BankOrganization } = await import("@/models");
    const bank = await BankOrganization.findOneAndUpdate(
      { bankId: body.bankId },
      {
        bankId: body.bankId,
        legalName: body.legalName,
        country: body.country,
        swiftBic: body.swiftBic,
        branch: body.branch,
        verificationStatus: "information_provided",
        createdByUserId: auth.ctx.userId,
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({ id: String(bank._id), bankId: bank.bankId });
  } catch (error) {
    return handleApiError(error);
  }
}
