import { getEnv, integrationStatus } from "@/lib/config/env";
import type {
  AssistantContext,
  AssistantMessage,
  AssistantProvider,
  AssistantReply,
} from "@/lib/ai/types";
import {
  AI_DISCLAIMER,
  detectPromptInjection,
  NO_BINDING_QUOTE_NOTICE,
  redactSensitive,
  sanitizeUserInput,
} from "@/lib/ai/security";
import { buildSystemPrompt, retrieveApprovedKnowledge } from "@/lib/ai/knowledge";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";

export class GroqAssistantProvider implements AssistantProvider {
  readonly name = "groq";

  async chat(messages: AssistantMessage[], context?: AssistantContext): Promise<AssistantReply> {
    const env = getEnv();
    if (!env.GROQ_API_KEY || !env.GROQ_ENABLED) {
      throw new Error("Groq assistant is not enabled");
    }

    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const query = sanitizeUserInput(lastUser?.content ?? "");

    if (!query) {
      return {
        message: "Please ask a short question about Finekarts products or trade process.",
        sources: [],
        escalated: false,
      };
    }

    if (detectPromptInjection(query)) {
      return {
        message: `${NO_BINDING_QUOTE_NOTICE} For opportunities, submit a purchase request or contact the trade desk.`,
        sources: [],
        escalated: true,
        escalationType: "rfq",
      };
    }

    const entries = await retrieveApprovedKnowledge(query, context?.locale ?? "en");
    const system = buildSystemPrompt(entries);

    const history = messages
      .filter((m) => m.role === "user" || m.role === "assistant")
      .slice(-6)
      .map((m) => ({
        role: m.role as "user" | "assistant",
        content: sanitizeUserInput(m.content, 1500),
      }));

    const response = await fetch(GROQ_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: env.GROQ_MODEL,
        temperature: 0.2,
        max_tokens: 600,
        messages: [
          { role: "system", content: system },
          ...history,
          // Ensure latest user turn is present even if history was empty
          ...(history.at(-1)?.role === "user"
            ? []
            : [{ role: "user" as const, content: query }]),
        ],
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      throw new Error(`Groq API error: ${response.status} ${errText.slice(0, 200)}`);
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const text = data.choices?.[0]?.message?.content?.trim() || "Unable to generate a response.";
    const safe = redactSensitive(text);

    return {
      message: `${safe}\n\n${AI_DISCLAIMER}`,
      sources: entries.map((e) => e.title),
      escalated: entries.length === 0,
      escalationType: entries.length === 0 ? "rfq" : undefined,
    };
  }
}

export function isGroqAvailable(): boolean {
  return integrationStatus().groq;
}
