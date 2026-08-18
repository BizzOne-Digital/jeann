import Link from "next/link";

type Props = {
  title: string;
  description: string;
  registerHref?: string;
};

/** Shown on public pages where forms moved to the buyer portal. */
export function BuyerPortalGate({
  title,
  description,
  registerHref = "/register/buyer",
}: Props) {
  return (
    <div className="rounded-lg border border-[var(--line)] bg-white p-8 text-center shadow-[var(--shadow-soft)] sm:p-10">
      <h2 className="font-display text-2xl text-[var(--navy)]">{title}</h2>
      <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-[var(--stone)]">{description}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/login" className="btn btn-primary">
          Buyer sign in
        </Link>
        <Link href={registerHref} className="btn btn-secondary">
          Register
        </Link>
      </div>
      <p className="mt-6 text-sm text-[var(--stone)]">
        General company information remains public on{" "}
        <Link href="/about" className="font-semibold text-[var(--navy)] underline">
          About
        </Link>{" "}
        and{" "}
        <Link href="/faq" className="font-semibold text-[var(--navy)] underline">
          FAQ
        </Link>
        .
      </p>
    </div>
  );
}
