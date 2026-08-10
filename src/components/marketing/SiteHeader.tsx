"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { isHeroMarketingPage } from "@/lib/marketing/hero-pages";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/products", label: "Products" },
  { href: "/trade", label: "Trade" },
  { href: "/booking", label: "Booking" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();
  const isHeroPage = isHeroMarketingPage(pathname);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);
  const solid = scrolled || !isHeroPage || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full max-w-full overflow-x-clip transition-[background-color,box-shadow,backdrop-filter] duration-300",
        solid
          ? "bg-[#071525]/95 shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <div className="container-page flex h-[4.75rem] min-w-0 items-center justify-between gap-3">
        <Link href="/" className="focus-ring flex min-w-0 items-center gap-2.5 rounded-sm sm:gap-3">
          <span className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-white sm:h-11 sm:w-11">
            <Image
              src="/brand/finekarts-logo.png"
              alt="Finekarts"
              width={44}
              height={44}
              priority
              className="h-full w-full object-cover"
            />
          </span>
          <span className="min-w-0 leading-tight">
            <span className="block truncate text-[0.85rem] font-bold tracking-[0.16em] text-white uppercase sm:text-[0.95rem] sm:tracking-[0.2em]">
              Finekarts
            </span>
            <span className="block truncate text-[0.55rem] font-medium uppercase tracking-[0.24em] text-white/55 sm:text-[0.6rem] sm:tracking-[0.32em]">
              Incorporated
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
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
                  "focus-ring relative px-3.5 py-2 text-[0.95rem] font-medium tracking-wide transition-colors",
                  active
                    ? "text-[#ffffff] hover:text-[#ffffff]"
                    : "text-[#d8e0ea] hover:text-[#ffffff]",
                )}
                style={{ color: active ? "#ffffff" : "#d8e0ea" }}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-[2px] bg-[#d4a84b]" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center xl:flex">
          <Link
            href="/login"
            className="focus-ring inline-flex items-center gap-2 rounded-sm border border-[#d4a84b] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d4a84b] hover:text-[#071525]"
          >
            Buyer Portal
            <span aria-hidden>→</span>
          </Link>
        </div>

        <button
          type="button"
          className="focus-ring relative z-[60] flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-white xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <span className="flex w-5 flex-col gap-1.5">
            <span className={cn("h-0.5 bg-white transition", open && "translate-y-2 rotate-45")} />
            <span className={cn("h-0.5 bg-white transition", open && "opacity-0")} />
            <span className={cn("h-0.5 bg-white transition", open && "-translate-y-2 -rotate-45")} />
          </span>
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            id="mobile-nav"
            className="fixed inset-0 z-50 bg-[#071525] text-white xl:hidden"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="container-page flex h-full flex-col pt-24">
              <nav className="flex flex-col gap-1" aria-label="Mobile primary">
                {NAV.map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i }}
                  >
                    <Link
                      href={item.href}
                      onClick={closeMenu}
                      className="block border-b border-white/10 py-4 text-3xl font-semibold tracking-tight"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>
              <div className="mt-8 flex flex-col gap-3 pb-10">
                <Link
                  href="/login"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center gap-2 rounded-sm border border-[#d4a84b] px-5 py-3 font-semibold text-white"
                >
                  Buyer Portal →
                </Link>
                <Link
                  href="/trade#purchase-request"
                  onClick={closeMenu}
                  className="inline-flex items-center justify-center rounded-sm bg-[#d4a84b] px-5 py-3 font-semibold text-white"
                >
                  Post a Purchase Request
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
