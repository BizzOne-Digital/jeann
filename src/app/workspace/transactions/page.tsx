"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PortalPage } from "@/components/portal/PortalPage";

type Item = {
  id: string;
  transactionNumber: string;
  workflowLabel: string;
  side: string;
  transactionType: string;
};

export default function WorkspaceTransactionsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/workspace/transactions", { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load");
        setItems(json.items ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  return (
    <PortalPage
      title="Transactions"
      description="Operate buyer and supplier workflows, documents, finance, and banking from one workspace."
    >
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {items.length === 0 && !error ? (
        <p className="text-sm text-[var(--stone)]">No transactions yet. Run seed scripts or create from admin.</p>
      ) : (
        <ul className="divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-white">
          {items.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm">
              <div>
                <Link
                  href={`/workspace/transactions/${t.id}`}
                  className="font-semibold text-[var(--navy)] underline"
                >
                  {t.transactionNumber}
                </Link>
                <p className="text-xs text-[var(--stone)]">
                  {t.transactionType} · {t.side} · {t.workflowLabel}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PortalPage>
  );
}
