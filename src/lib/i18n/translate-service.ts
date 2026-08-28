import { getApiLanguageCode, SOURCE_LOCALE } from "@/lib/i18n/locales";
import { isUsableTranslation } from "@/lib/i18n/translate-utils";

const memoryCache = new Map<string, string>();

export type TranslateResult = {
  translations: string[];
  degraded: boolean;
  provider: "google" | "mymemory" | "none";
};

function cacheKey(text: string, target: string, source: string) {
  return `${source}::${target}::${text}`;
}

function getCached(text: string, target: string, source: string) {
  return memoryCache.get(cacheKey(text, target, source));
}

function setCached(text: string, target: string, source: string, translated: string) {
  memoryCache.set(cacheKey(text, target, source), translated);
}

function preserveWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
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

  let res = await fetch(url.toString(), { signal: AbortSignal.timeout(15_000) });
  if (res.status === 429) {
    await sleep(1500);
    res = await fetch(url.toString(), { signal: AbortSignal.timeout(15_000) });
  }

  if (!res.ok) {
    throw new Error(`MyMemory HTTP ${res.status}`);
  }

  const json = (await res.json()) as {
    responseData?: { translatedText?: string };
  };

  const translated = json.responseData?.translatedText?.trim() || text;
  if (!isUsableTranslation(text, translated)) {
    throw new Error("MyMemory quota exhausted or unusable response");
  }

  return translated;
}

async function translateBatchMyMemory(
  texts: string[],
  target: string,
  source: string,
): Promise<string[]> {
  const results: string[] = [];
  for (const text of texts) {
    results.push(await translateWithMyMemory(text, target, source));
    await sleep(250);
  }
  return results;
}

async function translateBatch(
  texts: string[],
  targetLocale: string,
  sourceLocale: string,
  apiKey: string | undefined,
): Promise<{ translations: string[]; provider: TranslateResult["provider"] }> {
  const target = getApiLanguageCode(targetLocale);
  const source = getApiLanguageCode(sourceLocale);

  if (apiKey) {
    const translated = await translateWithGoogle(texts, target, source, apiKey);
    return { translations: translated, provider: "google" };
  }

  const translated = await translateBatchMyMemory(texts, target, source);
  return { translations: translated, provider: "mymemory" };
}

export async function translateTexts(
  texts: string[],
  targetLocale: string,
  sourceLocale: string = SOURCE_LOCALE,
): Promise<TranslateResult> {
  if (targetLocale === sourceLocale || texts.length === 0) {
    return { translations: texts, degraded: false, provider: "none" };
  }

  const target = getApiLanguageCode(targetLocale);
  const source = getApiLanguageCode(sourceLocale);
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY?.trim() || undefined;

  const results: string[] = new Array(texts.length);
  const pending: { index: number; text: string }[] = [];

  texts.forEach((text, index) => {
    const trimmed = text.trim();
    if (!trimmed) {
      results[index] = text;
      return;
    }

    const cached = getCached(trimmed, target, source);
    if (cached && isUsableTranslation(trimmed, cached)) {
      results[index] = preserveWhitespace(text, cached);
      return;
    }

    pending.push({ index, text: trimmed });
  });

  if (pending.length === 0) {
    return { translations: results, degraded: false, provider: apiKey ? "google" : "mymemory" };
  }

  let provider: TranslateResult["provider"] = apiKey ? "google" : "mymemory";
  const chunkSize = apiKey ? 40 : 5;

  for (let i = 0; i < pending.length; i += chunkSize) {
    const chunk = pending.slice(i, i + chunkSize);
    const chunkTexts = chunk.map((c) => c.text);
    let translated: string[] | null = null;

    try {
      const batch = await translateBatch(chunkTexts, targetLocale, sourceLocale, apiKey);
      translated = batch.translations;
      provider = batch.provider;
    } catch (error) {
      console.error("[translate] batch failed", error);
      if (apiKey) {
        try {
          translated = await translateBatchMyMemory(chunkTexts, target, source);
          provider = "mymemory";
        } catch (fallbackError) {
          console.error("[translate] MyMemory fallback failed", fallbackError);
        }
      }
    }

    chunk.forEach((item, idx) => {
      const original = texts[item.index];
      const candidate = translated?.[idx];
      if (candidate && isUsableTranslation(item.text, candidate)) {
        setCached(item.text, target, source, candidate);
        results[item.index] = preserveWhitespace(original, candidate);
      } else {
        results[item.index] = original;
      }
    });
  }

  const degraded = pending.some((item) => results[item.index] === texts[item.index]);
  return {
    translations: results.map((result, index) => result ?? texts[index]),
    degraded,
    provider,
  };
}
