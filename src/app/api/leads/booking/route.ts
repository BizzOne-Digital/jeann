import { leadRoute } from "@/lib/api/lead-route";
import { bookingSchema } from "@/lib/validation/forms";

export const POST = leadRoute("booking", bookingSchema, { requireBuyer: true });
