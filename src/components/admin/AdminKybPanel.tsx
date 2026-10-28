"use client";

import { useState } from "react";
import {
  KYB_DISCLAIMERS,
  KYB_ITEM_STATUSES,
  REGISTRY_LINKS,
  VALIDATION_OUTCOMES,
} from "@/lib/kyb/checklist";

type Item = {
  key: string;
  label?: string;
  status: string;
  notes: string;
  source: string;
  evidence: string;
  discrepancies: string;
  outstandingRisks: string;
  verifiedAt: string | null;
};

export type AdminKybView = {
  organization: { id: string; type: string; legalName: string; country: string } | null;
  sections: { sectionKey: string; label: string; items: Item[] }[];
  progress: { label: string; withIssues: number };
  commodityChecks: Item[];
  validationChecks: Item[];
  outcome: string | null;
  outcomeReport: string;
  outcomeAt: string | null;
  waiver: { waived: boolean; reason: string; at: string | null };
  approvalOverride: { reason: string; at: string; outcomeAtOverride: string } | null;
};

type Group = "checklist" | "commodityChecks" | "validationChecks";

function ItemRow({
  item,
  group,
  detailed,
  onSave,
}: {
  item: Item;
  group: Group;
  detailed?: boolean;
  onSave: (group: Group, key: string, patch: Record<string, string>) => Promise<void>;
}) {
  const [status, setStatus] = useState(item.status);
  const [notes, setNotes] = useState(item.notes);
  const [source, setSource] = useState(item.source);
  const [evidence, setEvidence] = useState(item.evidence);
  const [discrepancies, setDiscrepancies] = useState(item.discrepancies);
  const [risks, setRisks] = useState(item.outstandingRisks);
  const [busy, setBusy] = useState(false);

  async function save() {
    setBusy(true);
    await onSave(group, item.key, {
      status,
      notes,
      source,
      ...(detailed ? { evidence, discrepancies, outstandingRisks: risks } : {}),
    });
    setBusy(false);
  }

  return (
    <li className="space-y-2 border-b border-[var(--line)] py-3 text-sm last:border-0">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-[var(--navy)]">{item.label}</span>
        <select className="field w-auto" value={status} onChange={(e) => setStatus(e.target.value)}>
          {KYB_ITEM_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        <input className="field" placeholder="Source consulted" value={source} onChange={(e) => setSource(e.target.value)} />
        <input className="field" placeholder="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        {detailed ? (
          <>
            <input className="field" placeholder="Evidence" value={evidence} onChange={(e) => setEvidence(e.target.value)} />
            <input className="field" placeholder="Discrepancies" value={discrepancies} onChange={(e) => setDiscrepancies(e.target.value)} />
            <input className="field md:col-span-2" placeholder="Outstanding risks" value={risks} onChange={(e) => setRisks(e.target.value)} />
          </>
        ) : null}
      </div>
      <div className="flex items-center gap-3 text-xs text-[var(--stone)]">
        <button type="button" className="btn btn-secondary text-xs" disabled={busy} onClick={save}>
          Save
        </button>
        {item.verifiedAt ? <span>Verified {new Date(item.verifiedAt).toLocaleString()}</span> : null}
      </div>
    </li>
  );
}

