import Link from "next/link";
import { BuyerDecisionActions } from "@/components/admin/BuyerDecisionActions";
import { loadBuyerDetail } from "@/lib/admin/buyer-approval";
import { verifyBuyerDecisionToken } from "@/lib/admin/buyer-decision-token";
import { tryConnectMongo } from "@/lib/db/mongoose";

export const dynamic = "force-dynamic";

/** Opened from the notification email: the admin sees who the buyer is and approves or declines. */
export default async function BuyerDecisionPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const check = verifyBuyerDecisionToken(token);

  if (!check.ok || !token) {
    return (
      <div className="space-y-3">
        <h1 className="font-display text-2xl text-[var(--navy)]">Link not valid</h1>
        <p className="text-sm text-[var(--stone)]">
          {check.ok === false && check.reason === "expired"
            ? "This link has expired."
            : "This link is not valid."}{" "}
          You can still review the buyer in the admin.
        </p>
        <Link href="/admin/buyers" className="btn btn-primary inline-flex">
          Open Buyer Organizations
        </Link>
      </div>
    );
  }

  const ready = await tryConnectMongo();
  const buyer = ready ? await loadBuyerDetail(check.orgId) : null;
  if (!buyer) {
    return <p className="text-sm text-[var(--stone)]">This buyer could not be found.</p>;
  }

  return (
    <div className="space-y-4">
      <h1 className="font-display text-2xl text-[var(--navy)]">Buyer awaiting your decision</h1>
      <dl className="grid gap-2 text-sm">
        <div><dt className="text-[var(--stone)]">Company</dt><dd className="font-semibold text-[var(--navy)]">{buyer.legalName}</dd></div>
        <div><dt className="text-[var(--stone)]">Country</dt><dd>{buyer.country}</dd></div>
        {buyer.registrationNumber ? (
          <div><dt className="text-[var(--stone)]">Registration number</dt><dd>{buyer.registrationNumber}</dd></div>
        ) : null}
        {buyer.primaryContact ? (
          <div>
            <dt className="text-[var(--stone)]">Contact</dt>
            <dd>{buyer.primaryContact.name} · {buyer.primaryContact.email}{buyer.primaryContact.phone ? " · " + buyer.primaryContact.phone : ""}</dd>
          </div>
        ) : null}
        <div><dt className="text-[var(--stone)]">Status</dt><dd className="capitalize">{buyer.status}</dd></div>
      </dl>

      {buyer.status === "pending" ? (
        <BuyerDecisionActions token={token} />
      ) : (
        <p className="rounded-md border border-[var(--line)] bg-[var(--mist)] px-4 py-3 text-sm text-[var(--navy)]">
          This buyer has already been decided ({buyer.status}).
        </p>
      )}

      <p className="text-xs text-[var(--stone)]">
        Prefer to check more first?{" "}
        <Link href={`/admin/buyers/${buyer._id}`} className="font-semibold underline">Open this buyer in the admin</Link>.
      </p>
    </div>
  );
}
