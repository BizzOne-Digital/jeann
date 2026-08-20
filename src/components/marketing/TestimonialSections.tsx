import Link from "next/link";
import type { PublicTestimonial } from "@/lib/content/testimonials-catalog";

export function TestimonialCard({ testimonial }: { testimonial: PublicTestimonial }) {
  return (
    <article className="flex h-full flex-col border border-[#d5d0c8] bg-white p-8">
      <p className="font-serif text-5xl leading-none text-[#c88e4a]" aria-hidden>
        “
      </p>
      <blockquote className="mt-3 flex-1 text-base leading-relaxed text-[#555555]">
        {testimonial.quote}
      </blockquote>
      <div className="mt-6 h-px w-16 bg-[#c88e4a]" />
      <p className="mt-5 text-sm font-semibold text-[#001a3d]">{testimonial.attribution}</p>
      {testimonial.company ? (
        <p className="text-sm text-[#001a3d]/80">{testimonial.company}</p>
      ) : null}
    </article>
  );
}

export function TestimonialsGrid({ testimonials }: { testimonials: PublicTestimonial[] }) {
  if (testimonials.length === 0) {
    return (
      <div className="border border-[#d5d0c8] bg-white px-6 py-14 text-center sm:px-10">
        <h2 className="text-2xl font-semibold text-[#001a3d] sm:text-3xl">
          Testimonials coming soon
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#666666]">
          Verified counterparties may share approved statements here once published through admin.
        </p>
        <Link
          href="/contact"
          className="focus-ring mt-8 inline-flex items-center gap-2 rounded-md bg-[#d4a84b] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#c4983f]"
        >
          Start a conversation <span aria-hidden>→</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  );
}

export function FeaturedTestimonialAside({
  testimonial,
}: {
  testimonial: PublicTestimonial | null;
}) {
  if (!testimonial) return null;

  return (
    <aside className="flex w-full flex-col justify-center rounded-lg bg-white/50 p-8 lg:p-10">
      <p className="text-xs font-semibold tracking-[0.2em] text-[#c88e4a] uppercase">
        Client Perspective
      </p>
      <p className="mt-4 font-serif text-5xl leading-none text-[#001a3d]" aria-hidden>
        “
      </p>
      <blockquote className="mt-2 text-base leading-relaxed text-[#555555]">
        {testimonial.quote}
      </blockquote>
      <div className="mt-6 h-px w-16 bg-[#c88e4a]" />
      <p className="mt-5 text-sm font-semibold text-[#001a3d]">{testimonial.attribution}</p>
      {testimonial.company ? (
        <p className="text-sm text-[#001a3d]/80">{testimonial.company}</p>
      ) : null}
      <Link
        href="/testimonials"
        className="mt-6 text-sm font-medium text-[#c88e4a] transition-colors hover:text-[#b57d3c]"
      >
        Read more testimonials →
      </Link>
    </aside>
  );
}