/** STAFF ONLY component. Do not render in buyer/supplier portals. */
export function AdminKybPanel({ organizationId, initial }: { organizationId: string; initial: AdminKybView }) {
  const [view, setView] = useState<AdminKybView>(initial);
  const [outcome, setOutcome] = useState(initial.outcome ?? "");
  const [report, setReport] = useState(initial.outcomeReport);
  const [waiverReason, setWaiverReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function patch(body: Record<string, unknown>) {
    setError(null);
    setMessage(null);
    const res = await fetch(`/api/admin/organizations/${encodeURIComponent(organizationId)}/kyb`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await res.json()) as AdminKybView & { error?: string };
    if (!res.ok) {
      setError(data.error ?? "Update failed.");
      return;
    }
    setView(data);
    setMessage("Saved.");
  }

  const saveItem = async (group: Group, key: string, p: Record<string, string>) => {
    await patch({ action: "update_item", group, key, ...p });
  };

  const isSupplier = view.organization?.type === "supplier";

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        {KYB_DISCLAIMERS.map((d) => (
          <p key={d} className="mt-1 first:mt-0">
            {d}
          </p>
        ))}
        <p className="mt-2 text-xs">Staff only. This information is never shown to the buyer or supplier.</p>
      </div>

      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}

      <section className="rounded-lg border border-[var(--line)] bg-white p-5">
        <h3 className="font-semibold text-[var(--navy)]">
          KYB checklist <span className="ml-2 text-sm font-normal text-[var(--stone)]">{view.progress.label}</span>
          {view.progress.withIssues ? (
            <span className="ml-2 text-sm font-normal text-red-700">{view.progress.withIssues} with issues</span>
          ) : null}
        </h3>
        <p className="mt-1 text-xs text-[var(--stone)]">
          Minimum to start a search: legal company name and country of incorporation. Registration number and official website help if available.
        </p>
        {view.sections.map((s) => (
          <details key={s.sectionKey} className="mt-3 rounded border border-[var(--line)] p-3">
            <summary className="cursor-pointer text-sm font-medium text-[var(--navy)]">
              {s.label} ({s.items.filter((i) => i.status === "verified").length}/{s.items.length} verified)
            </summary>
            <ul>
              {s.items.map((i) => (
                <ItemRow key={i.key} item={i} group="checklist" onSave={saveItem} />
              ))}
            </ul>
          </details>
        ))}
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-white p-5">
        <h3 className="font-semibold text-[var(--navy)]">Commodity-trade checks</h3>
        <ul>
          {view.commodityChecks.map((i) => (
            <ItemRow key={i.key} item={i} group="commodityChecks" onSave={saveItem} />
          ))}
        </ul>
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-white p-5">
        <h3 className="font-semibold text-[var(--navy)]">Company validation</h3>
        <p className="mt-1 text-xs text-[var(--stone)]">
          KYB collects, validation verifies. Record sources, dates, evidence, discrepancies and outstanding risks.
        </p>
        <ul className="mt-2 text-sm">
          {REGISTRY_LINKS.map((l) => (
            <li key={l.url}>
              <a className="text-[var(--ocean)] underline" href={l.url} target="_blank" rel="noopener noreferrer">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <ul className="mt-3">
          {view.validationChecks.map((i) => (
            <ItemRow key={i.key} item={i} group="validationChecks" detailed onSave={saveItem} />
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-[var(--line)] pt-4">
          <label className="label">
            Validation outcome
            <select className="field mt-1" value={outcome} onChange={(e) => setOutcome(e.target.value)}>
              <option value="">Select outcome</option>
              {VALIDATION_OUTCOMES.map((o) => (
                <option key={o} value={o}>
                  {o.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <label className="label">
            Validation report
            <textarea className="field mt-1 min-h-24" value={report} onChange={(e) => setReport(e.target.value)} />
          </label>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!outcome}
            onClick={() => patch({ action: "record_outcome", outcome, report })}
          >
            Record outcome
          </button>
          {view.outcomeAt ? (
            <p className="text-xs text-[var(--stone)]">
              Current: {view.outcome?.replace(/_/g, " ")} on {new Date(view.outcomeAt).toLocaleString()}
            </p>
          ) : null}
        </div>
      </section>

      {isSupplier ? (
        <section className="rounded-lg border border-[var(--line)] bg-white p-5">
          <h3 className="font-semibold text-[var(--navy)]">Known supplier: KYB waiver (CEO / GM only)</h3>
          {view.waiver.waived ? (
            <p className="mt-2 text-sm text-red-700">
              KYB WAIVED{view.waiver.at ? ` on ${new Date(view.waiver.at).toLocaleString()}` : ""}: {view.waiver.reason}
            </p>
          ) : (
            <p className="mt-2 text-sm text-[var(--stone)]">
              Not waived. New suppliers must complete validation before approval.
            </p>
          )}
          <textarea
            className="field mt-2 min-h-16"
            placeholder="Reason (required, min 10 characters)"
            value={waiverReason}
            onChange={(e) => setWaiverReason(e.target.value)}
          />
          <div className="mt-2 flex gap-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => patch({ action: "set_waiver", waived: !view.waiver.waived, reason: waiverReason })}
            >
              {view.waiver.waived ? "Revoke waiver" : "Waive KYB"}
            </button>
          </div>
        </section>
      ) : null}

      {view.approvalOverride ? (
        <p className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          Approved by override on {new Date(view.approvalOverride.at).toLocaleString()} (outcome at the time:{" "}
          {view.approvalOverride.outcomeAtOverride || "none"}): {view.approvalOverride.reason}
        </p>
      ) : null}
    </div>
  );
}
