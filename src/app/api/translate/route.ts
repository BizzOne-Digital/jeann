import { NextResponse } from "next/server";
import { z } from "zod";
import { translateTexts } from "@/lib/i18n/translate-service";
import { isSupportedLocale, SOURCE_LOCALE } from "@/lib/i18n/locales";

const MAX_TEXT_LENGTH = 2000;
const MAX_BATCH = 50;

const bodySchema = z.object({
  texts: z.array(z.string()).min(1).max(MAX_BATCH),
  target: z.string().min(2).max(12),
  source: z.string().min(2).max(12).optional().default(SOURCE_LOCALE),
});

function normalizeTexts(texts: string[]) {
  return texts.map((text) =>
    text.length > MAX_TEXT_LENGTH ? `${text.slice(0, MAX_TEXT_LENGTH - 1)}…` : text,
  );
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { texts: rawTexts, target, source } = parsed.data;
    const texts = normalizeTexts(rawTexts);

    if (!isSupportedLocale(target)) {
      return NextResponse.json({ error: "Unsupported target language" }, { status: 400 });
    }

    if (target === source) {
      return NextResponse.json({ translations: texts, degraded: false });
    }

    const { translations, degraded, provider } = await translateTexts(texts, target, source);

    return NextResponse.json({
      translations,
      degraded,
      provider,
      message: degraded
        ? "Translation service is rate-limited. Set GOOGLE_TRANSLATE_API_KEY in .env.local for reliable translations."
        : undefined,
    });
  } catch (error) {
    console.error("[api/translate]", error);
    return NextResponse.json({
      translations: [],
      degraded: true,
      provider: "none",
      message: "Translation temporarily unavailable.",
    });
  }
}
