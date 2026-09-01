import { SITE } from "./seed-catalog";
import { isMongoConfigured, tryConnectMongo } from "@/lib/db/mongoose";

export type PublicSocialLink = {
  platform: string;
  url: string;
  label?: string;
};

export type PublicSiteSettings = {
  name: string;
  headline: string;
  email: string;
  phone: string;
  phoneDisplay: string;
  addressLine1: string;
  addressLine2: string;
  positioning: string;
  socialLinks: PublicSocialLink[];
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  const fallback: PublicSiteSettings = {
    name: SITE.name,
    headline: SITE.headline,
    email: SITE.email,
    phone: SITE.phone,
    phoneDisplay: SITE.phoneDisplay,
    addressLine1: SITE.addressLine1,
    addressLine2: SITE.addressLine2,
    positioning: SITE.positioning,
    socialLinks: [],
  };

  if (!isMongoConfigured()) return fallback;
  const conn = await tryConnectMongo();
  if (!conn) return fallback;

  const { SiteSettings } = await import("@/models");
  const { SITE_SETTINGS_KEY } = await import("@/models/SiteSettings");
  const doc = await SiteSettings.findOne({ key: SITE_SETTINGS_KEY }).lean();
  if (!doc) return fallback;

  return {
    name: doc.companyName || SITE.name,
    headline: SITE.headline,
    email: doc.email || SITE.email,
    phone: doc.phone || SITE.phone,
    phoneDisplay: doc.phone || SITE.phoneDisplay,
    addressLine1: doc.address?.line1 || SITE.addressLine1,
    addressLine2:
      [doc.address?.city, doc.address?.country].filter(Boolean).join(", ") || SITE.addressLine2,
    positioning: SITE.positioning,
    socialLinks: (doc.socialLinks ?? [])
      .filter((link: { url?: string }) => link.url?.trim())
      .map((link: { platform: string; url: string; label?: string }) => ({
        platform: link.platform,
        url: link.url,
        label: link.label,
      })),
  };
}
