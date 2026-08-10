import { leadRoute } from "@/lib/api/lead-route";
import { purchaseRequestSchema } from "@/lib/validation/forms";

export const POST = leadRoute("purchase-request", purchaseRequestSchema);
