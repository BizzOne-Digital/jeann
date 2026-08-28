import { Types } from "mongoose";
import { writeAuditEvent } from "@/lib/audit/log";
import { tryConnectMongo } from "@/lib/db/mongoose";

export async function closeFinancialPeriod(input: {
  periodType: "month" | "quarter" | "year";
  startDate: string;
  endDate: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { FinancialPeriod, FinancialEntry } = await import("@/models");

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  const unposted = await FinancialEntry.countDocuments({
    entryDate: { $gte: start, $lte: end },
    status: { $in: ["draft", "approved"] },
  });
  if (unposted > 0) throw new Error("unposted_entries_remain");

  const existing = await FinancialPeriod.findOne({
    startDate: start,
    endDate: end,
    status: "closed",
  }).lean();
  if (existing) throw new Error("already_closed");

  const period = await FinancialPeriod.create({
    periodType: input.periodType,
    label: `${input.periodType}:${input.startDate}:${input.endDate}`,
    startDate: start,
    endDate: end,
    status: "closed",
    closedByUserId: new Types.ObjectId(input.actorUserId),
    closedAt: new Date(),
  });

  await writeAuditEvent({
    action: "financial_period.closed",
    targetType: "financial_period",
    targetId: String(period._id),
    actorUserId: input.actorUserId,
    result: "success",
  });

  return period;
}

export async function reopenFinancialPeriod(input: {
  periodId: string;
  reason: string;
  actorUserId: string;
}) {
  await tryConnectMongo();
  const { FinancialPeriod } = await import("@/models");
  const period = await FinancialPeriod.findById(input.periodId);
  if (!period || period.status !== "closed") throw new Error("not_closed");

  period.status = "reopened";
  period.reopenedByUserId = new Types.ObjectId(input.actorUserId);
  period.reopenReason = input.reason;
  await period.save();

  await writeAuditEvent({
    action: "financial_period.reopened",
    targetType: "financial_period",
    targetId: String(period._id),
    actorUserId: input.actorUserId,
    result: "success",
    metadata: { reason: input.reason },
  });

  return period;
}
