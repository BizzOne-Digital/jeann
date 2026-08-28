import { describe, expect, it } from "vitest";
import { getApiLanguageCode, isSupportedLocale, SUPPORTED_LOCALES, SOURCE_LOCALE } from "@/lib/i18n/locales";

describe("i18n locales", () => {
  it("includes priority trade languages", () => {
    const codes = SUPPORTED_LOCALES.map((l) => l.code);
    expect(codes).toEqual(
      expect.arrayContaining(["es", "fr", "pt-BR", "zh-CN", "ar", "tr", "ms", "vi", "id", "th", "ko", "ja"]),
    );
  });

  it("validates locale codes", () => {
    expect(isSupportedLocale(SOURCE_LOCALE)).toBe(true);
    expect(isSupportedLocale("es")).toBe(true);
    expect(isSupportedLocale("xx")).toBe(false);
  });

  it("maps locale to API language codes", () => {
    expect(getApiLanguageCode("pt-BR")).toBe("pt");
    expect(getApiLanguageCode("zh-CN")).toBe("zh-CN");
  });
});
