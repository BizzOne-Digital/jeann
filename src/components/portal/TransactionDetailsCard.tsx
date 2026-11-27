import { BUYER_TERMS_FIELDS } from "@/lib/transactions/step-rules";

const LABELS: Record<string, string> = {
  productName: "Product",
  productOrigin: "Origin",
  quantity: "Quantity",
  quantityTolerance: "Quantity tolerance",
  unitPrice: "Price per unit",
  totalEstimatedValue: "Total value",
  incoterm: "Incoterm",
  namedPortPlace: "Named port or place",
  loadingPort: "Loading port",
  destinationPort: "Destination port",
  shipmentSchedule: "Shipment schedule",
  packaging: "Packaging",
  inspectionCompany: "Inspection",
  inspectionLocation: "Inspection location",
  paymentProposal: "Payment terms",
  bankingInstrumentProposal: "Banking instrument",
  offerValidity: "Offer valid for",
};

// Only fields that are safe to show every party of the transaction. Internal prices and costs are never listed here.
const ORDER = [
  "productName", "productOrigin", "quantity", "quantityTolerance", "unitPrice", "totalEstimatedValue", "incoterm",
  "namedPortPlace", "loadingPort", "destinationPort", "shipmentSchedule", "packaging", "inspectionCompany",
  "inspectionLocation", "paymentProposal", "bankingInstrumentProposal", "offerValidity",
] as const;

function text(value: unknown): string {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

type Props = {
  transaction: {
    transactionNumber: string;
    workflowLabel: string;
    createdAt?: string;
    closedAt?: string | null;
    lcDeadlineHours?: number;
    lcDeadlineBusinessHours?: boolean;
  };
  terms?: Record<string, unknown> | null;
  /** The LC deadline only belongs to a buyer order. */
  showLcDeadline: boolean;
};

/** Every detail of the transaction in one place: open the transaction by its number and it is all here. */
export function TransactionDetailsCard({ transaction, terms, showLcDeadline }: Props) {
  const allowed = new Set<string>(BUYER_TERMS_FIELDS);
  const rows: { label: string; value: string }[] = [
    { label: "Transaction number", value: transaction.transactionNumber },
    { label: "Where it is now", value: transaction.workflowLabel },
  ];
  if (transaction.createdAt) rows.push({ label: "Started", value: new Date(transaction.createdAt).toLocaleDateString() });
  if (transaction.closedAt) rows.push({ label: "Closed", value: new Date(transaction.closedAt).toLocaleDateString() });

  const get = (k: string) => (terms && allowed.has(k) ? text(terms[k]) : "");
  for (const key of ORDER) {
    let value = get(key);
    if (!value) continue;
    if (key === "quantity") value = [value, get("quantityUnit")].filter(Boolean).join(" ");
    if (key === "unitPrice" || key === "totalEstimatedValue") value = [get("currency"), value].filter(Boolean).join(" ");
    rows.push({ label: LABELS[key] ?? key, value });
  }
  if (showLcDeadline && transaction.lcDeadlineHours) {
    rows.push({
      label: "LC deadline",
      value: `${transaction.lcDeadlineHours}${transaction.lcDeadlineBusinessHours ? " business" : ""} hours, as agreed in the PSA`,
    });
  }

  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-5">
      <h2 className="font-semibold text-[var(--navy)]">Transaction details</h2>
      <dl className="mt-3 grid gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-col">
            <dt className="text-xs text-[var(--stone)]">{r.label}</dt>
            <dd className="font-medium text-[var(--navy)]">{r.value}</dd>
          </div>
        ))}
      </dl>
      {!terms ? (
        <p className="mt-3 text-xs text-[var(--stone)]">
          The commercial terms (price, ports, payment) appear here once Finekarts has approved them.
        </p>
      ) : null}
    </section>
  );
}
