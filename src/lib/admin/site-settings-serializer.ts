import type { SiteSettingsLean } from "@/models";

export type AdminSiteSettings = {
  key: string;
  companyName: string;
  email: string;
  phone: string;
  addressVisible: boolean;
  addressLine1: string;
  addressCity: string;
  addressCountry: string;
  seoTitle: string;
  seoDescription: string;
  aiAssistantEnabled: boolean;
  supplierPortal: boolean;
  bankingPortal: boolean;
  aiAssistantFlag: boolean;
  financeModule: boolean;
  locales: string;
};

export function serializeSiteSettings(doc: SiteSettingsLean): AdminSiteSettings {
  const flags = doc.featureFlags ?? {};
  return {
    key: doc.key,
    companyName: doc.companyName,
    email: doc.email,
    phone: doc.phone ?? "",
    addressVisible: doc.addressVisible,
    addressLine1: doc.address?.line1 ?? "",
    addressCity: doc.address?.city ?? "",
    addressCountry: doc.address?.country ?? "",
    seoTitle: doc.seoDefaults?.title ?? "",
    seoDescription: doc.seoDefaults?.description ?? "",
    aiAssistantEnabled: doc.aiAssistantEnabled,
    supplierPortal: Boolean(flags.supplierPortal),
    bankingPortal: Boolean(flags.bankingPortal),
    aiAssistantFlag: Boolean(flags.aiAssistant),
    financeModule: Boolean(flags.financeModule),
    locales: (doc.locales ?? ["en"]).join(", "),
  };
}

export const DEFAULT_SITE_SETTINGS: AdminSiteSettings = {
  key: "default",
  companyName: "Finekarts",
  email: "trade@finekarts.com",
  phone: "",
  addressVisible: false,
  addressLine1: "",
  addressCity: "",
  addressCountry: "",
  seoTitle: "",
  seoDescription: "",
  aiAssistantEnabled: true,
  supplierPortal: true,
  bankingPortal: true,
  aiAssistantFlag: true,
  financeModule: true,
  locales: "en",
};
