"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LoadClientSkeletonButton({ skeletonKey, label }: { skeletonKey: string; label: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function run() {
    if (!window.confirm("Publish the client's skeleton as a new version? It becomes the template used for new documents. Older versions stay on record.")) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/contract-automation/skeleton", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ key: skeletonKey }),
      });
      const json = await res.json();
      if (!res.ok) setMsg(json.error ?? "Could not publish the skeleton.");
      else {
        setMsg("Published as version " + json.version + ". You can edit it under All step templates.");
        router.refresh();
      }
    } catch {
      setMsg("Could not publish the skeleton.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" className="btn" disabled={busy} onClick={run}>
        {busy ? "Publishing..." : label}
      </button>
      {msg ? <span className="text-sm text-[var(--stone)]">{msg}</span> : null}
    </div>
  );
}
