import Link from "next/link";
import Image from "next/image";
import { getSite } from "@/lib/content/catalog";
import { NewsletterForm } from "@/components/marketing/NewsletterForm";

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
      { href: "/products/beans-and-pulses", label: "Beans & pulses" },
      { href: "/products/rice-and-grains", label: "Rice & grains" },
      { href: "/products", label: "All products" },
    ],
  },
  {
    title: "Trade",
    items: [
      { href: "/trade", label: "How we trade" },
      { href: "/packaging", label: "Packaging" },
      { href: "/shipping-documents", label: "Shipping documents" },
      { href: "/booking", label: "Book a consultation" },
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

export function SiteFooter() {
  const site = getSite();

  return (
    <footer className="mt-auto w-full max-w-full overflow-x-clip bg-[#071525] text-white">
      <div className="container-page section-pad !py-16">
        <div className="grid min-w-0 gap-10 sm:gap-12 lg:grid-cols-[1.1fr_1.6fr_1fr]">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Image
                src="/brand/finekarts-logo.png"
                alt="Finekarts"
                width={48}
                height={48}
                className="rounded-full bg-white"
              />
              <div>
                <p className="text-lg font-semibold tracking-[0.16em] uppercase">Finekarts</p>
                <p className="text-[0.65rem] uppercase tracking-[0.28em] text-white/50">
                  Incorporated
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              Global agricultural commodity trading for qualified buyers and suppliers.
            </p>
            <div className="mt-5 space-y-1 text-sm text-white/75">
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
          </div>

          <div className="grid min-w-0 grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
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

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e89a2d]">
              Support & Insights
            </p>
            <p className="mt-3 text-sm text-white/65">
              Optional updates on process notes and published resources. Consent required.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Finekarts Incorporated. All rights reserved.</p>
          <p>Enquiry submission does not guarantee acceptance, pricing, or shipment.</p>
        </div>
      </div>
    </footer>
  );
}
