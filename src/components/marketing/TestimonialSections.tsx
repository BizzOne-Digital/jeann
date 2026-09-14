"use client";

import Image from "next/image";
import Link from "next/link";
import type { PublicTestimonial } from "@/lib/content/testimonials-catalog";
import {
  formatTestimonialDate,
  testimonialInitials,
} from "@/lib/content/testimonials-shared";
import { resolveImageSrc } from "@/lib/media/resolve-image-src";
import { Reveal } from "@/components/motion/Reveal";

const TRUSTPILOT_GREEN = "#00b67a";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      aria-hidden
      fill={filled ? TRUSTPILOT_GREEN : "#d5d0c8"}
    >
      <path
        d="M12 1.5l2.93 5.94 6.56.95-4.75 4.63 1.12 6.53L12 16.9l-5.86 3.08 1.12-6.53L2.51 8.39l6.56-.95L12 1.5z"
      />
    </svg>
  );
}

export function TestimonialStars({
  rating,
  label,
}: {
  rating: number;
  label?: string;
}) {
  const rounded = Math.max(1, Math.min(5, Math.round(rating)));

  return (
    <div className="flex items-center gap-0.5" aria-label={label ?? `${rounded} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <StarIcon key={index} filled={index < rounded} />
      ))}
    </div>
  );
}

function TestimonialAvatar({ testimonial }: { testimonial: PublicTestimonial }) {
  const initials = testimonialInitials(testimonial.name);
  const photoSrc = resolveImageSrc(testimonial.photo);

  if (photoSrc) {
    return (
      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[#e8e4dc] bg-[#f3f1ec]">
        <Image
          src={photoSrc}
          alt={testimonial.name}
          fill
          className="object-cover"
          sizes="48px"
        />
      </div>
    );
  }

  return (
    <div
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#001a3d] text-sm font-semibold text-white"
      aria-hidden
    >
      {initials}
    </div>
  );
}

export function TestimonialCard({ testimonial }: { testimonial: PublicTestimonial }) {
  const reviewedLabel = formatTestimonialDate(testimonial.reviewedAt);

  return (
    <article
      className="flex h-full flex-col rounded-lg border border-[#e8e4dc] bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-md"
      itemScope
      itemType="https://schema.org/Review"
    >
      <div className="flex items-start justify-between gap-3">
        <TestimonialStars rating={testimonial.rating} />
        <span className="rounded-full bg-[#eef8f3] px-2.5 py-1 text-[0.65rem] font-semibold tracking-wide text-[#00895b] uppercase">
          Verified
        </span>
      </div>

      <blockquote
        className="mt-4 flex-1 text-sm leading-relaxed text-[#444444]"
        itemProp="reviewBody"
      >
        {testimonial.quote}
      </blockquote>

      <footer className="mt-6 flex items-center gap-3 border-t border-[#f0ece4] pt-5">
        <TestimonialAvatar testimonial={testimonial} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#001a3d]" itemProp="author">
            {testimonial.name}
          </p>
          <p className="truncate text-xs text-[#666666]">
            {testimonial.position}
            {testimonial.company ? (
              <>
                <span className="mx-1 text-[#cccccc]">·</span>
                <span itemProp="name">{testimonial.company}</span>
              </>
            ) : null}
          </p>
          {reviewedLabel ? (
            <p className="mt-1 text-[0.7rem] text-[#999999]">{reviewedLabel}</p>
          ) : null}
        </div>
      </footer>
    </article>
  );
}

export function TestimonialsSummaryBar({
  count,
  averageRating,
}: {
  count: number;
  averageRating: number;
}) {
  if (count === 0) return null;

  return (
    <div className="mb-10 flex flex-wrap items-center justify-between gap-6 rounded-lg border border-[#e8e4dc] bg-white px-6 py-5 sm:px-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-[#c88e4a] uppercase">
          Client reviews
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <p className="text-3xl font-semibold text-[#001a3d]">{averageRating.toFixed(1)}</p>
          <div>
            <TestimonialStars rating={averageRating} />
            <p className="mt-1 text-sm text-[#666666]">
              Based on {count} verified {count === 1 ? "review" : "reviews"}
            </p>
          </div>
        </div>
      </div>
      <div className="rounded-md border border-dashed border-[#d5d0c8] bg-[#faf9f7] px-4 py-3 text-sm text-[#666666]">
        <p className="font-semibold text-[#001a3d]">Trustpilot-ready</p>
        <p className="mt-1 max-w-xs text-xs leading-relaxed">
          Reviews are managed here today. A Trustpilot widget can be connected in this section later.
        </p>
      </div>
    </div>
  );
}

export function TestimonialsGrid({ testimonials }: { testimonials: PublicTestimonial[] }) {
  if (testimonials.length === 0) {
    return (
      <Reveal>
        <div className="border border-[#d5d0c8] bg-white px-6 py-14 text-center sm:px-10">
          <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
            Testimonials coming soon
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#666666]">
            Verified counterparties may share approved statements here once published through admin.
          </p>
          <Link
            href="/contact"
            className="focus-ring mt-8 inline-flex items-center gap-2 marketing-btn-primary px-6 py-3.5 text-sm font-semibold"
          >
            Start a conversation <span aria-hidden>→</span>
          </Link>
        </div>
      </Reveal>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {testimonials.map((testimonial, index) => (
        <Reveal key={testimonial.id} delay={index * 0.06} y={24}>
          <TestimonialCard testimonial={testimonial} />
        </Reveal>
      ))}
    </div>
  );
}

export function TrustpilotPlaceholder() {
  return (
    <section
      id="trustpilot-widget"
      className="mt-12 rounded-lg border border-[#e8e4dc] bg-white px-6 py-8 text-center sm:px-10"
      aria-label="Trustpilot integration placeholder"
    >
      <p className="text-xs font-semibold tracking-[0.18em] text-[#00b67a] uppercase">
        Trustpilot
      </p>
      <h3 className="mt-2 text-xl font-semibold text-[#001a3d]">Live Trustpilot feed coming soon</h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[#666666]">
        This block is reserved for the official Trustpilot widget. Until then, reviews on this page
        are published and managed through the Finekarts admin panel.
      </p>
    </section>
  );
}

export function FeaturedTestimonialAside({
  testimonial,
}: {
  testimonial: PublicTestimonial | null;
}) {
  if (!testimonial) return null;

  const reviewedLabel = formatTestimonialDate(testimonial.reviewedAt);

  return (
    <Reveal y={20}>
      <aside className="flex w-full flex-col justify-center rounded-lg bg-white/50 p-8 lg:p-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
          Client Perspective
        </p>
        <div className="mt-4">
          <TestimonialStars rating={testimonial.rating} />
        </div>
        <blockquote className="mt-3 text-base leading-relaxed text-[#555555]">
          {testimonial.quote}
        </blockquote>
        <div className="mt-6 flex items-center gap-3">
          <TestimonialAvatar testimonial={testimonial} />
          <div>
            <p className="text-sm font-semibold text-[#001a3d]">{testimonial.name}</p>
            <p className="text-sm text-[#001a3d]/80">
              {testimonial.position}
              {testimonial.company ? ` · ${testimonial.company}` : ""}
            </p>
            {reviewedLabel ? (
              <p className="mt-1 text-xs text-[#888888]">{reviewedLabel}</p>
            ) : null}
          </div>
        </div>
        <Link
          href="/testimonials"
          className="mt-6 text-sm font-medium text-[#c88e4a] transition-colors hover:text-[#b57d3c]"
        >
          Read more testimonials →
        </Link>
      </aside>
    </Reveal>
  );
}
