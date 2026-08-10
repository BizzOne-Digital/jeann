import { NextRequest, NextResponse } from "next/server";
import { createDevBuyer, findDevOrganization, findDevUserByEmail } from "@/lib/auth/dev-store";
import { hashPassword } from "@/lib/auth/password";
import { registerBuyerSchema } from "@/lib/validation/forms";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { normalizeCompanyName } from "@/lib/db/ids";

function countryCode(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  const map: Record<string, string> = {
    canada: "CA",
    "united states": "US",
    usa: "US",
    india: "IN",
    "united kingdom": "GB",
    uk: "GB",
  };
  return map[trimmed.toLowerCase()] ?? (trimmed.slice(0, 2).toUpperCase() || "XX");
}

export async function POST(request: NextRequest) {
  try {
    const parsed = registerBuyerSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please correct the form.", issues: parsed.error.flatten() },
        { status: 422 },
      );
    }
    const input = parsed.data;
    const email = input.email.toLowerCase();
    const passwordHash = await hashPassword(input.password);

    if (isMongoConfigured()) {
      await tryConnectMongo();
      const { User, Organization, OrganizationMembership } = await import("@/models");
      const normalized = normalizeCompanyName(input.legalName) || "buyer";
      const [emailMatch, companyMatch] = await Promise.all([
        User.findOne({ email, deletedAt: null }).lean(),
        Organization.findOne({
          type: "buyer",
          normalizedLegalName: normalized,
          deletedAt: null,
        }).lean(),
      ]);
      // Do not disclose whether an entity is already registered.
      if (emailMatch || companyMatch) {
        return NextResponse.json(
          { ok: true, status: "review", message: "Registration received for review." },
          { status: 202 },
        );
      }

      const org = await Organization.create({
        type: "buyer",
        legalName: input.legalName,
        normalizedLegalName: normalized,
        registrationNumber: input.registrationNumber,
        country: countryCode(input.country),
        domain: input.domain?.toLowerCase() || undefined,
        status: "pending",
      });

      const user = await User.create({
        email,
        passwordHash,
        name: input.contactName,
        phone: input.phone,
        status: "active",
        emailVerifiedAt: new Date(),
      });

      await OrganizationMembership.create({
        userId: user._id,
        organizationId: org._id,
        roles: ["buyer_org_admin"],
        customPermissions: [],
        status: "active",
      });

      return NextResponse.json({ ok: true, status: "pending-verification" }, { status: 201 });
    }

    const [emailMatch, companyMatch] = await Promise.all([
      findDevUserByEmail(email),
      findDevOrganization(input.legalName),
    ]);
    if (emailMatch || companyMatch) {
      return NextResponse.json(
        { ok: true, status: "review", message: "Registration received for review." },
        { status: 202 },
      );
    }
    await createDevBuyer({
      organizationName: input.legalName,
      name: input.contactName,
      email,
      phone: input.phone,
      passwordHash,
    });
    return NextResponse.json({ ok: true, status: "pending-verification" }, { status: 201 });
  } catch (error) {
    console.error("[register/buyer]", error);
    return NextResponse.json({ error: "Unable to receive registration." }, { status: 400 });
  }
}
