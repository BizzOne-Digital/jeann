import { leadRoute } from "@/lib/api/lead-route";
import { newsletterSchema } from "@/lib/validation/forms";

export const POST = leadRoute("newsletter", newsletterSchema);
