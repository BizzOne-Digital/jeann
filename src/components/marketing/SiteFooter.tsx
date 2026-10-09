import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { getPublicSiteSettings } from "@/lib/content/site-settings-public";
import {
  FINEKARTS_FOOTER_TAGLINE,
  FINEKARTS_TOOLS_DISCLAIMER,
} from "@/lib/content/trader-positioning";
import { SocialLinks } from "@/components/marketing/SocialLinks";
import { FooterReveal } from "@/components/motion/FooterReveal";

const LINKS = [
  {
    title: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/team", label: "Team" },
      { href: "/testimonials", label: "Testimonials" },
      { href: "/privacy", label: "Careers" },
      { href: "/faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Products",
    items: [
      { href: "/products/edible-oils", label: "Edible oils" },
      { href: "/products/sugar", label: "Sugar" },
      { href: "/products/beans-and-pulses", label: "Beans" },
      { href: "/products/rice-and-grains", label: "Rice & grains" },
      { href: "/products", label: "All products" },
    ],
  },
  {
    title: "Resources",
    items: [
      { href: "/resources", label: "Resources" },
      { href: "/packaging", label: "Packaging" },
      { href: "/logistics", label: "Logistics" },
      { href: "/partners", label: "Partners" },
      { href: "/verification", label: "Due diligence" },
      { href: "/inspections", label: "Inspections" },
      { href: "/insights", label: "Insights" },
    ],
  },
  {
    title: "Support",
    items: [
      { href: "/login", label: "Buyer portal" },
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms-and-conditions", label: "Terms & Conditions" },
    ],
  },
];

export async function SiteFooter() {
  const site = await getPublicSiteSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto w-full max-w-full overflow-x-clip bg-[var(--footer-bg)] text-white">
      <div className="container-page pt-14 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] sm:pt-16">
        <div className="grid min-w-0 items-start gap-10 sm:gap-12 lg:grid-cols-[1.1fr_1.6fr_1fr]">
          <FooterReveal>
            <div className="min-w-0 self-start">
              <Link href="/" className="focus-ring inline-flex shrink-0 items-center gap-3">
                <BrandLogo size="lg" />
                <div className="shrink-0">
                  <p className="text-lg font-semibold tracking-[0.16em] uppercase">Finekarts</p>
                  <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/50">
                    Incorporated
                  </p>
                </div>
              </Link>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-white/65">
                {FINEKARTS_FOOTER_TAGLINE}
              </p>
              <SocialLinks links={site.socialLinks} className="mt-6" />
            </div>
          </FooterReveal>

          <FooterReveal delay={0.08}>
            <div className="grid min-w-0 self-start grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
              {LINKS.map((group) => (
                <div key={group.title} className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e89a2d]">
                    {group.title}
                  </p>
                  <ul className="mt-4 space-y-2 text-sm text-white/70">
                    {group.items.map((item) => (
                      <li key={item.href}>
                        <Link href={item.href} className="break-words hover:text-white">
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </FooterReveal>

          <FooterReveal delay={0.14}>
            <div className="flex min-w-0 flex-col gap-6 self-start lg:ml-auto lg:max-w-[17rem] lg:items-end lg:text-right">
              <div className="w-full lg:w-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e89a2d]">
                  Buyer portal
                </p>
                <p className="mt-3 text-sm text-white/65">
                  RFQs, consultations, and trade desk messages are submitted after buyer sign-in.
                </p>
                <div className="mt-4 flex flex-wrap gap-2 lg:justify-end">
                  <Link
                    href="/buyer-request"
                    className="rounded-md border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Purchase request
                  </Link>
                  <Link
                    href="/login"
                    className="marketing-btn-primary px-4 py-2.5 text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/register/buyer"
                    className="rounded-md border border-white/25 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
                  >
                    Register
                  </Link>
                </div>
              </div>
              <div className="space-y-1 text-sm leading-snug text-white/75">
                <p>
                  <a className="hover:text-[#e89a2d]" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                </p>
                <p>
                  <a className="hover:text-[#e89a2d]" href={`tel:${site.phone}`}>
                    {site.phoneDisplay}
                  </a>
                </p>
                <p className="pt-0.5 text-white/60">
                  {site.addressLine1}
                  <br />
                  {site.addressLine2}
                </p>
              </div>
              <p className="text-xs text-white/50">
                Suppliers:{" "}
                <Link href="/supplier-offer" className="underline hover:text-white">
                  invitation-only trade offers
                </Link>
              </p>
            </div>
          </FooterReveal>
        </div>

        <FooterReveal delay={0.18}>
          <div className="mt-12 space-y-5 border-t border-white/15 pt-6 text-sm text-white/75">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-base font-medium text-white">
                  © {year} Finekarts Incorporated. All rights reserved.
                </p>
                <p className="max-w-lg text-xs leading-relaxed text-white/55">
                  Finekarts<sup className="text-[0.6rem]">®</sup> and Finekarts Incorporated
                  <sup className="text-[0.6rem]">®</sup> are trademarks of Finekarts Incorporated.
                </p>
              </div>
              <nav
                className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/80"
                aria-label="Legal"
              >
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
                <span className="text-white/30" aria-hidden>|</span>
                <Link href="/terms-and-conditions" className="hover:text-white">
                  Terms &amp; Conditions
                </Link>
                <span className="text-white/30" aria-hidden>|</span>
                <Link href="/testimonials" className="hover:text-white">
                  Testimonials
                </Link>
                <span className="text-white/30" aria-hidden>|</span>
                <Link href="/privacy" className="hover:text-white">
                  Careers
                </Link>
              </nav>
            </div>
            <div className="mx-auto max-w-3xl text-center">
              <p className="leading-relaxed text-white/65">
                <span className="font-semibold text-white/90">Disclaimer:</span> {FINEKARTS_TOOLS_DISCLAIMER}
              </p>
              <p className="mt-3 text-white/60">
                Enquiry submission does not guarantee acceptance, pricing, or shipment.
              </p>
            </div>
          </div>
        </FooterReveal>
      </div>
    </footer>
  );
}
