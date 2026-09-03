"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { LOCALE_COOKIE, SOURCE_LOCALE, isSupportedLocale } from "@/lib/i18n/locales";

type TranslationContextValue = {
  locale: string;
  setLocale: (code: string) => void;
};

const TranslationContext = createContext<TranslationContextValue | null>(null);

const localeListeners = new Set<() => void>();

function emitLocaleChange() {
  localeListeners.forEach((listener) => listener());
}

function subscribeLocale(listener: () => void) {
  localeListeners.add(listener);
  return () => {
    localeListeners.delete(listener);
  };
}

function readStoredLocale(): string {
  if (typeof window === "undefined") return SOURCE_LOCALE;
  const fromCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${LOCALE_COOKIE}=`))
    ?.split("=")[1];
  const fromStorage = localStorage.getItem(LOCALE_COOKIE);
  const code = fromCookie || fromStorage || SOURCE_LOCALE;
  return isSupportedLocale(code) ? code : SOURCE_LOCALE;
}

function persistLocale(code: string) {
  localStorage.setItem(LOCALE_COOKIE, code);
  document.cookie = `${LOCALE_COOKIE}=${code};path=/;max-age=31536000;SameSite=Lax`;
  window.requestAnimationFrame(() => {
    document.documentElement.lang = code === SOURCE_LOCALE ? "en" : code;
    document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
  });
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribeLocale, readStoredLocale, () => SOURCE_LOCALE);

  const setLocale = useCallback((code: string) => {
    const next = isSupportedLocale(code) ? code : SOURCE_LOCALE;
    persistLocale(next);
    emitLocaleChange();
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return <TranslationContext.Provider value={value}>{children}</TranslationContext.Provider>;
}

export function useTranslation() {
  const ctx = useContext(TranslationContext);
  if (!ctx) {
    throw new Error("useTranslation must be used within TranslationProvider");
  }
  return ctx;
}
