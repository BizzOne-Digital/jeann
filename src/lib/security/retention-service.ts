import {
  RetentionPolicy,
  DEFAULT_RETENTION_POLICIES,
} from "@/models/RetentionPolicy";
import { connectMongo } from "@/lib/db/mongoose";

export async function seedDefaultRetentionPolicies(
  approvedByUserId?: string,
): Promise<number> {
  await connectMongo();
  let created = 0;
  for (const policy of DEFAULT_RETENTION_POLICIES) {
    const exists = await RetentionPolicy.findOne({
      dataCategory: policy.dataCategory,
      active: true,
    });
    if (exists) continue;
    await RetentionPolicy.create({
      ...policy,
      effectiveFrom: new Date(),
      active: true,
      version: 1,
      approvedByUserId,
    });
    created += 1;
  }
  return created;
}

export async function getActiveRetentionDays(dataCategory: string): Promise<number | null> {
  await connectMongo();
  const policy = await RetentionPolicy.findOne({
    dataCategory,
    active: true,
  })
    .sort({ version: -1 })
    .lean();
  return policy?.retentionDays ?? null;
}
