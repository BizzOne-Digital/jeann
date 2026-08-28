"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Renders children only after mount — avoids hydration mismatches from browser extensions on forms/buttons. */
export function ClientOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return fallback;
  return children;
}
