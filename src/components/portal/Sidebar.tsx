"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export interface PortalLink { href: string; label: string }

export function Sidebar({ title, links }: { title: string; links: PortalLink[] }) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  async function onLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });
    } catch {
      // Cookie is cleared server-side when possible; always send user to login.
    }
    window.location.assign("/login");
  }

  return (
    <aside className="flex w-full max-w-full flex-col overflow-x-clip border-b border-[var(--line)] bg-[var(--navy)] p-4 text-white sm:p-5 md:min-h-screen md:w-64 md:shrink-0 md:border-b-0 md:border-r">
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
      <div className="mt-4 border-t border-white/10 pt-4 md:mt-auto">
        <button
          type="button"
          onClick={onLogout}
          disabled={loggingOut}
          className="w-full rounded-md border border-white/25 px-3 py-2.5 text-left text-sm font-semibold text-white/90 transition hover:bg-white/10 disabled:opacity-60 md:text-center"
        >
          {loggingOut ? "Signing out…" : "Log out"}
        </button>
      </div>
    </aside>
  );
}
