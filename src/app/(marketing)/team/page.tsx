import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/marketing/PageHero";

export const metadata: Metadata = {
  title: "Team",
  description:
    "Finekarts leadership and operations profiles are managed in the CMS and published when approved.",
};

export default function TeamPage() {
  return (
    <>
      <PageHero
        title="People behind the trade desk"
        description="Team profiles are CMS-managed. We do not display placeholder names or unverified biographies on the public site."
        primaryCta={{ href: "/contact", label: "Contact the trade desk →" }}
        secondaryCta={{ href: "/about", label: "About Finekarts" }}
      />

      <section className="bg-[#f3f1ec] py-16 lg:py-24">
        <div className="container-page">
          <div className="border border-[#d5d0c8] bg-white px-6 py-14 text-center sm:px-10">
            <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
              No published team members yet
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#666666]">
              When leadership and operations profiles are approved in admin, they will appear here
              with role, biography, and optional contact routing — not fabricated placeholders.
            </p>
            <Link
              href="/contact"
              className="focus-ring mt-8 inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
            >
              Contact the trade desk <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
