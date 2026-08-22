import { tryConnectMongo } from "@/lib/db/mongoose";

export type AdminSectionRow = { key: string; cells: string[] };

export type AdminSectionData = {
  countLabel: string | null;
  columns: string[];
  rows: AdminSectionRow[];
  emptyMessage: string;
};

function dateCell(value?: Date | string | null) {
  return value ? new Date(value).toLocaleDateString() : "—";
}

function table(
  countLabel: string,
  columns: string[],
  rows: AdminSectionRow[],
  emptyMessage: string,
): AdminSectionData {
  return { countLabel, columns, rows, emptyMessage };
}

const EMPTY_DEFAULT =
  "No records yet. Data appears here when forms are submitted or seed content is loaded.";

export async function loadAdminSectionData(section: string): Promise<AdminSectionData> {
  const conn = await tryConnectMongo();
  if (!conn) {
    return {
      countLabel: null,
      columns: ["Status"],
      rows: [],
      emptyMessage: "Connect MongoDB (MONGODB_URI) and run npm run seed to load admin data.",
    };
  }

  try {
    const models = await import("@/models");

    switch (section) {
      case "purchase-requests": {
        const total = await models.PurchaseRequest.countDocuments();
        const docs = await models.PurchaseRequest.find()
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        return table(
          `${total} total`,
          ["Reference", "Company", "Product", "Contract", "Payment", "Status", "Submitted"],
          docs.map((doc) => ({
            key: doc.reference,
            cells: [
              doc.reference,
              doc.contactCompany || doc.contactEmail || "—",
              doc.productName,
              doc.contractTotal
                ? `USD ${doc.contractTotal.toLocaleString()} (${doc.deliveryCount ?? "—"} deliveries)`
                : [doc.quantity, doc.unit].filter(Boolean).join(" ") || "—",
              doc.paymentPreference
                ? `${doc.paymentPreference}${doc.iccCode ? ` (${doc.iccCode})` : ""}`
                : "—",
              doc.status,
              dateCell(doc.createdAt),
            ],
          })),
          "No purchase requests yet. Buyer RFQs will appear here once submitted.",
        );
      }
      case "trade-offers": {
        const total = await models.TradeOffer.countDocuments();
        const docs = await models.TradeOffer.find().sort({ createdAt: -1 }).limit(50).lean();
        return table(
          `${total} total`,
          ["Reference", "Contact", "Product", "Status", "Submitted"],
          docs.map((doc) => ({
            key: doc.reference,
            cells: [
              doc.reference,
              doc.contactEmail || doc.contactName || "—",
              doc.productName,
              doc.status,
              dateCell(doc.createdAt),
            ],
          })),
          "No trade offers yet.",
        );
      }
      case "transactions": {
        const total = await models.Transaction.countDocuments({ deletedAt: null });
        const docs = await models.Transaction.find({ deletedAt: null })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        return table(
          `${total} total`,
          ["Number", "Side", "Status", "Current step", "Created"],
          docs.map((doc) => ({
            key: String(doc._id),
            cells: [
              doc.transactionNumber,
              doc.side,
              doc.status,
              doc.currentStepKey || "—",
              dateCell(doc.createdAt),
            ],
          })),
          "No transactions yet.",
        );
      }
      case "buyers": {
        const total = await models.Organization.countDocuments({ type: "buyer", deletedAt: null });
        const docs = await models.Organization.find({ type: "buyer", deletedAt: null })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        return table(
          `${total} buyer orgs (showing up to 50)`,
          ["Legal name", "Country", "Status", "Created"],
          docs.map((doc) => ({
            key: String(doc._id),
            cells: [doc.legalName, doc.country, doc.status, dateCell(doc.createdAt)],
          })),
          "No buyer organizations yet.",
        );
      }
      case "suppliers": {
        const total = await models.Organization.countDocuments({
          type: "supplier",
          deletedAt: null,
        });
        const docs = await models.Organization.find({ type: "supplier", deletedAt: null })
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        return table(
          `${total} supplier orgs (showing up to 50)`,
          ["Legal name", "Country", "Status", "Created"],
          docs.map((doc) => ({
            key: String(doc._id),
            cells: [doc.legalName, doc.country, doc.status, dateCell(doc.createdAt)],
          })),
          "No supplier organizations yet.",
        );
      }
      case "documents": {
        const total = await models.DocumentTemplate.countDocuments();
        const docs = await models.DocumentTemplate.find()
          .sort({ key: 1, version: -1 })
          .limit(50)
          .lean();
        return table(
          `${total} templates`,
          ["Key", "Name", "Version", "Side", "Status"],
          docs.map((doc) => ({
            key: `${doc.key}-${doc.version}`,
            cells: [doc.key, doc.name, String(doc.version), doc.side, doc.status],
          })),
          "No document templates yet.",
        );
      }
      case "validation-rules": {
        const total = await models.ValidationRuleSet.countDocuments();
        const docs = await models.ValidationRuleSet.find()
          .sort({ key: 1, version: -1 })
          .limit(50)
          .lean();
        return table(
          `${total} rule sets`,
          ["Key", "Version", "Rules", "Active", "Approved"],
          docs.map((doc) => ({
            key: `${doc.key}-${doc.version}`,
            cells: [
              doc.key,
              String(doc.version),
              String(doc.rules?.length ?? 0),
              doc.active ? "yes" : "no",
              dateCell(doc.approvedAt),
            ],
          })),
          "No validation rule sets yet.",
        );
      }
      case "approvals": {
        const total = await models.Approval.countDocuments();
        const docs = await models.Approval.find().sort({ createdAt: -1 }).limit(50).lean();
        return table(
          `${total} total`,
          ["Target type", "Target id", "Decision", "Actor", "Created"],
          docs.map((doc) => ({
            key: String(doc._id),
            cells: [
              doc.targetType,
              String(doc.targetId),
              doc.decision,
              String(doc.actorUserId),
              dateCell(doc.createdAt),
            ],
          })),
          "No approval records yet.",
        );
      }
      case "bookings": {
        const total = await models.BookingRequest.countDocuments();
        const docs = await models.BookingRequest.find()
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        return table(
          `${total} total`,
          ["Contact", "Topic", "Status", "Requested"],
          docs.map((doc) => ({
            key: String(doc._id),
            cells: [
              doc.contact?.email || doc.contact?.name || "—",
              doc.topic,
              doc.status,
              dateCell(doc.createdAt),
            ],
          })),
          "No booking requests yet.",
        );
      }
      case "shipments": {
        const total = await models.Shipment.countDocuments();
        const docs = await models.Shipment.find().sort({ updatedAt: -1 }).limit(50).lean();
        return table(
          `${total} total`,
          ["Mode", "Route", "Status", "Carrier", "Updated"],
          docs.map((doc) => ({
            key: String(doc._id),
            cells: [
              doc.mode,
              [doc.originPort, doc.destinationPort].filter(Boolean).join(" → ") || "—",
              doc.status,
              doc.carrier || "—",
              dateCell(doc.updatedAt),
            ],
          })),
          "No shipments yet.",
        );
      }
      case "finance": {
        const [entryTotal, taxTotal] = await Promise.all([
          models.FinanceEntry.countDocuments(),
          models.TaxConfiguration.countDocuments(),
        ]);
        const docs = await models.FinanceEntry.find()
          .sort({ createdAt: -1 })
          .limit(50)
          .lean();
        return table(
          `${entryTotal} finance entries / ${taxTotal} tax configs`,
          ["Label", "Type", "Currency", "Estimate", "Transaction"],
          docs.map((doc) => ({
            key: String(doc._id),
            cells: [
              doc.label,
              doc.type,
              doc.currency,
              doc.isEstimate ? "yes" : "no",
              String(doc.transactionId),
            ],
          })),
          "No finance entries yet.",
        );
      }
      case "ai": {
        const total = await models.AiKnowledgeEntry.countDocuments();
        const docs = await models.AiKnowledgeEntry.find()
          .sort({ updatedAt: -1 })
          .limit(50)
          .lean();
        return table(
          `${total} knowledge entries`,
          ["Title", "Source", "Published", "Locale", "Tags"],
          docs.map((doc) => ({
            key: String(doc._id),
            cells: [
              doc.title,
              doc.sourceType,
              doc.published ? "yes" : "no",
              doc.locale,
              (doc.tags ?? []).join(", ") || "—",
            ],
          })),
          "No AI knowledge entries yet.",
        );
      }
      case "integrations": {
        const total = await models.IntegrationConfiguration.countDocuments();
        const docs = await models.IntegrationConfiguration.find()
          .sort({ key: 1 })
          .limit(50)
          .lean();
        return table(
          `${total} integration records`,
          ["Key", "Provider", "Configured", "Status", "Message"],
          docs.map((doc) => ({
            key: doc.key,
            cells: [
              doc.key,
              doc.provider,
              doc.configured ? "yes" : "no",
              doc.status,
              doc.statusMessage || "—",
            ],
          })),
          "No integration records found.",
        );
      }
      case "terms": {
        const total = await models.TermsDocument.countDocuments();
        const docs = await models.TermsDocument.find()
          .sort({ key: 1, version: -1 })
          .limit(50)
          .lean();
        return table(
          `${total} documents`,
          ["Key", "Title", "Version", "Locale", "Effective"],
          docs.map((doc) => ({
            key: `${doc.key}-${doc.version}-${doc.locale}`,
            cells: [
              doc.key,
              doc.title,
              String(doc.version),
              doc.locale,
              dateCell(doc.effectiveAt),
            ],
          })),
          "No terms documents yet.",
        );
      }
      case "audit": {
        const total = await models.AuditEvent.countDocuments();
        const docs = await models.AuditEvent.find().sort({ createdAt: -1 }).limit(50).lean();
        return table(
          `${total} events (showing latest 50)`,
          ["Action", "Target", "Actor", "When"],
          docs.map((doc) => ({
            key: String(doc._id),
            cells: [
              doc.action,
              doc.targetType ? `${doc.targetType}:${String(doc.targetId ?? "—")}` : "—",
              doc.actorUserId ? String(doc.actorUserId) : "—",
              dateCell(doc.createdAt),
            ],
          })),
          "No audit events recorded yet.",
        );
      }
      default:
        return {
          countLabel: "MongoDB connected",
          columns: ["Note"],
          rows: [],
          emptyMessage: EMPTY_DEFAULT,
        };
    }
  } catch (error) {
    console.error("[admin/section-data]", section, error);
    return {
      countLabel: "MongoDB connected (query error — check server logs)",
      columns: ["Status"],
      rows: [],
      emptyMessage: "Unable to load records for this section.",
    };
  }
}
