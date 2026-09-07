import Link from "next/link";
import {
  getBulkMinimumMt,
  getBulkOnlyNotice,
} from "@/lib/marketing/bulk-order-minimums";
import { buyerOrderHref } from "@/lib/marketing/cta-links";
import { cn } from "@/lib/utils/cn";

type Props = {
  categorySlug: string;
  productSlug?: string;
  className?: string;
  compact?: boolean;
};

export function BulkOrderBox({ categorySlug, productSlug, className, compact }: Props) {
  const minimumMt = getBulkMinimumMt(categorySlug, productSlug);
  const orderHref = buyerOrderHref(productSlug);

  return (
    <div
      className={cn(
        "rounded-lg border border-[#c88e4a]/40 bg-[#fff9ef]",
        compact ? "p-4" : "p-5 sm:p-6",
        className,
      )}
    >
      <p className="text-xs font-semibold tracking-[0.18em] text-[#c88e4a] uppercase">
        Bulk supply only
      </p>
      {minimumMt ? (
        <p className="mt-2 text-lg font-semibold text-[#001a3d] sm:text-xl">
          {minimumMt.toLocaleString("en-US")} MT minimum order
        </p>
      ) : (
        <p className="mt-2 text-lg font-semibold text-[#001a3d] sm:text-xl">
          Minimum volumes per enquiry
        </p>
      )}
      <p className="mt-2 text-sm leading-relaxed text-[#555555]">{getBulkOnlyNotice()}</p>
      <Link
        href={orderHref}
        className="focus-ring mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#c88e4a] transition hover:text-[#a87338]"
      >
        Click here to ORDER <span aria-hidden>→</span>
      </Link>
    </div>
  );
}
