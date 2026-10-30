"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Block = { type: string; content: string };
type DocTpl = {
  key: string;
  name: string;
  side: "buyer" | "supplier";
  status: "draft" | "published" | "archived";
  version: number;
  bodyBlocks: Block[];
};
type Step = { key: string; title: string; description?: string; required: boolean };
type WfTpl = {
  key: string;
  name: string;
  side: "buyer" | "supplier";
  active: boolean;
  version: number;
  steps: Step[];
};

const blankDoc = (): DocTpl => ({
  key: "",
  name: "",
  side: "buyer",
  status: "draft",
  version: 0,
  bodyBlocks: [{ type: "paragraph", content: "" }],
});
const blankWf = (): WfTpl => ({
  key: "",
  name: "",
  side: "buyer",
  active: true,
  version: 0,
  steps: [{ key: "", title: "", description: "", required: true }],
});

export function AdminStepTemplatesManager() {
  const [docs, setDocs] = useState<DocTpl[]>([]);
  const [wfs, setWfs] = useState<WfTpl[]>([]);
  const [doc, setDoc] = useState<DocTpl | null>(null);
  const [wf, setWf] = useState<WfTpl | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const deepLinked = useRef(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/step-templates", { credentials: "same-origin" });
    const json = await res.json();
    if (!res.ok) return setMsg(json.error ?? "Unable to load templates.");
    const loaded: DocTpl[] = json.documentTemplates ?? [];
    setDocs(loaded);
    setWfs(json.workflowTemplates ?? []);
    // Deep link from Contract Automation: ?edit=<key>&side=<buyer|supplier>&name=<label>
    const q = new URLSearchParams(window.location.search);
    const editKey = q.get("edit");
    if (editKey && !deepLinked.current) {
      deepLinked.current = true;
      const found = loaded.find((d) => d.key === editKey);
      if (found) setDoc(found);
      else
        setDoc({
          ...blankDoc(),
          status: "published",
          key: editKey,
          name: q.get("name") ?? "",
          side: q.get("side") === "supplier" ? "supplier" : "buyer",
        });
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => void load(), 0);
    return () => clearTimeout(t);
  }, [load]);

  async function save(body: Record<string, unknown>) {
    setMsg(null);
    const res = await fetch("/api/admin/step-templates", {
      method: "PUT",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) return setMsg(json.error ?? "Save failed.");
    setMsg(`Saved as version ${json.version}.`);
    setDoc(null);
    setWf(null);
    void load();
  }

  async function remove(kind: "document" | "workflow", key: string) {
    if (!window.confirm(`Remove template "${key}"? It will be archived, not deleted.`)) return;
    const res = await fetch(`/api/admin/step-templates?kind=${kind}&key=${encodeURIComponent(key)}`, {
      method: "DELETE",
      credentials: "same-origin",
    });
    if (!res.ok) return setMsg("Remove failed.");
    void load();
  }

  return (
    <div className="space-y-8">
      {msg ? <p className="text-sm text-[var(--stone)]">{msg}</p> : null}

      <section className="rounded-lg border border-[var(--line)] bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[var(--navy)]">Document templates (per step)</h2>
          <button type="button" className="btn" onClick={() => setDoc(blankDoc())}>
            New document template
          </button>
        </div>
        <ul className="mt-3 divide-y divide-[var(--line)] text-sm">
          {docs.map((d) => (
            <li key={d.key} className="flex items-center justify-between py-2">
              <span>
                {d.name} <code className="text-xs">{d.key}</code> · {d.side} · v{d.version} · {d.status}
              </span>
              <span className="flex gap-2">
                <button type="button" className="btn" onClick={() => setDoc(d)}>
                  Edit
                </button>
                <button type="button" className="btn" onClick={() => remove("document", d.key)}>
                  Remove
                </button>
              </span>
            </li>
          ))}
          {docs.length === 0 ? <li className="py-2 text-[var(--stone)]">No templates yet.</li> : null}
        </ul>
        {doc ? (
          <div className="mt-4 space-y-3 border-t border-[var(--line)] pt-4">
            <div className="grid gap-3 sm:grid-cols-4">
              <input
                className="field"
                placeholder="key (e.g. step3_proforma_invoice)"
                value={doc.key}
                disabled={doc.version > 0}
                onChange={(e) => setDoc({ ...doc, key: e.target.value })}
              />
              <input
                className="field"
                placeholder="Name"
                value={doc.name}
                onChange={(e) => setDoc({ ...doc, name: e.target.value })}
              />
              <select
                className="field"
                value={doc.side}
                onChange={(e) => setDoc({ ...doc, side: e.target.value as DocTpl["side"] })}
              >
                <option value="buyer">Buyer portal</option>
                <option value="supplier">Supplier portal</option>
              </select>
              <select
                className="field"
                value={doc.status}
                onChange={(e) => setDoc({ ...doc, status: e.target.value as DocTpl["status"] })}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            {doc.bodyBlocks.map((b, i) => (
              <div key={i} className="flex gap-2">
                <input
                  className="field w-32"
                  value={b.type}
                  onChange={(e) => {
                    const blocks = [...doc.bodyBlocks];
                    blocks[i] = { ...b, type: e.target.value };
                    setDoc({ ...doc, bodyBlocks: blocks });
                  }}
                />
                <textarea
                  className="field min-h-20 flex-1"
                  value={b.content}
                  onChange={(e) => {
                    const blocks = [...doc.bodyBlocks];
                    blocks[i] = { ...b, content: e.target.value };
                    setDoc({ ...doc, bodyBlocks: blocks });
                  }}
                />
                <button
                  type="button"
                  className="btn"
                  onClick={() =>
                    setDoc({ ...doc, bodyBlocks: doc.bodyBlocks.filter((_, j) => j !== i) })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                className="btn"
                onClick={() =>
                  setDoc({ ...doc, bodyBlocks: [...doc.bodyBlocks, { type: "paragraph", content: "" }] })
                }
              >
                Add block
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  save({
                    kind: "document",
                    key: doc.key,
                    name: doc.name,
                    side: doc.side,
                    status: doc.status,
                    bodyBlocks: doc.bodyBlocks.filter((b) => b.content.trim()),
                  })
                }
              >
                Save new version
              </button>
              <button type="button" className="btn" onClick={() => setDoc(null)}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-lg border border-[var(--line)] bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[var(--navy)]">Workflow templates (steps 1–6)</h2>
          <button type="button" className="btn" onClick={() => setWf(blankWf())}>
            New workflow template
          </button>
        </div>
        <ul className="mt-3 divide-y divide-[var(--line)] text-sm">
          {wfs.map((w) => (
            <li key={w.key} className="flex items-center justify-between py-2">
              <span>
                {w.name} <code className="text-xs">{w.key}</code> · {w.side} · v{w.version} ·{" "}
                {w.active ? "active" : "inactive"} · {w.steps.length} steps
              </span>
              <span className="flex gap-2">
                <button type="button" className="btn" onClick={() => setWf(w)}>
                  Edit
                </button>
                <button type="button" className="btn" onClick={() => remove("workflow", w.key)}>
                  Remove
                </button>
              </span>
            </li>
          ))}
          {wfs.length === 0 ? (
            <li className="py-2 text-[var(--stone)]">
              No stored workflow templates. Built-in defaults from code are in use until one is saved.
            </li>
          ) : null}
        </ul>
        {wf ? (
          <div className="mt-4 space-y-3 border-t border-[var(--line)] pt-4">
            <div className="grid gap-3 sm:grid-cols-3">
              <input
                className="field"
                placeholder="key"
                value={wf.key}
                disabled={wf.version > 0}
                onChange={(e) => setWf({ ...wf, key: e.target.value })}
              />
              <input
                className="field"
                placeholder="Name"
                value={wf.name}
                onChange={(e) => setWf({ ...wf, name: e.target.value })}
              />
              <select
                className="field"
                value={wf.side}
                onChange={(e) => setWf({ ...wf, side: e.target.value as WfTpl["side"] })}
              >
                <option value="buyer">Buyer portal</option>
                <option value="supplier">Supplier portal</option>
              </select>
            </div>
            {wf.steps.map((s, i) => (
              <div key={i} className="grid gap-2 sm:grid-cols-[10rem_1fr_2fr_auto_auto]">
                <input
                  className="field"
                  placeholder="step key"
                  value={s.key}
                  onChange={(e) => {
                    const steps = [...wf.steps];
                    steps[i] = { ...s, key: e.target.value };
                    setWf({ ...wf, steps });
                  }}
                />
                <input
                  className="field"
                  placeholder="Title"
                  value={s.title}
                  onChange={(e) => {
                    const steps = [...wf.steps];
                    steps[i] = { ...s, title: e.target.value };
                    setWf({ ...wf, steps });
                  }}
                />
                <input
                  className="field"
                  placeholder="Description"
                  value={s.description ?? ""}
                  onChange={(e) => {
                    const steps = [...wf.steps];
                    steps[i] = { ...s, description: e.target.value };
                    setWf({ ...wf, steps });
                  }}
                />
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={s.required}
                    onChange={(e) => {
                      const steps = [...wf.steps];
                      steps[i] = { ...s, required: e.target.checked };
                      setWf({ ...wf, steps });
                    }}
                  />
                  Required
                </label>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setWf({ ...wf, steps: wf.steps.filter((_, j) => j !== i) })}
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                className="btn"
                onClick={() =>
                  setWf({ ...wf, steps: [...wf.steps, { key: "", title: "", description: "", required: true }] })
                }
              >
                Add step
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() =>
                  save({
                    kind: "workflow",
                    key: wf.key,
                    name: wf.name,
                    side: wf.side,
                    active: wf.active,
                    steps: wf.steps,
                  })
                }
              >
                Save new version
              </button>
              <button type="button" className="btn" onClick={() => setWf(null)}>
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
