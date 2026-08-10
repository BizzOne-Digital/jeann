"use client";

import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { PageHero } from "@/components/marketing/PageHero";
import { ContactForm } from "@/components/marketing/ContactForm";

export function ContactHero() {
  return (
    <PageHero
      title="Speak with our team"
      description="Reach the Finekarts trade desk, supplier relations, or general enquiries. Response times vary by department and enquiry complexity."
      primaryCta={{ href: "#contact-form", label: "Send a message →" }}
      secondaryCta={{ href: "/booking", label: "Book a consultation" }}
    />
  );
}

export function ContactChannels({
  email,
  phone,
  phoneDisplay,
}: {
  email: string;
  phone: string;
  phoneDisplay: string;
}) {
  const channels = [
    {
      title: "Trade desk",
      text: "RFQs, specifications, Incoterms, and logistics discussions for qualified buyers.",
      href: "/trade#purchase-request",
      linkLabel: "Submit a purchase request",
    },
    {
      title: "Supplier relations",
      text: "Programme introductions and trade offers. Portal access remains invitation-only after verification.",
      href: "/trade#trade-offer",
      linkLabel: "Submit a trade offer",
    },
    {
      title: "Consultations",
      text: "Request a conversation window. Preferred times are not confirmed until staff responds.",
      href: "/booking",
      linkLabel: "Book a consultation",
    },
  ];

  return (
    <section className="bg-[#0a1628] py-14 text-white lg:py-20">
      <div className="container-page">
        <Reveal>
          <p className="text-xs font-semibold tracking-[0.22em] text-[#d4a84b] uppercase">
            How to reach us
          </p>
        </Reveal>
        <Reveal delay={0.06}>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold sm:text-4xl">
            Choose the right path for your enquiry
          </h2>
        </Reveal>

        <div className="mt-10 grid gap-0 border-t border-white/15 md:grid-cols-3">
          {channels.map((item, i) => (
            <Reveal key={item.title} delay={0.1 + i * 0.06}>
              <div
                className={`border-b border-white/15 py-8 md:px-6 md:py-10 ${
                  i < 2 ? "md:border-r" : ""
                }`}
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.text}</p>
                <Link
                  href={item.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#d4a84b] transition hover:gap-3"
                >
                  {item.linkLabel} <span aria-hidden>→</span>
                </Link>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/15 pt-8 text-sm">
          <a
            href={`mailto:${email}`}
            className="font-semibold text-[#d4a84b] transition hover:text-[#e8bc5c]"
          >
            {email}
          </a>
          <a
            href={`tel:${phone}`}
            className="font-semibold text-[#d4a84b] transition hover:text-[#e8bc5c]"
          >
            {phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}

export function ContactFormSection({
  email,
  phone,
  phoneDisplay,
  addressLine1,
  addressLine2,
}: {
  email: string;
  phone: string;
  phoneDisplay: string;
  addressLine1: string;
  addressLine2: string;
}) {
  return (
    <section id="contact-form" className="scroll-mt-24 bg-[#f3f1ec] py-16 lg:py-24">
      <div className="container-page grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
        <div>
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.22em] text-[#c88e4a] uppercase">
              Message
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <h2 className="mt-3 text-3xl font-semibold text-[#001a3d] sm:text-4xl">
              Send a message
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-5 text-base leading-relaxed text-[#555555]">
              Tell us who you are, which department should receive the note, and what you need.
              Submitting a message does not create a binding trade commitment.
            </p>
          </Reveal>

          <dl className="mt-8 space-y-0 border-t border-[#d5d0c8]">
            <div className="border-b border-[#d5d0c8] py-5">
              <dt className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
                Email
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${email}`}
                  className="text-base font-semibold text-[#001a3d] underline decoration-[#c88e4a]/40 underline-offset-2"
                >
                  {email}
                </a>
              </dd>
            </div>
            <div className="border-b border-[#d5d0c8] py-5">
              <dt className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
                Phone
              </dt>
              <dd className="mt-2">
                <a
                  href={`tel:${phone}`}
                  className="text-base font-semibold text-[#001a3d] underline decoration-[#c88e4a]/40 underline-offset-2"
                >
                  {phoneDisplay}
                </a>
              </dd>
            </div>
            <div className="border-b border-[#d5d0c8] py-5">
              <dt className="text-xs font-semibold tracking-[0.16em] text-[#888] uppercase">
                Office address
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-[#555555]">
                {addressLine1}
                <br />
                {addressLine2}
              </dd>
            </div>
          </dl>

          <Reveal delay={0.16}>
            <div className="relative mt-10 hidden aspect-[5/4] overflow-hidden bg-white lg:block">
              <Image
                src="/images/home-3.png"
                alt="Global Finekarts sourcing and logistics network"
                fill
                className="object-contain object-center p-4"
                sizes="420px"
              />
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08} y={20}>
          <div className="border border-[#e4e0d8] bg-white p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-[#001a3d]">Enquiry form</h3>
            <p className="mt-2 text-sm text-[#666666]">
              Fields marked by validation are required. We route messages by department.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ContactCta() {
  return (
    <section className="relative overflow-hidden py-16 text-white lg:py-20">
      <Image
        src="/images/hero-commodities.png"
        alt=""
        fill
        className="object-cover object-center"
        sizes="100vw"
        aria-hidden
      />
      <div className="absolute inset-0 bg-[#071525]/85" />
      <div className="container-page relative text-center">
        <Reveal>
          <h2 className="mx-auto max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl">
            Prefer to start with a purchase request?
          </h2>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/70">
            Share product, quantity, destination, and preferred Incoterms. Submission does not
            guarantee acceptance or pricing.
          </p>
        </Reveal>
        <Reveal delay={0.14}>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/trade#purchase-request"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
            >
              Request a Quote <span aria-hidden>→</span>
            </Link>
            <Link
              href="/products"
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-md border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              Browse products
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
