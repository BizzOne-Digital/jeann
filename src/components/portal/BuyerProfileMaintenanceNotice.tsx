import { BUYER_PROFILE_MAINTENANCE_DISCLAIMER } from "@/lib/content/buyer-portal-guidance";

export function BuyerProfileMaintenanceNotice() {
  return (
    <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
      {BUYER_PROFILE_MAINTENANCE_DISCLAIMER}
    </p>
  );
}
