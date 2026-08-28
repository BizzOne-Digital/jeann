import { getEnv } from "@/lib/config/env";
import { getApiLanguageCode, SOURCE_LOCALE } from "@/lib/i18n/locales";

const memoryCache = new Map<string, string>();

function cacheKey(text: string, target: string, source: string) {
  return `${source}::${target}::${text}`;
}

function getCached(text: string, target: string, source: string) {
  return memoryCache.get(cacheKey(text, target, source));
}

function setCached(text: string, target: string, source: string, translated: string) {
  memoryCache.set(cacheKey(text, target, source), translated);
}

async function translateWithGoogle(
  texts: string[],
  target: string,
  source: string,
  apiKey: string,
): Promise<string[]> {
  const res = await fetch(
    `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ q: texts, target, source, format: "text" }),
      signal: AbortSignal.timeout(25_000),
    },
  );

  if (!res.ok) {
    throw new Error(`Google Translate HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    data?: { translations?: Array<{ translatedText?: string }> };
  };

  const out = json.data?.translations?.map((t) => t.translatedText ?? "") ?? [];
  if (out.length !== texts.length) {
    throw new Error("Google Translate returned unexpected result count");
  }
  return out;
}

async function translateWithMyMemory(text: string, target: string, source: string): Promise<string> {
  const url = new URL("https://api.mymemory.translated.net/get");
  url.searchParams.set("q", text.slice(0, 500));
  url.searchParams.set("langpair", `${source}|${target}`);

  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(15_000) });
  if (!res.ok) {
    throw new Error(`MyMemory HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    responseData?: { translatedText?: string };
  };

  return json.responseData?.translatedText?.trim() || text;
}

async function translateBatchMyMemory(
  texts: string[],
  target: string,
  source: string,
): Promise<string[]> {
  const results: string[] = [];
  for (const text of texts) {
    results.push(await translateWithMyMemory(text, target, source));
    await new Promise((r) => setTimeout(r, 120));
  }
  return results;
}

export async function translateTexts(
  texts: string[],
  targetLocale: string,
  sourceLocale: string = SOURCE_LOCALE,
): Promise<string[]> {
  if (targetLocale === sourceLocale || texts.length === 0) {
    return texts;
  }

  const target = getApiLanguageCode(targetLocale);
  const source = getApiLanguageCode(sourceLocale);

  const results: string[] = new Array(texts.length);
  const pending: { index: number; text: string }[] = [];

  texts.forEach((text, index) => {
    const trimmed = text.trim();
    if (!trimmed) {
      results[index] = text;
      return;
    }
    const cached = getCached(trimmed, target, source);
    if (cached) {
      results[index] = preserveWhitespace(text, cached);
      return;
    }
    pending.push({ index, text: trimmed });
  });

  if (pending.length === 0) {
    return results;
  }

  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  const chunks: typeof pending[] = [];
  const chunkSize = apiKey ? 40 : 8;

  for (let i = 0; i < pending.length; i += chunkSize) {
    chunks.push(pending.slice(i, i + chunkSize));
  }

  for (const chunk of chunks) {
    const chunkTexts = chunk.map((c) => c.text);
    let translated: string[];

    try {
      if (apiKey) {
        translated = await translateWithGoogle(chunkTexts, target, source, apiKey);
      } else {
        if (getEnv().NODE_ENV === "production") {
          console.warn(
            "[translate] GOOGLE_TRANSLATE_API_KEY not set — using rate-limited MyMemory fallback",
          );
        }
        translated = await translateBatchMyMemory(chunkTexts, target, source);
      }
    } catch (error) {
      console.error("[translate] batch failed, falling back per string", error);
      translated = await translateBatchMyMemory(chunkTexts, target, source);
    }

    chunk.forEach((item, i) => {
      const value = translated[i] ?? item.text;
      setCached(item.text, target, source, value);
      results[item.index] = preserveWhitespace(texts[item.index], value);
    });
  }

  return results;
}

function preserveWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}
