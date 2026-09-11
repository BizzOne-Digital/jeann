import type { ActiveSession } from "@/lib/auth/session";
import { getBuyerFormDefaults } from "@/lib/auth/buyer-profile";

export type CareerFormPrefill = {
  fullName: string;
  email: string;
  phone: string;
};

/** Prefill career applications when a visitor is signed in. */
export async function getCareerFormPrefill(
  session: ActiveSession,
): Promise<CareerFormPrefill> {
  try {
    const buyer = await getBuyerFormDefaults(session);
    return {
      fullName: buyer.contactName,
      email: buyer.email,
      phone: buyer.phone,
    };
  } catch {
    return {
      fullName: session.user.name ?? "",
      email: session.user.email ?? "",
      phone: session.user.phone ?? "",
    };
  }
}
