import { redirect } from "next/navigation";

/** Legacy URL — trade content moved to Resources + buyer portal. */
export default function TradeRedirect() {
  redirect("/resources");
}
