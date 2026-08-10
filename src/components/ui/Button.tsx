import Link from "next/link";
import { cn } from "@/lib/utils/cn";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "gold";

const variants: Record<Variant, string> = {
  primary: "btn btn-primary focus-ring",
  secondary: "btn btn-secondary focus-ring",
  gold: "btn btn-gold focus-ring",
};

export function Button({
  variant = "primary",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cn(variants[variant], className)} {...props} />;
}

export function ButtonLink({
  href,
  variant = "primary",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return (
    <Link href={href} className={cn(variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
