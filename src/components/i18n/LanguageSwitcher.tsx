"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { SUPPORTED_LOCALES, SOURCE_LOCALE } from "@/lib/i18n/locales";
import { useTranslation } from "@/components/i18n/TranslationProvider";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale, isTranslating } = useTranslation();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const current =
    locale === SOURCE_LOCALE
      ? { nativeName: "English", name: "English" }
      : SUPPORTED_LOCALES.find((l) => l.code === locale);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!panelRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={panelRef} className={cn("relative", className)} data-no-translate>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="focus-ring flex items-center gap-1.5 rounded-md border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-white/10"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label="Select language"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M3 12h18M12 3c2.5 2.8 2.5 14.2 0 17M12 3c-2.5 2.8-2.5 14.2 0 17"
            stroke="currentColor"
            strokeWidth="1.4"
          />
        </svg>
        <span className="max-w-[5.5rem] truncate sm:max-w-none">
          {isTranslating ? "…" : (current?.nativeName ?? "English")}
        </span>
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden className="opacity-70">
          <path d="M3 4.5 6 7.5 9 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </button>

      {open ? (
        <div
          className="absolute right-0 z-[80] mt-2 max-h-[min(70vh,22rem)] w-[min(18rem,calc(100vw-2rem))] overflow-y-auto rounded-md border border-[#d5d0c8] bg-white py-1 shadow-lg"
          role="listbox"
          aria-label="Languages"
        >
          <button
            type="button"
            role="option"
            aria-selected={locale === SOURCE_LOCALE}
            onClick={() => {
              setLocale(SOURCE_LOCALE);
              setOpen(false);
            }}
            className={cn(
              "flex w-full flex-col items-start px-3 py-2 text-left text-sm transition hover:bg-[#f3f1ec]",
              locale === SOURCE_LOCALE && "bg-[#f9f8f5] font-semibold text-[#001a3d]",
            )}
          >
            <span>English</span>
            <span className="text-xs text-[#888888]">Default</span>
          </button>
          <div className="my-1 border-t border-[#ece8e0]" />
          {SUPPORTED_LOCALES.map((item) => (
            <button
              key={item.code}
              type="button"
              role="option"
              aria-selected={locale === item.code}
              onClick={() => {
                setLocale(item.code);
                setOpen(false);
              }}
              className={cn(
                "flex w-full flex-col items-start px-3 py-2 text-left text-sm transition hover:bg-[#f3f1ec]",
                locale === item.code && "bg-[#f9f8f5] font-semibold text-[#001a3d]",
              )}
            >
              <span>{item.nativeName}</span>
              <span className="text-xs text-[#888888]">
                {item.name} · {item.region}
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
