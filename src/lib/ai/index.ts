import { getEnv } from "@/lib/config/env";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";
import { DeterministicAssistantProvider } from "@/lib/ai/deterministic";
import { GeminiAssistantProvider, isGeminiAvailable } from "@/lib/ai/gemini";
import { GroqAssistantProvider, isGroqAvailable } from "@/lib/ai/groq";
import type { AssistantProvider } from "@/lib/ai/types";

let cached: AssistantProvider | null = null;

async function readSiteAiKillSwitch(): Promise<boolean> {
  if (!isMongoConfigured()) return false;
  try {
    await tryConnectMongo();
    const { SiteSettings } = await import("@/models/SiteSettings");
    const settings = await SiteSettings.findOne({ key: "default" }).lean();
    return settings?.aiAssistantEnabled === false;
  } catch {
    return false;
  }
}

/**
 * Prefer Groq when configured, then Gemini, else deterministic FAQ assistant.
 */
export async function getAssistantProvider(): Promise<AssistantProvider> {
  if (cached) return cached;

  const env = getEnv();
  const killed = await readSiteAiKillSwitch();

  if (!killed && env.FEATURE_AI_ASSISTANT) {
    if (isGroqAvailable()) {
      cached = new GroqAssistantProvider();
      return cached;
    }
    if (isGeminiAvailable()) {
      cached = new GeminiAssistantProvider();
      return cached;
    }
  }

  cached = new DeterministicAssistantProvider();
  return cached;
}

export function resetAssistantProviderCache(): void {
  cached = null;
}

export type { AssistantProvider, AssistantMessage, AssistantReply } from "@/lib/ai/types";
