import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getAssistantProvider } from "@/lib/ai";
import { checkRateLimit } from "@/lib/auth/rate-limit";

const requestSchema = z.object({
  message: z.string().min(2).max(800),
  consentToContact: z.boolean().optional(),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const limited = checkRateLimit({
    key: `assistant:${ip}`,
    limit: 20,
    windowMs: 60_000,
  });
  if (!limited.allowed) {
    return NextResponse.json(
      { error: "Please wait before sending another message." },
      { status: 429 },
    );
  }

  const parsed = requestSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Enter a short question." }, { status: 422 });
  }

  try {
    const provider = await getAssistantProvider();
    const result = await provider.chat(
      [{ role: "user", content: parsed.data.message }],
      { pagePath: "/" },
    );

    const reply = result.message;
    return NextResponse.json({
      reply,
      answer: reply,
      disclaimer:
        "General trade information only — not a binding quote, contract, legal opinion, or bank instruction.",
      provider: provider.name,
      sources: result.sources,
      escalated: result.escalated,
    });
  } catch (error) {
    console.error("[assistant]", error instanceof Error ? error.message : "unknown");
    return NextResponse.json(
      {
        reply:
          "I couldn't reach the AI service just now. You can still browse products or sign in to submit a purchase request at /portal/buyer/new-request, or email Info@finekarts.com.",
        answer:
          "I couldn't reach the AI service just now. You can still browse products or sign in to submit a purchase request at /portal/buyer/new-request, or email Info@finekarts.com.",
        provider: "error-fallback",
        disclaimer:
          "General trade information only — not a binding quote, contract, legal opinion, or bank instruction.",
      },
      { status: 200 },
    );
  }
}
