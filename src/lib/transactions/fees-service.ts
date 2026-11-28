import { Types } from "mongoose";
import { tryConnectMongo } from "@/lib/db/mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import type { TransactionFeeKind, TransactionFeeStatus } from "@/models/TransactionFee";

/**
 * The fees and payments of one transaction (client, 2026-11-28): LC fee, banking fee, amendment fee, MT101 deposit and the
 * payment to the supplier. Staff only. Nothing is final: any line can be changed or removed at any time.
 */

export const FEE_KIND_LABEL: Record<TransactionFeeKind, string> = {
  lc_fee: "LC fee",
  banking_fee: "Banking fee",
  amendment_fee: "Amendment fee",
  mt101_deposit: "MT101 deposit",
  supplier_payment: "Supplier payment",
  other: "Other",
};

/** The payment to the supplier belongs to the supplier order (stage 2) only. */
export function kindAllowedOnSide(kind: TransactionFeeKind, side: "buyer" | "supplier"): boolean {
  if (kind === "supplier_payment") return side === "supplier";
  return true;
}

export type FeeView = {
  id: string;
  kind: TransactionFeeKind;
  kindLabel: string;
  description: string;
  currency: string;
  amount: number;
  status: TransactionFeeStatus;
  dueDate: string | null;
  paidAt: string | null;
  reference: string;
  notes: string;
  createdAt: string;
};

export type FeeTotals = { currency: string; due: number; paid: number; waived: number };

function view(d: {
  _id: unknown;
  kind: TransactionFeeKind;
  description?: string | null;
  currency: string;
  amount: number;
  status: TransactionFeeStatus;
  dueDate?: Date | null;
  paidAt?: Date | null;
  reference?: string | null;
  notes?: string | null;
  createdAt?: Date | string;
}): FeeView {
  return {
    id: String(d._id),
    kind: d.kind,
    kindLabel: FEE_KIND_LABEL[d.kind] ?? d.kind,
    description: d.description ?? "",
    currency: d.currency,
    amount: d.amount,
    status: d.status,
    dueDate: d.dueDate ? new Date(d.dueDate).toISOString() : null,
    paidAt: d.paidAt ? new Date(d.paidAt).toISOString() : null,
    reference: d.reference ?? "",
    notes: d.notes ?? "",
    createdAt: d.createdAt ? new Date(d.createdAt).toISOString() : "",
  };
}

/** Totals per currency: what is still due, what is paid and what was waived. Currencies are never added together. */
export function summarizeFees(fees: Pick<FeeView, "currency" | "amount" | "status">[]): FeeTotals[] {
  const map = new Map<string, FeeTotals>();
  for (const f of fees) {
    const row = map.get(f.currency) ?? { currency: f.currency, due: 0, paid: 0, waived: 0 };
    row[f.status] += f.amount;
    map.set(f.currency, row);
  }
  return [...map.values()].map((r) => ({
    currency: r.currency,
    due: Math.round(r.due * 100) / 100,
    paid: Math.round(r.paid * 100) / 100,
    waived: Math.round(r.waived * 100) / 100,
  }));
}

export async function listFees(transactionId: string): Promise<{ items: FeeView[]; totals: FeeTotals[] }> {
  await tryConnectMongo();
  const { TransactionFee } = await import("@/models");
  const rows = await TransactionFee.find({ transactionId: new Types.ObjectId(transactionId), deletedAt: null })
    .sort({ createdAt: 1 })
    .lean();
  const items = rows.map(view);
  return { items, totals: summarizeFees(items) };
}

export type FeeInput = {
  kind: TransactionFeeKind;
  description?: string;
  currency: string;
  amount: number;
  status?: TransactionFeeStatus;
  dueDate?: string | null;
  reference?: string;
  notes?: string;
};

export async function addFee(input: {
  transaction: { _id: Types.ObjectId; organizationId: Types.ObjectId };
  fee: FeeInput;
  userId: string;
}): Promise<FeeView> {
  await tryConnectMongo();
  const { TransactionFee } = await import("@/models");
  const status = input.fee.status ?? "due";
  const row = await TransactionFee.create({
    transactionId: input.transaction._id,
    organizationId: input.transaction.organizationId,
    kind: input.fee.kind,
    description: input.fee.description || undefined,
    currency: input.fee.currency,
    amount: input.fee.amount,
    status,
    dueDate: input.fee.dueDate ? new Date(input.fee.dueDate) : undefined,
    paidAt: status === "paid" ? new Date() : undefined,
    reference: input.fee.reference || undefined,
    notes: input.fee.notes || undefined,
    createdByUserId: new Types.ObjectId(input.userId),
  });
  await writeAuditEvent({
    action: "transaction_fee.added",
    targetType: "transaction",
    targetId: String(input.transaction._id),
    actorUserId: input.userId,
    metadata: { kind: input.fee.kind, amount: input.fee.amount, currency: input.fee.currency },
  });
  return view(row);
}

export async function updateFee(input: {
  transactionId: string;
  feeId: string;
  patch: Partial<FeeInput>;
  userId: string;
}): Promise<FeeView | null> {
  await tryConnectMongo();
  const { TransactionFee } = await import("@/models");
  const row = await TransactionFee.findOne({
    _id: input.feeId,
    transactionId: new Types.ObjectId(input.transactionId),
    deletedAt: null,
  });
  if (!row) return null;
  const p = input.patch;
  if (p.kind !== undefined) row.kind = p.kind;
  if (p.description !== undefined) row.description = p.description || undefined;
  if (p.currency !== undefined) row.currency = p.currency;
  if (p.amount !== undefined) row.amount = p.amount;
  if (p.dueDate !== undefined) row.dueDate = p.dueDate ? new Date(p.dueDate) : undefined;
  if (p.reference !== undefined) row.reference = p.reference || undefined;
  if (p.notes !== undefined) row.notes = p.notes || undefined;
  if (p.status !== undefined && p.status !== row.status) {
    row.status = p.status;
    row.paidAt = p.status === "paid" ? new Date() : undefined;
  }
  await row.save();
  await writeAuditEvent({
    action: "transaction_fee.updated",
    targetType: "transaction",
    targetId: input.transactionId,
    actorUserId: input.userId,
    metadata: { feeId: input.feeId, ...p },
  });
  return view(row);
}

export async function removeFee(input: { transactionId: string; feeId: string; userId: string }): Promise<boolean> {
  await tryConnectMongo();
  const { TransactionFee } = await import("@/models");
  const row = await TransactionFee.findOne({
    _id: input.feeId,
    transactionId: new Types.ObjectId(input.transactionId),
    deletedAt: null,
  });
  if (!row) return false;
  row.deletedAt = new Date();
  await row.save();
  await writeAuditEvent({
    action: "transaction_fee.removed",
    targetType: "transaction",
    targetId: input.transactionId,
    actorUserId: input.userId,
    metadata: { feeId: input.feeId, kind: row.kind },
  });
  return true;
}
