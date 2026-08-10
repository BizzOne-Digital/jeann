import { leadRoute } from "@/lib/api/lead-route";
import { tradeOfferSchema } from "@/lib/validation/forms";

export const POST = leadRoute("trade-offer", tradeOfferSchema);
