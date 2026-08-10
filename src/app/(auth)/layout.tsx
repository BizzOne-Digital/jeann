import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full max-w-full overflow-x-clip bg-[var(--cream)] px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="mx-auto block w-full max-w-md font-display text-3xl font-semibold text-[var(--navy)]"
      >
        Finekarts
      </Link>
      <div className="mx-auto mt-5 w-full max-w-md rounded-xl border border-[var(--line)] bg-white p-5 shadow-[var(--shadow-soft)] sm:p-7">
        {children}
      </div>
    </main>
  );
}
