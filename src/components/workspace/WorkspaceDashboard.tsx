"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StatPill } from "@/components/portal/StatPill";
import type { WorkspaceDashboardStats } from "@/lib/workspace/dashboard-service";

export function WorkspaceDashboard() {
  const [stats, setStats] = useState<WorkspaceDashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/workspace/dashboard", { credentials: "same-origin" })
      .then(async (res) => {
        const data = (await res.json()) as WorkspaceDashboardStats & { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Unable to load dashboard.");
        setStats(data);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, []);

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  if (!stats) {
    return <p className="text-sm text-[var(--stone)]">Loading operational queues…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatPill label="Pending purchase requests" value={String(stats.purchaseRequests)} />
        <StatPill label="Pending approvals" value={String(stats.pendingApprovals)} />
        <StatPill label="Active transactions" value={String(stats.activeTransactions)} />
        <StatPill label="Open tasks" value={String(stats.openTasks)} />
        <StatPill label="Active shipments" value={String(stats.shipmentLots)} />
        <StatPill label="Supplier offers in review" value={String(stats.pendingSupplierOffers)} />
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/workspace/transactions" className="btn btn-primary">
          Transactions
        </Link>
        <Link href="/admin/purchase-requests" className="btn btn-outline">
          Purchase requests
        </Link>
        <Link href="/workspace/shipments" className="btn btn-outline">
          Shipments
        </Link>
        <Link href="/workspace/finance" className="btn btn-outline">
          Finance
        </Link>
        <Link href="/workspace/suppliers" className="btn btn-outline">
          Suppliers
        </Link>
      </div>
    </div>
  );
}
