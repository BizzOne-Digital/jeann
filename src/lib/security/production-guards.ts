import { getEnv } from "@/lib/config/env";

export class ProductionGuardError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductionGuardError";
  }
}

/** Throws if destructive seed or dev-only scripts run in production. */
export function assertNotProductionSeed(operation: string): void {
  if (getEnv().NODE_ENV === "production") {
    throw new ProductionGuardError(
      `${operation} is disabled in production. Use approved deployment procedures only.`,
    );
  }
}

/** Rejects mock integration providers in production regardless of env flags. */
export function assertProductionSafeProvider(providerKey: string, isMock: boolean): void {
  if (isProductionEnvironment() && isMock) {
    throw new ProductionGuardError(
      `Mock provider "${providerKey}" cannot run in production.`,
    );
  }
}

export function isProductionEnvironment(): boolean {
  return getEnv().NODE_ENV === "production";
}

/** Production must not accept test OTP codes or bypass verification. */
export function isTestOtpAllowed(): boolean {
  if (isProductionEnvironment()) return false;
  return getEnv().NODE_ENV === "development" || getEnv().INTEGRATIONS_USE_MOCKS;
}

/** Debug routes and verbose error stacks must not be exposed in production. */
export function isDebugModeEnabled(): boolean {
  if (isProductionEnvironment()) return false;
  return getEnv().NODE_ENV === "development";
}

export function validateProductionEnvironment(): {
  ok: boolean;
  blockers: string[];
} {
  const env = getEnv();
  const blockers: string[] = [];

  if (env.NODE_ENV === "production") {
    const secret = env.SESSION_SECRET || env.AUTH_SECRET;
    if (!secret || secret.length < 32) {
      blockers.push("SESSION_SECRET must be at least 32 characters in production.");
    }
    if (env.INTEGRATIONS_USE_MOCKS) {
      blockers.push("INTEGRATIONS_USE_MOCKS must be false in production.");
    }
    if (!env.MONGODB_URI) {
      blockers.push("MONGODB_URI is required in production.");
    }
  }

  return { ok: blockers.length === 0, blockers };
}
