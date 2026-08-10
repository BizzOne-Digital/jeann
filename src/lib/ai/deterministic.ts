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
  sanitizeUserInput,
} from "@/lib/ai/security";

interface KnowledgeSnippet {
  title: string;
  content: string;
  tags: string[];
}

const APPROVED_FAQ: KnowledgeSnippet[] = [
  {
    title: "About Finekarts",
    content:
      "Finekarts Incorporated is a global agricultural commodity trader sourcing bulk commodities from verified suppliers for qualified buyers.",
    tags: ["about", "company"],
  },
  {
    title: "How to request pricing",
    content:
      "Submit a purchase request (RFQ) with product, quantity, destination, and incoterm. Our trade desk reviews requirements and responds with formal terms.",
    tags: ["pricing", "rfq", "quote"],
  },
  {
    title: "Minimum order",
    content:
      "Minimum order quantities vary by product and origin. Specific MOQ details appear on each product page or are confirmed during RFQ review.",
    tags: ["moq", "minimum", "order"],
  },
  {
    title: "Compliance and documentation",
    content:
      "Transactions may require CIS profiles, contracts, inspection certificates, and phytosanitary documents depending on commodity and destination.",
    tags: ["compliance", "documents", "cis"],
  },
  {
    title: "Contact trade desk",
    content:
      "Use the contact form or book a call with our trade team for account setup, supplier onboarding, or complex logistics questions.",
    tags: ["contact", "support", "booking"],
  },
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);
}

function scoreSnippet(query: string, snippet: KnowledgeSnippet): number {
  const qTokens = new Set(tokenize(query));
  let score = 0;
  for (const tag of snippet.tags) {
    if (qTokens.has(tag) || query.toLowerCase().includes(tag)) score += 3;
  }
  for (const token of tokenize(snippet.title + " " + snippet.content)) {
    if (qTokens.has(token)) score += 1;
  }
  return score;
}

function lastUserMessage(messages: AssistantMessage[]): string {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === "user") return messages[i].content;
  }
  return "";
}

function wantsQuote(text: string): boolean {
  return /\b(price|pricing|quote|cost|rate|how much)\b/i.test(text);
}

function wantsHuman(text: string): boolean {
  return /\b(speak|talk|human|agent|call|representative|trade desk)\b/i.test(text);
}

export class DeterministicAssistantProvider implements AssistantProvider {
  readonly name = "deterministic";

  async chat(messages: AssistantMessage[], context?: AssistantContext): Promise<AssistantReply> {
    void context;
    const raw = lastUserMessage(messages);
    const query = sanitizeUserInput(raw);

    if (detectPromptInjection(query)) {
      return {
        message:
          "I can only answer general questions about Finekarts products and processes using approved information. " +
          NO_BINDING_QUOTE_NOTICE,
        sources: [],
        escalated: true,
        escalationType: "contact",
      };
    }

    if (wantsHuman(query)) {
      return {
        message:
          "I can connect you with our trade desk. Please use the booking form or contact page to schedule a conversation.",
        sources: ["Contact trade desk"],
        escalated: true,
        escalationType: "booking",
      };
    }

    if (wantsQuote(query)) {
      return {
        message: `${NO_BINDING_QUOTE_NOTICE} ${AI_DISCLAIMER}`,
        sources: ["How to request pricing"],
        escalated: true,
        escalationType: "rfq",
      };
    }

    const ranked = APPROVED_FAQ.map((s) => ({ s, score: scoreSnippet(query, s) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score);

    if (!ranked.length) {
      return {
        message:
          "I do not have an approved answer for that question. Please submit an RFQ or contact our team for assistance. " +
          AI_DISCLAIMER,
        sources: [],
        escalated: true,
        escalationType: "rfq",
      };
    }

    const top = ranked.slice(0, 2).map((r) => r.s);
    const body = top.map((s) => s.content).join("\n\n");

    return {
      message: `${body}\n\n${AI_DISCLAIMER}`,
      sources: top.map((s) => s.title),
      escalated: false,
    };
  }
}
