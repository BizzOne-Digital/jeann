"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { MARKETING_HEADER_HEIGHT_CLASS } from "@/lib/marketing/hero-layout";
import { isHeroMarketingPage, isLightHeroPage } from "@/lib/marketing/hero-pages";
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

const SCROLL_THRESHOLD = 16;

function subscribeToScroll(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  return () => window.removeEventListener("scroll", onStoreChange);
}

function getScrollSnapshot() {
  return window.scrollY > SCROLL_THRESHOLD;
}

function getScrollServerSnapshot() {
  return false;
}

export function SiteHeader({ embedded = false }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const scrolled = useSyncExternalStore(subscribeToScroll, getScrollSnapshot, getScrollServerSnapshot);
  const reduce = useReducedMotion();
  const isHero = isHeroMarketingPage(pathname);
  const isLight = isLightHeroPage(pathname);
  const transparent = isHero && !isLight && !scrolled && !open;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const hideLogo = pathname === "/about";

  return (
    <>
      <header
        className={cn(
          "w-full max-w-full overflow-x-clip transition-[background-color,box-shadow,backdrop-filter,border-color] duration-300",
          !embedded && "fixed inset-x-0 top-0 z-[70]",
          transparent
            ? "border-b border-transparent bg-transparent text-white shadow-none"
            : isLight
              ? "border-b border-[var(--line)] bg-white/95 text-[var(--ink)] shadow-[0_4px_24px_rgba(27,58,92,0.08)] backdrop-blur-md"
              : "border-b border-white/10 bg-[#1b3a5c]/95 text-white shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-md",
        )}
      >
        <div className={`container-page flex ${MARKETING_HEADER_HEIGHT_CLASS} min-w-0 items-center justify-between gap-2 lg:gap-3`}>
          {hideLogo ? (
            <div className="hidden shrink-0 lg:block lg:w-0" aria-hidden />
          ) : (
            <Link href="/" className="focus-ring flex shrink-0 items-center gap-3 rounded-sm">
              <BrandLogo size="md" priority />
              <span className="hidden leading-tight md:block">
                <span
                  className={cn(
                    "block whitespace-nowrap text-[0.85rem] font-bold tracking-[0.16em] uppercase sm:text-[0.95rem] sm:tracking-[0.2em]",
                    transparent || !isLight ? "text-white" : "text-[var(--navy)]",
                  )}
                >
                  Finekarts
                </span>
                <span
                  className={cn(
                    "block whitespace-nowrap text-[0.55rem] font-medium uppercase tracking-[0.24em] sm:text-[0.6rem] sm:tracking-[0.32em]",
                    transparent ? "text-white/55" : isLight ? "text-[var(--stone)]" : "text-white/55",
                  )}
                >
                  Incorporated
                </span>
              </span>
            </Link>
          )}

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
                    "focus-ring relative px-3 py-2 text-[0.95rem] font-medium tracking-wide transition-colors duration-200",
                    transparent
                      ? active
                        ? "text-[#d4a84b]"
                        : "text-white/75 hover:text-white"
                      : isLight
                        ? active
                          ? "text-[var(--navy)]"
                          : "text-[var(--stone)] hover:text-[var(--navy)]"
                        : active
                          ? "text-[#d4a84b]"
                          : "text-white/70 hover:text-white",
                  )}
                >
                  {item.label}
                  {active ? (
                    <span
                      className={cn(
                        "absolute inset-x-3.5 -bottom-0.5 h-[2px]",
                        isLight && !transparent ? "bg-[var(--ocean)]" : "bg-[#d4a84b]",
                      )}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex lg:gap-3">
            <LanguageSwitcher />
            <Link
              href="/login"
              className={cn(
                "focus-ring inline-flex items-center gap-2 whitespace-nowrap rounded-sm border px-4 py-2 text-sm font-semibold transition lg:px-5 lg:py-2.5",
                transparent
                  ? "border-[#d4a84b] text-white hover:bg-[#d4a84b] hover:text-[#071525]"
                  : isLight
                    ? "border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
                    : "border-[#d4a84b] bg-[#d4a84b]/10 text-[#f5e6c8] hover:bg-[#d4a84b] hover:text-[#071525]",
              )}
            >
              Buyer Portal
              <span aria-hidden>→</span>
            </Link>
          </div>

          <button
            type="button"
            className={cn(
              "focus-ring flex h-11 w-11 items-center justify-center rounded-full border lg:hidden",
              transparent
                ? "border-white/25 text-white"
                : isLight
                  ? "border-[var(--line-strong)] text-[var(--navy)]"
                  : "border-[#d4a84b]/50 bg-[#0a2844] text-[#d4a84b]",
            )}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <span className="flex w-5 flex-col gap-1.5">
              <span
                className={cn(
                  "h-0.5 transition",
                  open && "translate-y-2 rotate-45",
                  transparent || !isLight ? "bg-white" : "bg-[var(--navy)]",
                )}
              />
              <span
                className={cn(
                  "h-0.5 transition",
                  open && "opacity-0",
                  transparent || !isLight ? "bg-white" : "bg-[var(--navy)]",
                )}
              />
              <span
                className={cn(
                  "h-0.5 transition",
                  open && "-translate-y-2 -rotate-45",
                  transparent || !isLight ? "bg-white" : "bg-[var(--navy)]",
                )}
              />
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
              className="absolute inset-y-0 right-0 flex w-[min(100%,22rem)] flex-col bg-[var(--navy)] text-white shadow-[-12px_0_40px_rgba(0,0,0,0.35)]"
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
                        "block border-b border-white/10 py-4 text-lg font-semibold transition-colors duration-200",
                        active ? "text-[#d4a84b]" : "text-white/75 hover:text-white",
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
