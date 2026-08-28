import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().optional(),
  MONGODB_DB_NAME: z.string().default("finekarts"),
  APP_URL: z.string().url().default("http://localhost:3000"),
  SESSION_SECRET: z.string().min(32).optional(),
  AUTH_SECRET: z.string().min(32).optional(),
  INITIAL_ADMIN_EMAIL: z.string().email().optional(),
  INITIAL_ADMIN_PASSWORD: z.string().min(12).optional(),
  INITIAL_ADMIN_NAME: z.string().optional(),
  ADMIN_NOTIFY_EMAIL: z.string().email().optional(),
  EMAIL_PROVIDER: z.enum(["none", "console", "resend", "smtp"]).default("console"),
  EMAIL_FROM: z.string().optional(),
  EMAIL_API_KEY: z.string().optional(),
  SMS_PROVIDER: z.enum(["none", "console", "twilio"]).default("none"),
  SMS_API_KEY: z.string().optional(),
  STORAGE_PROVIDER: z.enum(["local", "s3"]).default("local"),
  STORAGE_BUCKET: z.string().optional(),
  STORAGE_REGION: z.string().optional(),
  STORAGE_ENDPOINT: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  MALWARE_SCAN_PROVIDER: z.enum(["none", "console"]).default("none"),
  GEMINI_API_KEY: z.string().optional(),
  GEMINI_MODEL: z.string().default("gemini-2.0-flash"),
  GEMINI_ENABLED: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  GROQ_API_KEY: z.string().optional(),
  GROQ_MODEL: z.string().default("llama-3.3-70b-versatile"),
  GROQ_ENABLED: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  CRM_PROVIDER: z.enum(["none", "internal"]).default("internal"),
  NEWSLETTER_PROVIDER: z.enum(["none", "internal"]).default("internal"),
  SHIPMENT_TRACKING_PROVIDER: z.enum(["none", "manual"]).default("manual"),
  SHIPMENT_WEBHOOK_SECRET: z.string().optional(),
  FEATURE_SUPPLIER_PORTAL: z
    .string()
    .optional()
    .transform((v) => v !== "false"),
  FEATURE_BANKING_PORTAL: z
    .string()
    .optional()
    .transform((v) => v !== "false"),
  FEATURE_AI_ASSISTANT: z
    .string()
    .optional()
    .transform((v) => v !== "false"),
  FEATURE_FINANCE_MODULE: z
    .string()
    .optional()
    .transform((v) => v !== "false"),
  FEATURE_DEMO_DATA: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  INTEGRATIONS_USE_MOCKS: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  VESPER_API_KEY: z.string().optional(),
  VESPER_ENABLED: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  ESIGNATURE_PROVIDER: z.string().optional(),
  ESIGNATURE_API_KEY: z.string().optional(),
  ESIGNATURE_WEBHOOK_SECRET: z.string().optional(),
  SCREENING_PROVIDER: z.string().optional(),
  ACCOUNTING_PROVIDER: z.string().optional(),
  ACCOUNTING_PROVIDER_CONFIGURED: z
    .string()
    .optional()
    .transform((v) => v === "true"),
  REQUIRE_PHONE_OTP: z
    .string()
    .optional()
    .transform((v) => v === "true"),
});

export type AppEnv = z.infer<typeof envSchema>;

let cached: AppEnv | null = null;

export function getEnv(): AppEnv {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const message = parsed.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${message}`);
  }
  cached = parsed.data;
  return cached;
}

export function getSessionSecret(): string {
  const env = getEnv();
  const secret = env.SESSION_SECRET || env.AUTH_SECRET;
  if (!secret) {
    if (env.NODE_ENV === "production") {
      throw new Error("SESSION_SECRET (min 32 chars) is required in production");
    }
    return "dev-only-finekarts-session-secret-change-me!!";
  }
  return secret;
}

export function integrationStatus() {
  const env = getEnv();
  return {
    mongodb: Boolean(env.MONGODB_URI),
    email: env.EMAIL_PROVIDER !== "none",
    sms: env.SMS_PROVIDER !== "none",
    storage: env.STORAGE_PROVIDER,
    malwareScan: env.MALWARE_SCAN_PROVIDER !== "none",
    gemini: Boolean(env.GEMINI_API_KEY && env.GEMINI_ENABLED),
    groq: Boolean(env.GROQ_API_KEY && env.GROQ_ENABLED),
    crm: env.CRM_PROVIDER,
    newsletter: env.NEWSLETTER_PROVIDER,
    shipmentTracking: env.SHIPMENT_TRACKING_PROVIDER,
  };
}
