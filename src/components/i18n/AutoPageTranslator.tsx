"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SOURCE_LOCALE } from "@/lib/i18n/locales";
import { setTranslating } from "@/lib/i18n/translation-runtime";
import { useTranslation } from "@/components/i18n/TranslationProvider";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "SVG", "PATH"]);
const CLIENT_CACHE_PREFIX = "finekarts-tr-v1";

function shouldSkipNode(node: Text): boolean {
  const parent = node.parentElement;
  if (!parent) return true;
  if (parent.closest("[data-no-translate]")) return true;
  if (parent.closest("[contenteditable='true']")) return true;
  if (parent.isContentEditable) return true;
  if (SKIP_TAGS.has(parent.tagName)) return true;
  if (parent.getAttribute("aria-hidden") === "true") return true;

  const text = node.textContent?.trim() ?? "";
  if (text.length < 2) return true;
  if (/^[\d\s.,+%$€£¥/-]+$/.test(text)) return true;
  if (/^https?:\/\//i.test(text)) return true;
  if (/^[\w.-]+@[\w.-]+\.\w+$/.test(text)) return true;

  return false;
}

function loadClientCache(locale: string): Record<string, string> {
  try {
    const raw = sessionStorage.getItem(`${CLIENT_CACHE_PREFIX}:${locale}`);
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function saveClientCache(locale: string, cache: Record<string, string>) {
  try {
    sessionStorage.setItem(`${CLIENT_CACHE_PREFIX}:${locale}`, JSON.stringify(cache));
  } catch {
    /* quota */
  }
}

function buildReverseCache(cache: Record<string, string>) {
  const reverse: Record<string, string> = {};
  for (const [source, translated] of Object.entries(cache)) {
    if (translated && translated !== source) {
      reverse[translated.trim()] = source;
    }
  }
  return reverse;
}

function preserveWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}

function resolveSourceText(
  current: string,
  originalsRef: WeakMap<Text, string>,
  textNode: Text,
  reverseCache: Record<string, string>,
): string {
  const stored = originalsRef.get(textNode);
  if (stored !== undefined) return stored;

  const trimmed = current.trim();
  if (reverseCache[trimmed]) {
    const source = reverseCache[trimmed];
    originalsRef.set(textNode, preserveWhitespace(current, source));
    return originalsRef.get(textNode) ?? current;
  }

  originalsRef.set(textNode, current);
  return current;
}

function collectTextEntries(
  root: HTMLElement,
  originalsRef: WeakMap<Text, string>,
  reverseCache: Record<string, string>,
) {
  const entries: { node: Text; text: string; source: string }[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const textNode = node as Text;
    if (!shouldSkipNode(textNode)) {
      const current = textNode.textContent ?? "";
      const source = resolveSourceText(current, originalsRef, textNode, reverseCache);
      entries.push({ node: textNode, text: source, source: source.trim() });
    }
    node = walker.nextNode();
  }

  return entries;
}

function applyCachedTranslations(
  root: HTMLElement,
  locale: string,
  originalsRef: WeakMap<Text, string>,
  applyingRef: { current: boolean },
) {
  const cache = loadClientCache(locale);
  const reverseCache = buildReverseCache(cache);
  const entries = collectTextEntries(root, originalsRef, reverseCache);

  applyingRef.current = true;
  try {
    for (const entry of entries) {
      if (!entry.source) continue;
      const translated = cache[entry.source];
      if (translated && translated !== entry.source) {
        entry.node.textContent = preserveWhitespace(entry.text, translated);
      }
    }
  } finally {
    applyingRef.current = false;
  }
}

async function fetchTranslations(texts: string[], target: string): Promise<string[]> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ texts, target, source: SOURCE_LOCALE }),
  });

  if (!res.ok) {
    throw new Error("Translation request failed");
  }

  const json = (await res.json()) as { translations?: string[] };
  return json.translations ?? texts;
}

export function AutoPageTranslator() {
  const { locale } = useTranslation();
  const pathname = usePathname();
  const originalsRef = useRef(new WeakMap<Text, string>());
  const runIdRef = useRef(0);
  const applyingRef = useRef(false);
  const reapplyTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.getElementById("finekarts-marketing-root");
    if (!root) return;

    const marketingRoot = root;

    const runId = ++runIdRef.current;

    const restoreEnglish = () => {
      applyingRef.current = true;
      try {
        const walker = document.createTreeWalker(marketingRoot, NodeFilter.SHOW_TEXT);
        let node = walker.nextNode();
        while (node) {
          const textNode = node as Text;
          const original = originalsRef.current.get(textNode);
          if (original !== undefined) {
            textNode.textContent = original;
          }
          node = walker.nextNode();
        }
      } finally {
        applyingRef.current = false;
      }
    };

    const scheduleReapply = () => {
      if (locale === SOURCE_LOCALE || runId !== runIdRef.current) return;
      if (reapplyTimerRef.current) {
        window.clearTimeout(reapplyTimerRef.current);
      }
      reapplyTimerRef.current = window.setTimeout(() => {
        if (runId !== runIdRef.current || locale === SOURCE_LOCALE) return;
        applyCachedTranslations(marketingRoot, locale, originalsRef.current, applyingRef);
      }, 60);
    };

    const observer = new MutationObserver(() => {
      if (applyingRef.current || locale === SOURCE_LOCALE) return;
      scheduleReapply();
    });

    observer.observe(marketingRoot, {
      subtree: true,
      childList: true,
      characterData: true,
    });

    if (locale === SOURCE_LOCALE) {
      restoreEnglish();
      setTranslating(false);
      return () => {
        observer.disconnect();
        if (reapplyTimerRef.current) window.clearTimeout(reapplyTimerRef.current);
      };
    }

    let cancelled = false;

    async function translatePage() {
      setTranslating(true);

      try {
        const cache = loadClientCache(locale);
        const reverseCache = buildReverseCache(cache);
        const entries = collectTextEntries(marketingRoot, originalsRef.current, reverseCache);

        const unique = [...new Set(entries.map((e) => e.source).filter(Boolean))];
        const missing = unique.filter((t) => !cache[t]);
        const chunkSize = 40;

        for (let i = 0; i < missing.length; i += chunkSize) {
          if (cancelled || runId !== runIdRef.current) return;
          const chunk = missing.slice(i, i + chunkSize);
          const translated = await fetchTranslations(chunk, locale);
          chunk.forEach((source, idx) => {
            cache[source] = translated[idx] ?? source;
          });
          saveClientCache(locale, cache);
        }

        if (cancelled || runId !== runIdRef.current) return;

        applyCachedTranslations(marketingRoot, locale, originalsRef.current, applyingRef);

        // React may commit after our DOM writes — re-apply once the tree settles.
        window.requestAnimationFrame(() => {
          window.requestAnimationFrame(() => {
            if (!cancelled && runId === runIdRef.current) {
              applyCachedTranslations(marketingRoot, locale, originalsRef.current, applyingRef);
            }
          });
        });
      } catch (error) {
        console.error("[AutoPageTranslator]", error);
      } finally {
        if (!cancelled && runId === runIdRef.current) {
          setTranslating(false);
        }
      }
    }

    const timer = window.setTimeout(() => {
      void translatePage();
    }, 80);

    return () => {
      cancelled = true;
      observer.disconnect();
      window.clearTimeout(timer);
      if (reapplyTimerRef.current) window.clearTimeout(reapplyTimerRef.current);
    };
  }, [locale, pathname]);

  return null;
}
