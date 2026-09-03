import Link from "next/link";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { getPublicSiteSettings } from "@/lib/content/site-settings-public";
import { SocialLinks } from "@/components/marketing/SocialLinks";
import { FooterReveal } from "@/components/motion/FooterReveal";

const LINKS = [
  {
    title: "Company",
    items: [
      { href: "/about", label: "About" },
      { href: "/team", label: "Team" },
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
      { href: "/resources", label: "Documents & terminology" },
      { href: "/packaging", label: "Packaging" },
      { href: "/logistics", label: "Logistics" },
      { href: "/partners", label: "Verification partners" },
      { href: "/verification", label: "Due diligence" },
      { href: "/inspections", label: "Inspections" },
      { href: "/insights", label: "Insights" },
    ],
  },
  {
    title: "Support",
    items: [
      { href: "/login", label: "Buyer portal" },
      { href: "/privacy", label: "Privacy" },
      { href: "/terms", label: "Terms" },
      { href: "/accessibility", label: "Accessibility" },
    ],
  },
];

export async function SiteFooter() {
  const site = await getPublicSiteSettings();

  return (
    <footer className="mt-auto w-full max-w-full overflow-x-clip bg-[#071525] text-white">
      <div className="container-page section-pad !py-16">
        <div className="grid min-w-0 gap-10 sm:gap-12 lg:grid-cols-[1.1fr_1.6fr_1fr]">
          <FooterReveal>
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <BrandLogo size="md" />
              <div>
                <p className="text-lg font-semibold tracking-[0.16em] uppercase">Finekarts</p>
                <p className="text-xs uppercase tracking-[0.28em] text-white/50 sm:text-sm">
                  Incorporated
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-base leading-relaxed text-white/65">
              Global agricultural commodity trading for qualified international buyers.
            </p>
            <div className="mt-5 space-y-1 text-base text-white/75">
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
              <p className="pt-1 text-white/60">
                {site.addressLine1}
                <br />
                {site.addressLine2}
              </p>
            </div>
            <SocialLinks links={site.socialLinks} className="mt-6" />
          </div>
          </FooterReveal>

          <FooterReveal delay={0.08}>
          <div className="grid min-w-0 grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {LINKS.map((group) => (
              <div key={group.title} className="min-w-0">
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e89a2d]">
                  {group.title}
                </p>
                <ul className="mt-4 space-y-2 text-base text-white/70">
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
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e89a2d]">
              Buyer portal
            </p>
            <p className="mt-3 text-base text-white/65">
              RFQs, consultations, and trade desk messages are submitted after buyer sign-in.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link href="/buyer-request" className="rounded-md border border-white/25 px-4 py-2.5 text-base font-semibold text-white transition hover:bg-white/10">
                Purchase request
              </Link>
              <Link href="/login" className="rounded-md bg-[#e89a2d] px-4 py-2.5 text-base font-semibold text-[#071525] transition hover:bg-[#f0a93c]">
                Sign in
              </Link>
              <Link href="/register/buyer" className="rounded-md border border-white/25 px-4 py-2.5 text-base font-semibold text-white transition hover:bg-white/10">
                Register
              </Link>
            </div>
            <p className="mt-4 text-sm text-white/50">
              Suppliers:{" "}
              <Link href="/supplier-offer" className="underline hover:text-white">
                invitation-only trade offers
              </Link>
            </p>
          </div>
          </FooterReveal>
        </div>

        <FooterReveal delay={0.18}>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Finekarts Incorporated. All rights reserved.</p>
          <p>Enquiry submission does not guarantee acceptance, pricing, or shipment.</p>
        </div>
        </FooterReveal>
      </div>
    </footer>
  );
}
