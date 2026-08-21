"use client";

import Link from "next/link";

export type AdminBuyerListItem = {
  _id: string;
  legalName: string;
  country: string;
  status: string;
  createdAt: string | null;
  contactEmail: string;
  contactName: string;
};

export function AdminBuyersList({ items }: { items: AdminBuyerListItem[] }) {
  return (
    <div className="table-scroll rounded-lg border border-[var(--line)] bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-[var(--line)] bg-[var(--cream)]/60 text-xs uppercase tracking-wide text-[var(--stone)]">
          <tr>
            <th className="px-4 py-3 font-semibold">Organization</th>
            <th className="px-4 py-3 font-semibold">Contact</th>
            <th className="px-4 py-3 font-semibold">Country</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Registered</th>
            <th className="px-4 py-3 font-semibold" />
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id} className="border-b border-[var(--line)] last:border-0">
              <td className="px-4 py-3 font-semibold text-[var(--navy)]">{item.legalName}</td>
              <td className="px-4 py-3">
                <p>{item.contactName || "—"}</p>
                <p className="text-xs text-[var(--stone)]">{item.contactEmail || "—"}</p>
              </td>
              <td className="px-4 py-3">{item.country}</td>
              <td className="px-4 py-3 capitalize">{item.status}</td>
              <td className="px-4 py-3 text-[var(--stone)]">{item.createdAt ?? "—"}</td>
              <td className="px-4 py-3 text-right">
                <Link
                  href={`/admin/buyers/${item._id}`}
                  className="text-sm font-semibold text-[var(--navy)] underline"
                >
                  Review →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {items.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-[var(--stone)]">No buyer organizations yet.</p>
      ) : null}
    </div>
  );
}
