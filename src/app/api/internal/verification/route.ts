import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiAuth, handleApiError } from "@/lib/api/require-api-auth";
import { authContextHasPermission, type AuthContext } from "@/lib/auth/auth-context";
import {
  getFinekartsVerificationStatus,
  runFinekartsVerification,
} from "@/lib/integrations/verification-service";

export const runtime = "nodejs";

function assertFinekartsVerificationAccess(auth: { ctx: AuthContext }) {
  if (!auth.ctx.isInternal) return NextResponse.json({ error: "Finekarts internal access only." }, { status: 403 });
  if (
    !authContextHasPermission(auth.ctx, "orgs:verify") &&
    !authContextHasPermission(auth.ctx, "integrations:manage")
  ) {
    return NextResponse.json({ error: "Insufficient permissions." }, { status: 403 });
  }
  return null;
}

export async function GET() {
  try {
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;
    const denied = assertFinekartsVerificationAccess(auth);
    if (denied) return denied;

    const status = await getFinekartsVerificationStatus();
    return NextResponse.json(status);
  } catch (error) {
    return handleApiError(error);
  }
}

const postSchema = z.object({
  channel: z.enum(["kyb", "tic"]),
  organizationId: z.string().optional(),
  shipmentLotId: z.string().optional(),
  reference: z.string().optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth();
    if ("error" in auth) return auth.error;
    const denied = assertFinekartsVerificationAccess(auth);
    if (denied) return denied;

    const body = postSchema.parse(await request.json());
    const result = await runFinekartsVerification({
      channel: body.channel,
      actorUserId: auth.ctx.userId,
      organizationId: body.organizationId,
      shipmentLotId: body.shipmentLotId,
      reference: body.reference,
      payload: body.payload,
    });

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    if (error instanceof Error && error.message.includes("_not_configured")) {
      return NextResponse.json({ error: "Verification API key is not configured." }, { status: 503 });
    }
    if (error instanceof Error && error.message.includes("_base_url_missing")) {
      return NextResponse.json(
        { error: "Verification base URL is not configured yet — add when the vendor confirms the endpoint." },
        { status: 503 },
      );
    }
    return handleApiError(error);
  }
}
