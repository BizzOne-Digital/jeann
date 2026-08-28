import { getEnv } from "@/lib/config/env";
import { tryConnectMongo, isMongoConfigured } from "@/lib/db/mongoose";
import { DEFAULT_INTEGRATION_FEATURE_FLAGS } from "@/models/IntegrationFeatureFlag";

export async function isFeatureEnabled(
  key: string,
  context?: { roles?: string[]; organizationId?: string },
): Promise<boolean> {
  const env = getEnv();
  if (!isMongoConfigured()) {
    const def = DEFAULT_INTEGRATION_FEATURE_FLAGS.find((f) => f.key === key);
    return def?.enabled ?? false;
  }

  await tryConnectMongo();
  const { IntegrationFeatureFlag } = await import("@/models");
  const flag = await IntegrationFeatureFlag.findOne({ key }).lean();
  if (!flag) {
    const def = DEFAULT_INTEGRATION_FEATURE_FLAGS.find((f) => f.key === key);
    return def?.enabled ?? false;
  }

  if (!flag.enabled) return false;
  if (flag.environments.length && !flag.environments.includes(env.NODE_ENV)) return false;

    if (flag.allowedRoles?.length && context?.roles) {
      const allowed = flag.allowedRoles.some((r: string) => context.roles!.includes(r));
    if (!allowed) return false;
  }

  return true;
}

export async function seedDefaultFeatureFlags(): Promise<void> {
  if (!isMongoConfigured()) return;
  await tryConnectMongo();
  const { IntegrationFeatureFlag } = await import("@/models");
  for (const f of DEFAULT_INTEGRATION_FEATURE_FLAGS) {
    await IntegrationFeatureFlag.findOneAndUpdate(
      { key: f.key },
      {
        key: f.key,
        label: f.label,
        enabled: f.enabled,
        environments: f.environments,
        organizationScoped: false,
      },
      { upsert: true },
    );
  }
}

export async function listFeatureFlags() {
  await tryConnectMongo();
  const { IntegrationFeatureFlag } = await import("@/models");
  return IntegrationFeatureFlag.find().sort({ key: 1 }).lean();
}

export async function setFeatureFlag(
  key: string,
  enabled: boolean,
  actorUserId: string,
): Promise<void> {
  await tryConnectMongo();
  const { IntegrationFeatureFlag } = await import("@/models");
  const { writeAuditEvent } = await import("@/lib/audit/log");
  await IntegrationFeatureFlag.findOneAndUpdate(
    { key },
    { enabled, updatedByUserId: actorUserId },
    { upsert: true },
  );
  await writeAuditEvent({
    action: "integration.feature_flag_changed",
    targetType: "integration_feature_flag",
    targetId: key,
    actorUserId,
    result: "success",
    metadata: { enabled },
  });
}
