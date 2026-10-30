import Link from "next/link";
import { requirePortalAccess } from "@/lib/auth/portal-access";
import { PortalPage } from "@/components/portal/PortalPage";
import { SeedContractTemplatesButton } from "@/components/admin/SeedContractTemplatesButton";
import { tryConnectMongo } from "@/lib/db/mongoose";
import {
  HOW_TO_NOTE,
  HOW_TO_STEPS,
  contractFlow,
  templateKeyFor,
  type ContractSide,
} from "@/lib/contracts/contract-flow";

export const dynamic = "force-dynamic";

type TplInfo = { version: number; status: string };
type TxRow = { id: string; number: string; side: string; status: string; step: string };

async function load() {
  const templates = new Map<string, TplInfo>();
  const txs: TxRow[] = [];
  const conn = await tryConnectMongo();
  if (!conn) return { templates, txs, connected: false };
  const { DocumentTemplate, Transaction } = await import("@/models");
  const rows = await DocumentTemplate.find().sort({ key: 1, version: -1 }).lean();
  for (const r of rows) if (!templates.has(r.key)) templates.set(r.key, { version: r.version, status: r.status });
  const recent = await Transaction.find({ deletedAt: null }).sort({ createdAt: -1 }).limit(15).lean();
  for (const t of recent) {
    txs.push({
      id: String(t._id),
      number: t.transactionNumber,
      side: t.side,
      status: t.status,
      step: t.currentStepKey || "-",
    });
  }
  return { templates, txs, connected: true };
}

const ACTOR_LABEL = { staff: "Finekarts staff", buyer: "Buyer", supplier: "Supplier" } as const;

export default async function ContractAutomationPage() {
  await requirePortalAccess("admin");
  const { templates, txs, connected } = await load();

  return (
    <PortalPage
      title="Contract Automation"
      description="The full contract flow from offer to banking: who acts at each step, which documents are used, and where to edit each template."
    >
      <div className="space-y-8">
        <section className="rounded-lg border border-[var(--line)] bg-white p-5">
          <h2 className="font-semibold text-[var(--navy)]">How to run a contract</h2>
          <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm">
            {HOW_TO_STEPS.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-[var(--stone)]">{HOW_TO_NOTE}</p>
          <div className="mt-4">
            <SeedContractTemplatesButton />
            <p className="mt-2 text-xs text-[var(--stone)]">
              Creates published starter templates only where none exist. Existing templates are never changed. Generated PDFs
              use the latest published template; with no published template the built-in layout is used.{" "}
              <Link href="/admin/step-templates" className="underline">
                All step templates
              </Link>
            </p>
          </div>
        </section>

        {(["buyer", "supplier"] as ContractSide[]).map((side) => (
          <section key={side} className="rounded-lg border border-[var(--line)] bg-white p-5">
            <h2 className="font-semibold text-[var(--navy)]">
              {side === "buyer" ? "Buyer portal (Finekarts sells)" : "Supplier portal (Finekarts buys)"}
            </h2>
            <ol className="mt-4 space-y-4">
              {contractFlow(side).map((step) => (
                <li key={step.stepKey + step.number} className="rounded border border-[var(--line)] p-4">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="text-sm font-semibold">
                      Step {step.number}: {step.title}
                    </h3>
                    <span className="text-xs text-[var(--stone)]">Acts: {ACTOR_LABEL[step.actor]}</span>
                  </div>
                  <p className="mt-1 text-sm text-[var(--stone)]">{step.direction}</p>
                  <ul className="mt-3 divide-y divide-[var(--line)] text-sm">
                    {step.documents.map((d) => {
                      const key = d.slug ? templateKeyFor(d.slug, side) : null;
                      const info = key ? templates.get(key) : undefined;
                      const href = key
                        ? `/admin/step-templates?edit=${key}&side=${side}&name=${encodeURIComponent(d.fullName)}`
                        : null;
                      return (
                        <li key={d.label} className="flex flex-wrap items-center justify-between gap-2 py-2">
                          <span>
                            <strong>{d.label}</strong> - {d.fullName}
                            {d.note ? <span className="block text-xs text-[var(--stone)]">{d.note}</span> : null}
                          </span>
                          {key ? (
                            <span className="flex items-center gap-3">
                              <span className="text-xs">
                                {info
                                  ? `Template v${info.version} - ${info.status === "published" ? "Published" : info.status}`
                                  : connected
                                    ? "No template yet"
                                    : "Database not connected"}
                              </span>
                              <Link href={href!} className="btn">
                                {info ? "Edit template" : "Create template"}
                              </Link>
                            </span>
                          ) : (
                            <span className="text-xs text-[var(--stone)]">Upload only</span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ol>
          </section>
        ))}

        <section className="rounded-lg border border-[var(--line)] bg-white p-5">
          <h2 className="font-semibold text-[var(--navy)]">Start a contract</h2>
          <p className="mt-1 text-sm text-[var(--stone)]">
            Open a transaction to run its steps (generate, send, countersign). New transactions come from converting a
            qualified buyer request.
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-xs text-[var(--stone)]">
                  <th className="py-1 pr-3">Number</th>
                  <th className="pr-3">Side</th>
                  <th className="pr-3">Status</th>
                  <th className="pr-3">Current step</th>
                  <th />
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {txs.map((t) => (
                  <tr key={t.id}>
                    <td className="py-2 pr-3">{t.number}</td>
                    <td className="pr-3">{t.side}</td>
                    <td className="pr-3">{t.status}</td>
                    <td className="pr-3">{t.step}</td>
                    <td>
                      <Link href={`/workspace/transactions/${t.id}`} className="btn">
                        Open contract
                      </Link>
                    </td>
                  </tr>
                ))}
                {txs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-2 text-[var(--stone)]">
                      No transactions yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs">
            <Link href="/admin/transactions" className="underline">
              All transactions
            </Link>
          </p>
        </section>
      </div>
    </PortalPage>
  );
}
