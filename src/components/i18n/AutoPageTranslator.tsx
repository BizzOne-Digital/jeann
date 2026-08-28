"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { SOURCE_LOCALE } from "@/lib/i18n/locales";
import { getStaticTranslationMap, lookupStaticTranslation } from "@/lib/i18n/static/catalog";
import { setTranslating } from "@/lib/i18n/translation-runtime";
import { useTranslation } from "@/components/i18n/TranslationProvider";

const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE", "SVG", "PATH"]);

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

function preserveWhitespace(original: string, translated: string) {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${translated}${trailing}`;
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

function applyTranslations(
  root: HTMLElement,
  locale: string,
  staticMap: Record<string, string>,
  originalsRef: WeakMap<Text, string>,
  applyingRef: { current: boolean },
) {
  const reverseCache = buildReverseCache(staticMap);
  applyingRef.current = true;

  try {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      const textNode = node as Text;
      if (!shouldSkipNode(textNode)) {
        const current = textNode.textContent ?? "";
        const source = resolveSourceText(current, originalsRef, textNode, reverseCache);
        const trimmed = source.trim();
        const translated =
          staticMap[trimmed] ?? lookupStaticTranslation(trimmed, locale) ?? null;

        if (translated && translated !== trimmed) {
          textNode.textContent = preserveWhitespace(source, translated);
        }
      }
      node = walker.nextNode();
    }
  } finally {
    applyingRef.current = false;
  }
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
    const staticMap = locale === SOURCE_LOCALE ? {} : getStaticTranslationMap(locale);

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
      if (reapplyTimerRef.current) window.clearTimeout(reapplyTimerRef.current);
      reapplyTimerRef.current = window.setTimeout(() => {
        if (runId !== runIdRef.current || locale === SOURCE_LOCALE) return;
        applyTranslations(marketingRoot, locale, staticMap, originalsRef.current, applyingRef);
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

    const timer = window.setTimeout(() => {
      setTranslating(true);
      applyTranslations(marketingRoot, locale, staticMap, originalsRef.current, applyingRef);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (runId === runIdRef.current) {
            applyTranslations(marketingRoot, locale, staticMap, originalsRef.current, applyingRef);
          }
          setTranslating(false);
        });
      });
    }, 80);

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      if (reapplyTimerRef.current) window.clearTimeout(reapplyTimerRef.current);
    };
  }, [locale, pathname]);

  return null;
}
