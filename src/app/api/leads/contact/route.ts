import { leadRoute } from "@/lib/api/lead-route";
import { contactSchema } from "@/lib/validation/forms";

export const POST = leadRoute("contact", contactSchema);
