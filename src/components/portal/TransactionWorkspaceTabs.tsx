"use client";

import { useCallback, useEffect, useState } from "react";
import { WorkflowStepper, type WorkflowStepView } from "@/components/portal/WorkflowStepper";
import { TransactionDocumentsPanel } from "@/components/portal/TransactionDocumentsPanel";
import { TransactionFinancePanel } from "@/components/portal/TransactionFinancePanel";
import { TransactionWorkflowActions } from "@/components/portal/TransactionWorkflowActions";

type Tab = "overview" | "workflow" | "documents" | "finance" | "banking";

type TxDetail = {
  transaction: {
    id: string;
    transactionNumber: string;
    transactionType?: string;
    workflowLabel: string;
    workflowStatus: string;
    currentStepKey?: string;
    buyerVisibleNotes?: string;
    supplierVisibleNotes?: string;
    internalNotes?: string;
  };
  workflowSteps?: WorkflowStepView[];
  documents: Array<{
    id: string;
    title: string;
    documentType?: string;
    workflowStatus: string;
    currentVersionId?: string | null;
  }>;
  banking: {
    id?: string;
    instrumentId?: string;
    status: string;
    statusLabel?: string;
    instrumentType?: string;
    currency?: string;
    amount?: string;
  } | null;
  allowedTransitions?: string[];
  isInternal?: boolean;
  terms?: Record<string, unknown> | null;
};

export function TransactionWorkspaceTabs({
  transactionId,
  apiBase,
  mode,
  showFinance = false,
  showStaffActions = false,
}: {
  transactionId: string;
  apiBase: string;
  mode: "buyer" | "supplier";
  showFinance?: boolean;
  showStaffActions?: boolean;
}) {
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<TxDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch(`${apiBase}/${transactionId}`, { credentials: "same-origin" })
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Unable to load");
        setData(json);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Error"));
  }, [apiBase, transactionId]);

  useEffect(() => {
    load();
  }, [load]);

  if (error) return <p className="text-sm text-red-600">{error}</p>;
  if (!data) return <p className="text-sm text-[var(--stone)]">Loading transaction…</p>;

  const workflowMode =
    data.transaction.transactionType === "supplier_purchase" ? "supplier" : mode;

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    { id: "workflow", label: "Workflow" },
    { id: "documents", label: "Documents" },
    ...(showFinance ? [{ id: "finance" as Tab, label: "Finance" }] : []),
    { id: "banking", label: "Banking" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-[var(--line)] pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`rounded-md px-3 py-1.5 text-sm font-medium ${
              tab === t.id
                ? "bg-[var(--navy)] text-white"
                : "text-[var(--stone)] hover:bg-[var(--mist)]"
            }`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="space-y-4">
          <WorkflowStepper
            mode={workflowMode}
            steps={data.workflowSteps}
            currentStepKey={data.transaction.currentStepKey}
          />
          <section className="rounded-lg border border-[var(--line)] bg-white p-5">
            <h2 className="font-semibold text-[var(--navy)]">{data.transaction.transactionNumber}</h2>
            <p className="mt-2 text-sm text-[var(--stone)]">Status: {data.transaction.workflowLabel}</p>
            {data.transaction.buyerVisibleNotes ? (
              <p className="mt-2 text-sm">{data.transaction.buyerVisibleNotes}</p>
            ) : null}
            {data.transaction.supplierVisibleNotes ? (
              <p className="mt-2 text-sm">{data.transaction.supplierVisibleNotes}</p>
            ) : null}
            {data.isInternal && data.transaction.internalNotes ? (
              <p className="mt-2 text-sm text-amber-900">{data.transaction.internalNotes}</p>
            ) : null}
          </section>
        </div>
      ) : null}

      {tab === "workflow" ? (
        <div className="space-y-4">
          <WorkflowStepper
            mode={workflowMode}
            steps={data.workflowSteps}
            currentStepKey={data.transaction.currentStepKey}
          />
          {showStaffActions ? (
            <TransactionWorkflowActions
              transactionId={transactionId}
              allowedTransitions={data.allowedTransitions ?? []}
              isInternal
              onAction={load}
            />
          ) : null}
        </div>
      ) : null}

      {tab === "documents" ? (
        <TransactionDocumentsPanel
          transactionId={transactionId}
          documents={data.documents}
          canUpload
          onUploaded={load}
        />
      ) : null}

      {tab === "finance" && showFinance ? (
        <TransactionFinancePanel transactionId={transactionId} canView />
      ) : null}

      {tab === "banking" ? (
        <section className="rounded-lg border border-[var(--line)] bg-white p-5">
          <h2 className="font-semibold text-[var(--navy)]">Banking</h2>
          {data.banking ? (
            <dl className="mt-3 space-y-2 text-sm">
              {data.banking.instrumentId ? (
                <div>
                  <dt className="text-xs text-[var(--stone)]">Instrument ID</dt>
                  <dd className="font-medium text-[var(--navy)]">{data.banking.instrumentId}</dd>
                </div>
              ) : null}
              <div>
                <dt className="text-xs text-[var(--stone)]">Type</dt>
                <dd>{data.banking.instrumentType ?? "Banking instrument"}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--stone)]">Status</dt>
                <dd>{data.banking.statusLabel ?? data.banking.status.replaceAll("_", " ")}</dd>
              </div>
              {data.banking.currency && data.banking.amount ? (
                <div>
                  <dt className="text-xs text-[var(--stone)]">Amount</dt>
                  <dd>
                    {data.banking.currency} {data.banking.amount}
                  </dd>
                </div>
              ) : null}
            </dl>
          ) : (
            <p className="mt-2 text-sm text-[var(--stone)]">
              No banking instrument yet. Run <code>npm run seed:phase5</code> for test data, or
              select an instrument once the deal reaches Step 6.
            </p>
          )}
        </section>
      ) : null}
    </div>
  );
}
