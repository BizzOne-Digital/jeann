import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { getBuyerOrganizationId } from "@/lib/auth/buyer-org";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

const bodySchema = z.object({
  legalName: z.string().trim().min(2).max(200),
  registrationNumber: z.string().trim().max(80).optional(),
  registeredAddress: z.string().trim().min(3).max(300),
  authorizedRepresentative: z.string().trim().min(2).max(120),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }
    if (!isMongoConfigured()) {
      return NextResponse.json(
        { error: "MongoDB is required to save CIS profiles." },
        { status: 503 },
      );
    }

    const parsed = bodySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Please correct the form." }, { status: 422 });
    }

    await tryConnectMongo();
    const orgId = await getBuyerOrganizationId(session);
    if (!orgId) {
      return NextResponse.json({ error: "No buyer organization on this account." }, { status: 403 });
    }

    const { CisProfile } = await import("@/models");
    const input = parsed.data;
    const existing = await CisProfile.findOne({ organizationId: orgId }).sort({ version: -1 });
    const version = existing ? existing.version : 1;

    await CisProfile.findOneAndUpdate(
      { organizationId: orgId, version },
      {
        organizationId: orgId,
        version,
        status: "draft",
        legalName: input.legalName,
        registrationNumber: input.registrationNumber || undefined,
        representatives: [
          {
            name: input.authorizedRepresentative,
            title: "Authorized representative",
            email: session.user.email,
          },
        ],
        contacts: [
          {
            name: input.authorizedRepresentative,
            email: session.user.email,
            phone: session.user.phone,
          },
        ],
        addresses: [
          {
            label: "Registered",
            line1: input.registeredAddress,
            city: "—",
            country: "XX",
          },
        ],
        authorizedSigners: [
          {
            name: input.authorizedRepresentative,
            email: session.user.email,
          },
        ],
        productInterests: existing?.productInterests ?? [],
        sensitiveFieldsMasked: existing?.sensitiveFieldsMasked ?? {},
      },
      { upsert: true, new: true },
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[portal/buyer/cis]", error);
    return NextResponse.json({ error: "Unable to save CIS draft." }, { status: 400 });
  }
}
