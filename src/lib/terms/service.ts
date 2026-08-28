import { Types } from "mongoose";
import { hashIp } from "@/lib/auth/crypto";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import type { TermsDocumentLean } from "@/models/TermsDocument";

export const BUYER_REQUIRED_TERMS_KEYS = [
  "buyer_portal_terms",
  "privacy_notice",
  "confidentiality_agreement",
] as const;

export const SUPPLIER_REQUIRED_TERMS_KEYS = [
  "supplier_portal_terms",
  "privacy_notice",
  "confidentiality_agreement",
] as const;

export async function getCurrentTerms(keys: string[], locale = "en"): Promise<TermsDocumentLean[]> {
  if (!isMongoConfigured()) return [];
  await tryConnectMongo();
  const { TermsDocument } = await import("@/models");

  const docs: TermsDocumentLean[] = [];
  for (const key of keys) {
    const doc = await TermsDocument.findOne({
      key,
      locale,
      publishedAt: { $ne: null },
    })
      .sort({ version: -1 })
      .lean();
    if (doc) docs.push(doc);
  }
  return docs;
}

export async function recordTermsAcceptance(input: {
  userId: string | Types.ObjectId;
  organizationId?: string | Types.ObjectId;
  termsKey: string;
  termsVersion: number;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  if (!isMongoConfigured()) return;
  await tryConnectMongo();
  const { TermsAcceptance } = await import("@/models");

  const userId =
    input.userId instanceof Types.ObjectId
      ? input.userId
      : new Types.ObjectId(input.userId);

  await TermsAcceptance.findOneAndUpdate(
    {
      userId,
      termsKey: input.termsKey,
      termsVersion: input.termsVersion,
    },
    {
      userId,
      organizationId: input.organizationId
        ? input.organizationId instanceof Types.ObjectId
          ? input.organizationId
          : new Types.ObjectId(input.organizationId)
        : undefined,
      termsKey: input.termsKey,
      termsVersion: input.termsVersion,
      acceptedAt: new Date(),
      ipHash: hashIp(input.ip),
      userAgent: input.userAgent,
      metadata: input.metadata,
    },
    { upsert: true, new: true },
  );
}

export async function userHasAcceptedRequiredTerms(input: {
  userId: string;
  organizationId?: string;
  keys: readonly string[];
}): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  await tryConnectMongo();
  const { TermsAcceptance, TermsDocument } = await import("@/models");

  const required = await TermsDocument.find({
    key: { $in: [...input.keys] },
    requiresAcceptance: true,
    publishedAt: { $ne: null },
  }).lean();

  const acceptances = await TermsAcceptance.find({
    userId: new Types.ObjectId(input.userId),
    organizationId: input.organizationId
      ? new Types.ObjectId(input.organizationId)
      : undefined,
  }).lean();

  const accepted = new Set(
    acceptances.map((a) => `${a.termsKey}:${a.termsVersion}`),
  );

  return required.every((doc) => accepted.has(`${doc.key}:${doc.version}`));
}
