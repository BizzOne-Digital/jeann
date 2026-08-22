import { customAlphabet } from "nanoid";
import { Types } from "mongoose";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { hashIp, normalizeCompanyName } from "@/lib/db/ids";
import type { LeadKind } from "@/lib/leads/store";

const refNano = customAlphabet("ABCDEFGHJKLMNPQRSTUVWXYZ23456789", 6);

export function generateLeadReference(prefix: string): string {
  const year = new Date().getUTCFullYear();
  return `${prefix}-${year}-${refNano()}`;
}

function countryCode(value: string | undefined): string {
  if (!value) return "XX";
  const trimmed = value.trim();
  if (trimmed.length === 2) return trimmed.toUpperCase();
  return trimmed.slice(0, 2).toUpperCase() || "XX";
}

/** Persist public form intake into Mongo when configured. Returns display reference id. */
export async function persistLeadToMongo(
  kind: LeadKind,
  data: Record<string, unknown>,
  ip: string | null | undefined,
): Promise<string | null> {
  if (!isMongoConfigured()) return null;
  await tryConnectMongo();
  const models = await import("@/models");
  const ipHash = hashIp(ip);

  switch (kind) {
    case "purchase-request": {
      const reference = generateLeadReference("PR");
      const contactEmail = String(data.email ?? "").toLowerCase();
      let organizationId: Types.ObjectId | undefined;
      const matchedUser = await models.User.findOne({
        email: contactEmail,
        deletedAt: null,
      }).lean();
      if (matchedUser) {
        const membership = await models.OrganizationMembership.findOne({
          userId: matchedUser._id,
          status: "active",
          deletedAt: null,
          roles: { $in: ["buyer_org_admin", "buyer_member"] },
        }).lean();
        if (membership) organizationId = membership.organizationId;
      }
      await models.PurchaseRequest.create({
        reference,
        organizationId,
        contactName: String(data.contactName ?? ""),
        contactEmail,
        contactPhone: String(data.phone ?? ""),
        contactCompany: String(data.companyName ?? ""),
        productName: String(data.productName ?? ""),
        productSlug: data.productSlug ? String(data.productSlug) : undefined,
        productGrade: data.productGrade ? String(data.productGrade) : undefined,
        quantity: String(data.quantity ?? ""),
        unit: String(data.unit ?? ""),
        frequency: data.frequency ? String(data.frequency) : undefined,
        destinationCountry: countryCode(String(data.destinationCountry ?? "")),
        destinationPort: data.destinationPort ? String(data.destinationPort) : undefined,
        incoterm: String(data.incoterm ?? "").slice(0, 32),
        packaging: data.packaging ? String(data.packaging) : undefined,
        inspection: data.inspection ? String(data.inspection) : undefined,
        timeline: data.timeline ? String(data.timeline) : undefined,
        paymentPreference: data.paymentPreference
          ? String(data.paymentPreference)
          : undefined,
        paymentTermId: data.paymentTermId ? String(data.paymentTermId) : undefined,
        iccCode: data.iccCode ? String(data.iccCode) : undefined,
        pricePerMt: typeof data.pricePerMt === "number" ? data.pricePerMt : undefined,
        monthlyDeliveryTotal:
          typeof data.monthlyDeliveryTotal === "number" ? data.monthlyDeliveryTotal : undefined,
        deliveryCount:
          typeof data.deliveryCount === "number" ? data.deliveryCount : undefined,
        contractYears: typeof data.contractYears === "number" ? data.contractYears : undefined,
        contractTotal: typeof data.contractTotal === "number" ? data.contractTotal : undefined,
        notes: [data.specification, data.notes].filter(Boolean).map(String).join("\n\n") || undefined,
        attachments: [],
        status: "submitted",
        termsVersion: 1,
        termsAcceptedAt: new Date(),
        ipHash,
        source: "buyer-portal",
      });
      await models.Lead.create({
        source: "purchase-request",
        stage: "new",
        contact: {
          name: String(data.contactName ?? ""),
          email: contactEmail,
          phone: String(data.phone ?? ""),
        },
        company: String(data.companyName ?? ""),
        consent: { marketing: false, termsAccepted: true, consentedAt: new Date() },
        notes: `RFQ ${reference}: ${String(data.productName ?? "")}`,
        convertedOrganizationId: organizationId,
      });
      return reference;
    }
    case "contact": {
      const doc = await models.ContactSubmission.create({
        name: String(data.name ?? ""),
        email: String(data.email ?? "").toLowerCase(),
        phone: data.phone ? String(data.phone) : undefined,
        department: data.department ? String(data.department) : undefined,
        message: String(data.message ?? ""),
        consent: true,
        status: "new",
        ipHash,
      });
      await models.Lead.create({
        source: "contact",
        stage: "new",
        contact: {
          name: String(data.name ?? ""),
          email: String(data.email ?? "").toLowerCase(),
          phone: data.phone ? String(data.phone) : undefined,
        },
        consent: { marketing: false, termsAccepted: true, consentedAt: new Date() },
        notes: String(data.message ?? "").slice(0, 500),
      });
      return String(doc._id);
    }
    case "booking": {
      const start = new Date();
      start.setDate(start.getDate() + 3);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const doc = await models.BookingRequest.create({
        contact: {
          name: String(data.name ?? ""),
          email: String(data.email ?? "").toLowerCase(),
          phone: String(data.phone ?? ""),
        },
        topic: String(data.topic ?? ""),
        commodityInterest: data.commodityInterest
          ? String(data.commodityInterest)
          : undefined,
        volume: data.estimatedVolume ? String(data.estimatedVolume) : undefined,
        destination: data.destination ? String(data.destination) : undefined,
        timezone: String(data.timezone ?? "UTC"),
        preferredSlots: [{ startAt: start, endAt: end }],
        notes: [
          data.organization ? `Org: ${String(data.organization)}` : "",
          data.preferredSlot ? `Preferred: ${String(data.preferredSlot)}` : "",
          data.notes ? String(data.notes) : "",
        ]
          .filter(Boolean)
          .join("\n"),
        status: "requested",
      });
      await models.Lead.create({
        source: "booking",
        stage: "new",
        contact: {
          name: String(data.name ?? ""),
          email: String(data.email ?? "").toLowerCase(),
          phone: String(data.phone ?? ""),
        },
        company: data.organization ? String(data.organization) : undefined,
        consent: { marketing: false, termsAccepted: true, consentedAt: new Date() },
        notes: `Booking: ${String(data.topic ?? "")}`,
      });
      return String(doc._id);
    }
    case "trade-offer": {
      const reference = generateLeadReference("TO");
      const legalName = String(data.companyName ?? "Supplier enquiry");
      const normalized = normalizeCompanyName(legalName) || "supplier enquiry";
      let org = await models.Organization.findOne({
        type: "supplier",
        normalizedLegalName: normalized,
        deletedAt: null,
      });
      if (!org) {
        org = await models.Organization.create({
          type: "supplier",
          legalName,
          normalizedLegalName: normalized,
          country: countryCode(String(data.originCountry ?? "XX")),
          status: "pending",
        });
      }
      await models.TradeOffer.create({
        reference,
        organizationId: org._id as Types.ObjectId,
        contactName: String(data.contactName ?? ""),
        contactEmail: String(data.email ?? "").toLowerCase(),
        contactPhone: String(data.phone ?? ""),
        productName: String(data.productName ?? ""),
        quantity: String(data.quantity ?? ""),
        unit: String(data.unit ?? ""),
        originCountry: data.originCountry
          ? countryCode(String(data.originCountry))
          : undefined,
        incoterm: String(data.incoterm ?? "").slice(0, 32),
        packaging: data.packaging ? String(data.packaging) : undefined,
        notes: data.notes ? String(data.notes) : undefined,
        attachments: [],
        status: "submitted",
        termsVersion: 1,
        termsAcceptedAt: new Date(),
        ipHash,
        source: "public-form",
      });
      await models.Lead.create({
        source: "trade-offer",
        stage: "new",
        contact: {
          name: String(data.contactName ?? ""),
          email: String(data.email ?? "").toLowerCase(),
          phone: String(data.phone ?? ""),
        },
        company: legalName,
        consent: { marketing: false, termsAccepted: true, consentedAt: new Date() },
        notes: `Trade offer ${reference}`,
        convertedOrganizationId: org._id,
      });
      return reference;
    }
    case "newsletter": {
      const token = generateLeadReference("UNSUB");
      await models.NewsletterSubscriber.findOneAndUpdate(
        { email: String(data.email ?? "").toLowerCase() },
        {
          email: String(data.email ?? "").toLowerCase(),
          consentAt: new Date(),
          source: "website-footer",
          unsubscribeTokenHash: token,
          confirmedAt: new Date(),
          suppressedAt: null,
        },
        { upsert: true, new: true },
      );
      return "subscribed";
    }
    default:
      return null;
  }
}
