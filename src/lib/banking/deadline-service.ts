import { tryConnectMongo, isMongoConfigured } from "@/lib/db/mongoose";

const REMINDER_DAYS = [14, 7, 3, 1, 0];

export async function evaluateDeadlineStatuses(): Promise<number> {
  if (!isMongoConfigured()) return 0;
  await tryConnectMongo();
  const { BankingDeadline } = await import("@/models");
  const now = new Date();
  const deadlines = await BankingDeadline.find({
    status: { $in: ["upcoming", "due_soon", "due_today", "overdue"] },
  });

  let updated = 0;
  for (const d of deadlines) {
    const due = new Date(d.dueAt);
    const msUntil = due.getTime() - now.getTime();
    const daysUntil = msUntil / (1000 * 60 * 60 * 24);

    let newStatus = d.status;
    if (daysUntil < 0) newStatus = "overdue";
    else if (daysUntil < 1) newStatus = "due_today";
    else if (daysUntil <= 3) newStatus = "due_soon";
    else newStatus = "upcoming";

    if (newStatus !== d.status) {
      d.status = newStatus;
      await d.save();
      updated++;
    }
  }
  return updated;
}

export function reminderOffsetsForDeadlineType(): number[] {
  return REMINDER_DAYS;
}

/** Job-compatible: returns deadlines needing reminder notification. */
export async function listDeadlinesNeedingReminder(): Promise<
  Array<{ id: string; bankingInstrumentId: string; deadlineType: string; dueAt: Date; status: string }>
> {
  if (!isMongoConfigured()) return [];
  await tryConnectMongo();
  const { BankingDeadline } = await import("@/models");
  const now = new Date();
  const items = await BankingDeadline.find({
    status: { $in: ["due_soon", "due_today", "overdue"] },
    dueAt: { $lte: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) },
  }).lean();

  return items.map((d) => ({
    id: String(d._id),
    bankingInstrumentId: String(d.bankingInstrumentId),
    deadlineType: d.deadlineType,
    dueAt: d.dueAt,
    status: d.status,
  }));
}
