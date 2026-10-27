"use client";

import { useState } from "react";
import type { TradeIndexLine } from "@/lib/content/trade-alert-indices";
import type { TradeAlertData } from "@/lib/content/trade-alert-store";
import { TradeAlertStrip } from "@/components/marketing/TradeAlertStrip";

const DIRECTIONS: Array<{ value: TradeIndexLine["direction"]; label: string }> = [
  { value: "up", label: "Up (green)" },
  { value: "down", label: "Down (red)" },
  { value: "flat", label: "Flat (grey)" },
];

export function AdminTradeAlertEditor({ initial }: { initial: TradeAlertData }) {
  const [lines, setLines] = useState<TradeIndexLine[]>(initial.lines);
  const [disclaimer, setDisclaimer] = useState(initial.disclaimer);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(index: number, patch: Partial<TradeIndexLine>) {
    setLines((current) => current.map((l, i) => (i === index ? { ...l, ...patch } : l)));
  }

  function addLine() {
    setLines((current) => [
      ...current,
      { id: `line-${Date.now()}`, label: "", value: "", change: "", direction: "flat" },
    ]);
  }

  function move(index: number, delta: number) {
    setLines((current) => {
      const next = [...current];
      const target = index + delta;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function save() {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/trade-alert", {
        method: "PUT",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines, disclaimer }),
      });
      const data = (await res.json()) as { tradeAlert?: TradeAlertData; error?: string };
      if (!res.ok || !data.tradeAlert) {
        setError(data.error || "Unable to save.");
        return;
      }
      setLines(data.tradeAlert.lines);
      setDisclaimer(data.tradeAlert.disclaimer);
      setMessage("Saved. This is visible to admins only.");
    } catch {
      setError("Unable to save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-semibold text-[var(--navy)]">Preview</p>
        <div className="overflow-hidden rounded-lg border border-[var(--line)]">
          <TradeAlertStrip lines={lines.filter((l) => l.label.trim())} disclaimer={disclaimer} />
        </div>
      </div>

      <div className="space-y-4">
        {lines.map((line, index) => (
          <div
            key={line.id}
            className="grid gap-3 rounded-lg border border-[var(--line)] bg-white p-4 lg:grid-cols-4"
          >
            <label className="label lg:col-span-2">
              Label
              <input
                className="field mt-1"
                value={line.label}
                onChange={(e) => update(index, { label: e.target.value })}
              />
            </label>
            <label className="label">
              Value
              <input
                className="field mt-1"
                value={line.value}
                onChange={(e) => update(index, { value: e.target.value })}
                placeholder="USD 920–980 / MT"
              />
            </label>
            <label className="label">
              Change note
              <input
                className="field mt-1"
                value={line.change}
                onChange={(e) => update(index, { change: e.target.value })}
                placeholder="▲ corridor dependent"
              />
            </label>
            <label className="label">
              Direction
              <select
                className="field mt-1"
                value={line.direction}
                onChange={(e) =>
                  update(index, { direction: e.target.value as TradeIndexLine["direction"] })
                }
              >
                {DIRECTIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-end gap-4 text-sm lg:col-span-3">
              <button type="button" className="underline" onClick={() => move(index, -1)}>
                Move up
              </button>
              <button type="button" className="underline" onClick={() => move(index, 1)}>
                Move down
              </button>
              <button
                type="button"
                className="text-red-700 underline"
                onClick={() => setLines((c) => c.filter((_, i) => i !== index))}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" className="btn btn-secondary text-sm" onClick={addLine}>
          Add line
        </button>
      </div>

      <label className="label block">
        Disclaimer
        <textarea
          className="field mt-1 min-h-20"
          value={disclaimer}
          onChange={(e) => setDisclaimer(e.target.value)}
        />
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button type="button" className="btn btn-primary" disabled={saving} onClick={save}>
          {saving ? "Saving…" : "Save trade alert"}
        </button>
        {message ? <p className="text-sm text-[var(--forest)]">{message}</p> : null}
        {error ? <p className="text-sm text-red-700">{error}</p> : null}
      </div>
    </div>
  );
}
