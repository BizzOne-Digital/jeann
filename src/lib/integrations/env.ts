import { getEnv } from "@/lib/config/env";

export function isProductionEnvironment(): boolean {
  return getEnv().NODE_ENV === "production";
}

export function allowDevelopmentMock(): boolean {
  if (isProductionEnvironment()) return false;
  const env = getEnv();
  return env.INTEGRATIONS_USE_MOCKS || env.NODE_ENV !== "production";
}

export function providerConfigured(envFlag: boolean | undefined): boolean {
  return Boolean(envFlag);
}
