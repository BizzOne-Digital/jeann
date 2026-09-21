import {
  FINEKARTS_DUE_DILIGENCE_LEAD,
  FINEKARTS_TRADER_ROLE,
  FINEKARTS_TOOLS_DISCLAIMER,
} from "@/lib/content/trader-positioning";

type Variant = "full" | "compact";

export function TraderRoleNotice({ variant = "compact" }: { variant?: Variant }) {
  return (
    <aside
      className="rounded-lg border border-[#c88e4a]/35 bg-[#fff9eb] p-5 sm:p-6"
      role="note"
    >
      <p className="text-xs font-semibold tracking-[0.16em] text-[#001a3d] uppercase">
        Finekarts is a bulk commodity trader
      </p>
      <p className="mt-2 text-sm font-medium text-[#001a3d]">{FINEKARTS_TRADER_ROLE}</p>
      {variant === "full" ? (
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">{FINEKARTS_DUE_DILIGENCE_LEAD}</p>
      ) : (
        <p className="mt-3 text-sm leading-relaxed text-[#555555]">{FINEKARTS_TOOLS_DISCLAIMER}</p>
      )}
    </aside>
  );
}
