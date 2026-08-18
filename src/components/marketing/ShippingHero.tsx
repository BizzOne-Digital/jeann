"use client";

import Image from "next/image";
import Link from "next/link";
import { VideoBackground } from "@/components/marketing/VideoBackground";

export function ShippingHero() {
  return (
    <section className="relative min-h-[min(70vh,640px)] overflow-hidden bg-[var(--cream)] text-[var(--navy)]">
      <div className="absolute inset-0">
        <VideoBackground
          poster="/images/home-2.png"
          overlayClassName="absolute inset-0 bg-gradient-to-b from-white/75 via-white/55 to-[var(--cream)]/90"
        />
        <Image
          src="/images/home-2.png"
          alt=""
          fill
          className="object-cover opacity-0"
          sizes="100vw"
          priority
          aria-hidden
        />
      </div>
      <div className="container-page relative flex min-h-[min(70vh,640px)] flex-col justify-center py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--gold)]">
          Shipping & logistics
        </p>
        <h1 className="mt-3 max-w-2xl text-3xl font-semibold leading-tight sm:text-4xl lg:text-5xl">
          Seller and buyer responsibilities
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--stone)] sm:text-lg">
          Responsibilities depend on contract wording and the Incoterms edition referenced.
          Container, break-bulk bagged, and dry-bulk vessel programmes each allocate risk
          differently. Educational only — not legal advice.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/resources" className="btn btn-primary">
            Trade documents →
          </Link>
          <Link href="/inspections" className="btn btn-secondary">
            Inspections
          </Link>
        </div>
      </div>
    </section>
  );
}
