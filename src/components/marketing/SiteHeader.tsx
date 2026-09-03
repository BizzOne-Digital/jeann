"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { BrandLogo } from "@/components/marketing/BrandLogo";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/resources", label: "Resources" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

type Props = {
  /** When true, header is not individually fixed (parent shell handles stacking). */
  embedded?: boolean;
};

export function SiteHeader({ embedded = false }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <>
      <header
        className={cn(
          "w-full max-w-full overflow-x-clip border-b border-white/10 bg-[#1b3a5c] text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)]",
          !embedded && "fixed inset-x-0 top-0 z-[70]",
        )}
      >
        <div className="container-page flex h-[4.75rem] min-w-0 items-center justify-between gap-2 lg:gap-3">
          <Link href="/" className="focus-ring flex shrink-0 items-center gap-3 rounded-sm">
            <BrandLogo size="md" priority />
            <span className="hidden leading-tight md:block">
              <span className="block whitespace-nowrap text-[0.85rem] font-bold tracking-[0.16em] text-white uppercase sm:text-[0.95rem] sm:tracking-[0.2em]">
                Finekarts
              </span>
              <span className="block whitespace-nowrap text-[0.55rem] font-medium uppercase tracking-[0.24em] text-white/55 sm:text-[0.6rem] sm:tracking-[0.32em]">
                Incorporated
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {NAV.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "focus-ring relative px-3 py-2 text-[0.95rem] font-medium tracking-wide transition-colors",
                    active ? "text-[#d4a84b]" : "text-[#e8eef2] hover:text-white",
                  )}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute inset-x-3.5 -bottom-0.5 h-[2px] bg-[#d4a84b]" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex lg:gap-3">
            <LanguageSwitcher />
            <Link
              href="/login"
              className="focus-ring inline-flex items-center gap-2 whitespace-nowrap rounded-sm border border-[#d4a84b] bg-[#d4a84b]/10 px-4 py-2 text-sm font-semibold text-[#f5e6c8] transition hover:bg-[#d4a84b] hover:text-[#071525] lg:px-5 lg:py-2.5"
            >
              Buyer Portal
              <span aria-hidden>→</span>
            </Link>
          </div>

          <button
            type="button"
            className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-[#d4a84b]/50 bg-[#0a2844] text-[#d4a84b] lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="flex w-5 flex-col gap-1.5">
              <span className={cn("h-0.5 bg-white transition", open && "translate-y-2 rotate-45")} />
              <span className={cn("h-0.5 bg-white transition", open && "opacity-0")} />
              <span className={cn("h-0.5 bg-white transition", open && "-translate-y-2 -rotate-45")} />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[80] lg:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-[#04101f]/90 backdrop-blur-sm"
              aria-label="Close menu"
              onClick={closeMenu}
            />
            <motion.div
              className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-[#1b3a5c] text-white shadow-[-12px_0_40px_rgba(0,0,0,0.35)]"
              initial={reduce ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduce ? undefined : { x: "100%" }}
              transition={{ type: "tween", duration: 0.25 }}
            >
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <p className="text-sm font-semibold tracking-wide text-[#d4a84b]">Menu</p>
                <button
                  type="button"
                  className="rounded-md border border-white/20 px-3 py-1.5 text-sm text-white"
                  onClick={closeMenu}
                >
                  Close
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto px-5 py-4" aria-label="Mobile primary">
                {NAV.map((item) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={cn(
                        "block border-b border-white/10 py-4 text-lg font-semibold",
                        active ? "text-[#d4a84b]" : "text-white",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
              <div className="space-y-3 border-t border-white/10 p-5">
                <LanguageSwitcher className="w-full [&_button]:w-full [&_button]:justify-center" />
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[#d4a84b] px-5 py-3 font-semibold text-white"
                >
                  Buyer Portal →
                </Link>
                <Link
                  href="/register/buyer"
                  onClick={closeMenu}
                  className="inline-flex w-full items-center justify-center rounded-sm bg-[#d4a84b] px-5 py-3 font-semibold text-[#071525]"
                >
                  Register as buyer
                </Link>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
