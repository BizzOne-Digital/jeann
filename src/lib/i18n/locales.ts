export type LocaleDefinition = {
  code: string;
  name: string;
  nativeName: string;
  region: string;
  /** BCP-47 / API target code */
  apiCode: string;
};

/** English is the source language — not shown as a translation target in the switcher. */
export const SOURCE_LOCALE = "en";

/**
 * Locales prioritized for Finekarts trade corridors: Americas, EU, Middle East,
 * South & Southeast Asia, East Asia, and other major import economies.
 */
export const SUPPORTED_LOCALES: LocaleDefinition[] = [
  { code: "es", name: "Spanish", nativeName: "Español", region: "Americas & EU", apiCode: "es" },
  { code: "fr", name: "French", nativeName: "Français", region: "EU & Africa", apiCode: "fr" },
  { code: "pt-BR", name: "Portuguese (Brazil)", nativeName: "Português (Brasil)", region: "South America", apiCode: "pt" },
  { code: "zh-CN", name: "Chinese (Mandarin)", nativeName: "简体中文", region: "East Asia", apiCode: "zh-CN" },
  { code: "it", name: "Italian", nativeName: "Italiano", region: "EU", apiCode: "it" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", region: "South Asia", apiCode: "hi" },
  { code: "ar", name: "Arabic", nativeName: "العربية", region: "Middle East & North Africa", apiCode: "ar" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", region: "Turkey & region", apiCode: "tr" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", region: "Malaysia", apiCode: "ms" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", region: "Vietnam", apiCode: "vi" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", region: "Indonesia", apiCode: "id" },
  { code: "th", name: "Thai", nativeName: "ไทย", region: "Thailand", apiCode: "th" },
  { code: "de", name: "German", nativeName: "Deutsch", region: "EU", apiCode: "de" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", region: "EU", apiCode: "nl" },
  { code: "pl", name: "Polish", nativeName: "Polski", region: "EU", apiCode: "pl" },
  { code: "ko", name: "Korean", nativeName: "한국어", region: "East Asia", apiCode: "ko" },
  { code: "ja", name: "Japanese", nativeName: "日本語", region: "East Asia", apiCode: "ja" },
  { code: "tl", name: "Filipino", nativeName: "Filipino", region: "Philippines", apiCode: "tl" },
  { code: "pt", name: "Portuguese (EU)", nativeName: "Português", region: "EU & Africa", apiCode: "pt" },
  { code: "ru", name: "Russian", nativeName: "Русский", region: "Eurasia", apiCode: "ru" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", region: "South Asia", apiCode: "bn" },
  { code: "ur", name: "Urdu", nativeName: "اردو", region: "South Asia", apiCode: "ur" },
];

export const LOCALE_COOKIE = "finekarts_lang";

export function getLocaleByCode(code: string): LocaleDefinition | undefined {
  if (code === SOURCE_LOCALE) {
    return { code: "en", name: "English", nativeName: "English", region: "Global", apiCode: "en" };
  }
  return SUPPORTED_LOCALES.find((l) => l.code === code);
}

export function isSupportedLocale(code: string): boolean {
  return code === SOURCE_LOCALE || SUPPORTED_LOCALES.some((l) => l.code === code);
}

export function getApiLanguageCode(localeCode: string): string {
  return getLocaleByCode(localeCode)?.apiCode ?? localeCode;
}
