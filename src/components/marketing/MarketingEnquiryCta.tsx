import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";

/** Shared pre-footer enquiry CTA — shown above SiteFooter on public pages. */
export function MarketingEnquiryCta() {
  return (
    <section id="site-enquiry-cta" className="scroll-mt-24 bg-white marketing-section">
      <div className="container-page">
        <Reveal>
          <div className="overflow-hidden rounded-lg border border-[#d5d0c8] bg-[#001a3d] text-white">
            <div className="grid gap-8 p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
              <div>
                <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
                  Next step
                </p>
                <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">Ready to submit an enquiry?</h2>
                <p className="mt-4 max-w-xl text-base leading-relaxed text-white/80">
                  Signed-in buyers can submit purchase requests, book consultations, and message the
                  trade desk from the buyer portal. General questions can also be sent via the
                  contact form.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 lg:justify-end">
                <Link
                  href="/login"
                  className="focus-ring inline-flex items-center marketing-btn-primary px-6 py-3 text-sm font-semibold"
                >
                  Buyer sign in
                </Link>
                <Link
                  href="/register/buyer"
                  className="focus-ring inline-flex items-center rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Register
                </Link>
                <Link
                  href="/contact#contact-form"
                  className="focus-ring inline-flex items-center rounded-md border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
                >
                  Contact us
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
