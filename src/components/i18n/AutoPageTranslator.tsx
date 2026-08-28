"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { SOURCE_LOCALE } from "@/lib/i18n/locales";
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
  const { locale, setIsTranslating } = useTranslation();
  const pathname = usePathname();
  const originalsRef = useRef(new WeakMap<Text, string>());
  const runIdRef = useRef(0);

  useEffect(() => {
    const root = document.getElementById("finekarts-marketing-root");
    if (!root) return;

    const runId = ++runIdRef.current;

    const restoreEnglish = () => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        const textNode = node as Text;
        const original = originalsRef.current.get(textNode);
        if (original !== undefined) {
          textNode.textContent = original;
        }
        node = walker.nextNode();
      }
    };

    if (locale === SOURCE_LOCALE) {
      restoreEnglish();
      setIsTranslating(false);
      return;
    }

    let cancelled = false;

    async function translatePage() {
      setIsTranslating(true);

      const entries: { node: Text; text: string }[] = [];
      const walker = document.createTreeWalker(root!, NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();

      while (node) {
        const textNode = node as Text;
        if (!shouldSkipNode(textNode)) {
          const current = textNode.textContent ?? "";
          if (!originalsRef.current.has(textNode)) {
            originalsRef.current.set(textNode, current);
          }
          entries.push({ node: textNode, text: originalsRef.current.get(textNode) ?? current });
        }
        node = walker.nextNode();
      }

      const unique = [...new Set(entries.map((e) => e.text.trim()).filter(Boolean))];
      const cache = loadClientCache(locale);
      const missing = unique.filter((t) => !cache[t]);
      const chunkSize = 40;

      try {
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

        for (const entry of entries) {
          const source = (originalsRef.current.get(entry.node) ?? entry.text).trim();
          const translated = cache[source];
          if (translated && translated !== source) {
            entry.node.textContent = preserveWhitespace(entry.text, translated);
          }
        }
      } catch (error) {
        console.error("[AutoPageTranslator]", error);
      } finally {
        if (!cancelled && runId === runIdRef.current) {
          setIsTranslating(false);
        }
      }
    }

    const timer = window.setTimeout(() => {
      void translatePage();
    }, 120);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [locale, pathname, setIsTranslating]);

  return null;
}

function preserveWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
}
