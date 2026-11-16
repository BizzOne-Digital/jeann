"use client";

import { useCallback, useEffect, useState } from "react";
import { WorkflowStepper, type WorkflowStepView } from "@/components/portal/WorkflowStepper";
import { TransactionDocumentsPanel } from "@/components/portal/TransactionDocumentsPanel";
import { BuyerLcDetailsForm } from "@/components/portal/BuyerLcDetailsForm";
import { StaffDocumentTools } from "@/components/portal/StaffDocumentTools";
import { TransactionFinancePanel } from "@/components/portal/TransactionFinancePanel";
import { TransactionWorkflowActions } from "@/components/portal/TransactionWorkflowActions";
import { AdminSevenSteps } from "@/components/portal/AdminSevenSteps";

type Tab = "overview" | "steps" | "workflow" | "documents" | "finance" | "banking";

type TxDetail = {
  transaction: {
    id: string;
    transactionNumber: string;
    transactionType?: string;
    workflowLabel: string;
    workflowStatus: string;
    status?: string;
    currentStepKey?: string;
    buyerVisibleNotes?: string;
    supplierVisibleNotes?: string;
    internalNotes?: string;
  };
  workflowSteps?: WorkflowStepView[];
  fisOnRecord?: boolean;
  cisOnRecord?: boolean;
  documents: Array<{
    id: string;
    title: string;
    documentType?: string;
    workflowStatus: string;
    bankingVisible?: boolean;
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

  // CIS, RWA and FIS are verification documents: upload, then Finekarts verifies. No blocking rules.
  const rwaNotice =
    workflowMode === "buyer" ? (
      <div className="rounded-lg border border-[var(--line)] bg-white p-4 text-sm text-[var(--stone)]">
        <p className="font-medium text-[var(--navy)]">CIS, RWA and FIS</p>
        <p className="mt-1">
          Finekarts requests these documents in the offer or during the trade discussion. Upload them
          below (types: RWA, CIS and FIS) and Finekarts will verify them. If you need our CIS form,
          ask your trade desk and we will send it to you.
        </p>
      </div>
    ) : null;

  const amendments = data.documents.filter((d) => d.documentType === "contract_amendment");

  const tabs: { id: Tab; label: string }[] = [
    { id: "overview", label: "Overview" },
    ...(showStaffActions && workflowMode === "buyer" ? [{ id: "steps" as Tab, label: "7 steps" }] : []),
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

      {tab === "steps" && showStaffActions ? (
        <AdminSevenSteps
          transactionId={transactionId}
          documents={data.documents}
          isLocked={data.transaction.status === "completed" || data.transaction.status === "cancelled"}
          onChanged={load}
          onOpenDocuments={() => setTab("documents")}
        />
      ) : null}

      {tab === "workflow" ? (
        <div className="space-y-4">
          <WorkflowStepper
            mode={workflowMode}
            steps={data.workflowSteps}
            currentStepKey={data.transaction.currentStepKey}
          />
          <section className="rounded-lg border border-[var(--line)] bg-white p-4 text-sm">
            <h3 className="font-semibold text-[var(--navy)]">Column 8: Amendments</h3>
            <p className="mt-1 text-xs text-[var(--stone)]">
              Amendments can be requested at any time and are not a blocking step. The bank sets the
              amendment fee and it is added to the total cost of the amended PSA. Upload amendment
              documents on the Documents tab (type: Amendment).
            </p>
            {amendments.length === 0 ? (
              <p className="mt-2 text-[var(--stone)]">No amendments on this transaction.</p>
            ) : (
              <ul className="mt-2 divide-y divide-[var(--line)]">
                {amendments.map((d) => (
                  <li key={d.id} className="flex justify-between gap-2 py-2">
                    <span>{d.title}</span>
                    <span className="text-xs text-[var(--stone)]">{d.workflowStatus.replaceAll("_", " ")}</span>
                  </li>
                ))}
              </ul>
            )}
            <button type="button" className="btn btn-secondary mt-3 text-xs" onClick={() => setTab("documents")}>
              Upload or view amendment documents
            </button>
          </section>
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
        <div className="space-y-6">
          {rwaNotice}
          <TransactionDocumentsPanel
            transactionId={transactionId}
            documents={data.documents}
            canUpload
            onUploaded={load}
            mode={workflowMode}
            isStaff={showStaffActions}
          />
          {showStaffActions && data.isInternal !== false ? (
            <StaffDocumentTools
              transactionId={transactionId}
              documents={data.documents}
              onChanged={load}
            />
          ) : null}
        </div>
      ) : null}

      {tab === "finance" && showFinance ? (
        <TransactionFinancePanel transactionId={transactionId} canView />
      ) : null}

      {tab === "banking" && !showStaffActions && workflowMode === "buyer" ? (
        <div className="space-y-4">
          {rwaNotice}
          <BuyerLcDetailsForm transactionId={transactionId} onSaved={load} />
        </div>
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
