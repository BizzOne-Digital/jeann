"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BANKING_STATUS_LABELS } from "@/lib/banking/workflow";

type InstrumentItem = {
  id: string;
  instrumentId: string;
  transactionSide: string;
  currentStatus: string;
  currency: string;
  amount: string;
};

export function BankingAdviserDashboard() {
  const [assigned, setAssigned] = useState<InstrumentItem[]>([]);
  const [all, setAll] = useState<InstrumentItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/banking/instruments/assigned")
      .then(async (res) => {
        const json = await res.json();
        if (res.ok) setAssigned(json.items ?? []);
      })
      .catch(() => {});

    fetch("/api/banking/instruments")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load");
        setAll(json.items ?? []);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  const list = assigned.length > 0 ? assigned : all;

  return (
    <div className="space-y-6">
      <p className="text-sm text-[var(--stone)]">
        Coordination and record-management only. Uploaded documents are not authenticated by the
        platform unless authorized human evidence is recorded.
      </p>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <section>
        <h2 className="font-semibold text-[var(--navy)]">Assigned instruments</h2>
        {list.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--stone)]">No banking instruments yet.</p>
        ) : (
          <ul className="mt-3 divide-y divide-[var(--line)] rounded-lg border border-[var(--line)] bg-white">
            {list.map((i) => (
              <li key={i.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div>
                  <Link
                    href={`/portal/banking/instruments/${i.id}`}
                    className="font-medium text-[var(--navy)]"
                  >
                    {i.instrumentId}
                  </Link>
                  <p className="text-[var(--stone)]">
                    {i.transactionSide} · {BANKING_STATUS_LABELS[i.currentStatus] ?? i.currentStatus}
                  </p>
                </div>
                <span>{i.currency} {i.amount}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
