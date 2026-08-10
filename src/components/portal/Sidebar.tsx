"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export interface PortalLink { href: string; label: string }

export function Sidebar({ title, links }: { title: string; links: PortalLink[] }) {
  const pathname = usePathname();
  return (
    <aside className="w-full max-w-full overflow-x-clip border-b border-[var(--line)] bg-[var(--navy)] p-4 text-white sm:p-5 md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
      <Link href="/" className="font-display text-2xl font-semibold">
        Finekarts
      </Link>
      <p className="mt-1 text-xs uppercase tracking-[0.16em] text-white/60">{title}</p>
      <nav className="-mx-1 mt-6 flex gap-1 overflow-x-auto px-1 pb-1 md:mx-0 md:flex-col md:overflow-visible md:px-0 md:pb-0">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm whitespace-nowrap ${pathname === link.href ? "bg-white/15 font-semibold" : "text-white/75 hover:bg-white/10 hover:text-white"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
