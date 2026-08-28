import { NextResponse } from "next/server";
import { z } from "zod";
import { translateTexts } from "@/lib/i18n/translate-service";
import { isSupportedLocale, SOURCE_LOCALE } from "@/lib/i18n/locales";

const bodySchema = z.object({
  texts: z.array(z.string().max(2000)).min(1).max(50),
  target: z.string().min(2).max(12),
  source: z.string().min(2).max(12).optional().default(SOURCE_LOCALE),
});

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = bodySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { texts, target, source } = parsed.data;

    if (!isSupportedLocale(target)) {
      return NextResponse.json({ error: "Unsupported target language" }, { status: 400 });
    }

    if (target === source) {
      return NextResponse.json({ translations: texts });
    }

    const translations = await translateTexts(texts, target, source);
    return NextResponse.json({ translations });
  } catch (error) {
    console.error("[api/translate]", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
