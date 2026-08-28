import { Types } from "mongoose";
import { sha256, randomToken } from "@/lib/auth/crypto";
import { hashPassword } from "@/lib/auth/password";
import { splitName } from "@/lib/auth/auth-context";
import { sendVerificationCode } from "@/lib/auth/verification-service";
import { normalizeCompanyName } from "@/lib/db/ids";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { notifyAdmins, notifyUser } from "@/lib/notifications/service";
import { getEnv } from "@/lib/config/env";
import { sendEmail } from "@/lib/email";
import type { OrganizationType } from "@/models/Organization";
import type { RoleKey } from "@/lib/authorization/permissions";
import type { InvitationLean } from "@/models/Invitation";

const INVITATION_TTL_DAYS = 14;

export type CreateInvitationInput = {
  email: string;
  phone?: string;
  contactName?: string;
  organizationType: OrganizationType;
  organizationId?: string;
  intendedLegalName?: string;
  roles: RoleKey[];
  createdBy: string;
  country?: string;
};

export async function createInvitation(input: CreateInvitationInput): Promise<{
  invitationId: string;
  token: string;
  inviteUrl: string;
  expiresAt: Date;
}> {
  if (!isMongoConfigured()) throw new Error("Database required");

  await tryConnectMongo();
  const { Invitation } = await import("@/models");

  const rawToken = randomToken(32);
  const tokenHash = sha256(rawToken);
  const expiresAt = new Date(Date.now() + INVITATION_TTL_DAYS * 24 * 60 * 60 * 1000);
  const email = input.email.trim().toLowerCase();

  const doc = await Invitation.create({
    tokenHash,
    email,
    phone: input.phone,
    contactName: input.contactName,
    organizationId: input.organizationId
      ? new Types.ObjectId(input.organizationId)
      : undefined,
    organizationType: input.organizationType,
    intendedLegalName: input.intendedLegalName,
    roles: input.roles,
    status: "pending",
    expiresAt,
    createdBy: new Types.ObjectId(input.createdBy),
  });

  const env = getEnv();
  const inviteUrl = `${env.APP_URL}/invite/${rawToken}`;

  const roleLabel = input.roles.join(", ");
  await sendEmail({
    to: { email },
    subject: "You're invited to Finekarts",
    text: `Hello ${input.contactName ?? "there"},\n\nYou have been invited to join Finekarts as ${roleLabel}.\n\nAccept your invitation: ${inviteUrl}\n\nThis link expires on ${expiresAt.toLocaleDateString()}.`,
    tags: ["invitation"],
    metadata: { inviteUrl },
  });

  if (env.NODE_ENV === "development") {
    console.info("[invitation] Accept URL (dev only):", inviteUrl);
  }

  return { invitationId: doc._id.toString(), token: rawToken, inviteUrl, expiresAt };
}

export async function findInvitationByToken(rawToken: string): Promise<{
  invitation: InvitationLean;
  valid: boolean;
  reason?: string;
}> {
  if (!isMongoConfigured()) {
    return { invitation: null as unknown as InvitationLean, valid: false, reason: "database_unavailable" };
  }

  await tryConnectMongo();
  const { Invitation } = await import("@/models");
  const tokenHash = sha256(rawToken);
  const invitation = await Invitation.findOne({ tokenHash }).lean();
  if (!invitation) {
    return { invitation: null as unknown as InvitationLean, valid: false, reason: "not_found" };
  }
  if (invitation.status === "revoked") {
    return { invitation, valid: false, reason: "revoked" };
  }
  if (invitation.status === "accepted") {
    return { invitation, valid: false, reason: "already_accepted" };
  }
  if (invitation.expiresAt.getTime() < Date.now()) {
    return { invitation, valid: false, reason: "expired" };
  }
  return { invitation, valid: true };
}

export async function resendInvitation(invitationId: string, actorUserId: string): Promise<{
  token: string;
  expiresAt: Date;
}> {
  await tryConnectMongo();
  const { Invitation } = await import("@/models");
  const existing = await Invitation.findById(invitationId);
  if (!existing || existing.status !== "pending") {
    throw new Error("Invitation not found or not pending.");
  }

  existing.status = "revoked";
  existing.revokedAt = new Date();
  await existing.save();

  const result = await createInvitation({
    email: existing.email,
    phone: existing.phone,
    contactName: existing.contactName,
    organizationType: existing.organizationType,
    organizationId: existing.organizationId?.toString(),
    intendedLegalName: existing.intendedLegalName,
    roles: existing.roles,
    createdBy: actorUserId,
  });

  return { token: result.token, expiresAt: result.expiresAt };
}

export async function revokeInvitation(invitationId: string): Promise<void> {
  await tryConnectMongo();
  const { Invitation } = await import("@/models");
  await Invitation.updateOne(
    { _id: invitationId, status: "pending" },
    { $set: { status: "revoked", revokedAt: new Date() } },
  );
}

export type AcceptInvitationInput = {
  rawToken: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
};

export async function acceptInvitation(input: AcceptInvitationInput): Promise<{
  userId: string;
  organizationId: string;
}> {
  const { invitation, valid, reason } = await findInvitationByToken(input.rawToken);
  if (!valid) throw new Error(reason ?? "invalid_invitation");

  await tryConnectMongo();
  const { User, Organization, OrganizationMembership, Invitation } = await import("@/models");

  const existingUser = await User.findOne({ email: invitation.email, deletedAt: null }).lean();
  if (existingUser) {
    throw new Error("email_exists");
  }

  const passwordHash = await hashPassword(input.password);
  const nameParts = input.firstName
    ? { firstName: input.firstName, lastName: input.lastName ?? "" }
    : splitName(invitation.contactName ?? invitation.email);

  const user = await User.create({
    email: invitation.email,
    normalizedEmail: invitation.email,
    passwordHash,
    firstName: nameParts.firstName,
    lastName: nameParts.lastName,
    name: [nameParts.firstName, nameParts.lastName].filter(Boolean).join(" ") || invitation.email,
    phone: input.phone ?? invitation.phone,
    status: "pending_verification",
    mfaEnabled: false,
  });

  let organizationId: Types.ObjectId;

  if (invitation.organizationId) {
    organizationId = invitation.organizationId;
  } else {
    const legalName = invitation.intendedLegalName ?? `${invitation.organizationType} org`;
    const org = await Organization.create({
      type: invitation.organizationType,
      legalName,
      normalizedLegalName: normalizeCompanyName(legalName) || invitation.organizationType,
      country: "XX",
      status: "pending",
      onboardingStatus: "email_verification_pending",
      createdByUserId: user._id,
    });
    organizationId = org._id;
  }

  await OrganizationMembership.create({
    userId: user._id,
    organizationId,
    roles: invitation.roles,
    customPermissions: [],
    status: "active",
    invitedBy: invitation.createdBy,
  });

  await Invitation.updateOne(
    { _id: invitation._id },
    { $set: { status: "accepted", acceptedAt: new Date() } },
  );

  await sendVerificationCode({
    userId: user._id,
    channel: "email",
    purpose: "email_verify",
    destination: user.email,
    name: user.name,
  });

  if (invitation.organizationType === "supplier") {
    await notifyAdmins({
      type: "supplier_invitation_accepted",
      title: "Supplier invitation accepted",
      body: `${user.email} accepted a supplier invitation.`,
      href: `/admin/organizations`,
    });
  }

  return { userId: user._id.toString(), organizationId: organizationId.toString() };
}
