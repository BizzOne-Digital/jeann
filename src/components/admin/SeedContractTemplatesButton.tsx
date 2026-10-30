"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function SeedContractTemplatesButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/contract-automation/seed", { method: "POST", credentials: "same-origin" });
      const json = await res.json();
      if (!res.ok) setMsg(json.error ?? "Could not create templates.");
      else {
        setMsg(`Created ${json.created.length} template(s). ${json.skipped.length} already existed and were left unchanged.`);
        router.refresh();
      }
    } catch {
      setMsg("Could not create templates.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className="btn btn-primary" disabled={busy} onClick={run}>
        {busy ? "Creating..." : "Create missing default templates"}
      </button>
      {msg ? <span className="text-sm text-[var(--stone)]">{msg}</span> : null}
    </div>
  );
}
