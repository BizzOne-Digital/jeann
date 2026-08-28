import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";
import {
  assertNotProductionSeed,
  validateProductionEnvironment,
  isTestOtpAllowed,
  isDebugModeEnabled,
  ProductionGuardError,
} from "@/lib/security/production-guards";
import { sanitizeSecurityMetadata } from "@/lib/security/security-service";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Phase 9 production guards", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("blocks seed scripts in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(() => assertNotProductionSeed("seed-phase9")).toThrow(ProductionGuardError);
  });

  it("disallows test OTP in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(isTestOtpAllowed()).toBe(false);
  });

  it("disables debug mode in production", () => {
    vi.stubEnv("NODE_ENV", "production");
    expect(isDebugModeEnabled()).toBe(false);
  });

  it("flags production misconfiguration", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("INTEGRATIONS_USE_MOCKS", "true");
    vi.stubEnv("SESSION_SECRET", "short");
    const result = validateProductionEnvironment();
    expect(result.ok).toBe(false);
    expect(result.blockers.length).toBeGreaterThan(0);
  });
});

describe("Phase 9 mock provider blocking", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("INTEGRATIONS_USE_MOCKS", "false");
    vi.stubEnv("SESSION_SECRET", "ci-test-session-secret-minimum-32-chars");
    vi.stubEnv("GEMINI_API_KEY", "");
    vi.stubEnv("GEMINI_ENABLED", "false");
    vi.stubEnv("VESPER_API_KEY", "");
    vi.stubEnv("VESPER_ENABLED", "false");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("does not use development mock AI in production", async () => {
    const { allowDevelopmentMock } = await import("@/lib/integrations/env");
    const { getAIProvider } = await import("@/lib/integrations/providers/ai-registry");
    expect(allowDevelopmentMock()).toBe(false);
    const provider = getAIProvider();
    expect(provider.adapterCode).not.toBe("development_mock_ai");
  });

  it("does not use development mock market data in production", async () => {
    const { getMarketDataProvider } = await import(
      "@/lib/integrations/providers/market-data-registry"
    );
    const provider = getMarketDataProvider();
    expect(provider.adapterCode).not.toBe("development_mock_vesper");
  });

  it("does not use development mock screening in production", async () => {
    const { getScreeningProvider } = await import(
      "@/lib/integrations/providers/screening-registry"
    );
    const provider = getScreeningProvider();
    expect(provider.adapterCode).not.toBe("development_mock_screening");
  });

  it("does not use development mock e-signature in production", async () => {
    const { getESignatureProvider } = await import(
      "@/lib/integrations/providers/esignature-registry"
    );
    const provider = getESignatureProvider();
    expect(provider.adapterCode).not.toBe("development_mock_esignature");
  });
});

describe("Phase 9 security metadata sanitization", () => {
  it("redacts sensitive keys", () => {
    const out = sanitizeSecurityMetadata({
      password: "secret123",
      otp: "123456",
      safeField: "ok",
    });
    expect(out?.password).toBe("[redacted]");
    expect(out?.otp).toBe("[redacted]");
    expect(out?.safeField).toBe("ok");
  });
});

describe("Phase 9 security headers config", () => {
  it("next.config includes CSP and frame denial", () => {
    const configPath = resolve(process.cwd(), "next.config.ts");
    const contents = readFileSync(configPath, "utf8");
    expect(contents).toContain("Content-Security-Policy");
    expect(contents).toContain("X-Frame-Options");
    expect(contents).toContain("X-Content-Type-Options");
  });
});
