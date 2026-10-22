"use client";

import { useState } from "react";
import { BUYER_PO_AI_PROMPT_HINT } from "@/lib/content/buyer-portal-guidance";

export function BuyerPortalAssistant() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function ask() {
    const q = question.trim();
    if (!q) return;
    setLoading(true);
    setAnswer(null);
    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({
          message: q,
          context: "buyer_portal_icpo",
        }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      setAnswer(data.reply || data.error || "Unable to reach assistant.");
    } catch {
      setAnswer("Unable to reach assistant. Try again or contact the trade desk.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="rounded-lg border border-[var(--line)] bg-white p-4">
      <h3 className="font-semibold text-[var(--navy)]">Trade desk assistant</h3>
      <p className="mt-1 text-xs text-[var(--stone)]">{BUYER_PO_AI_PROMPT_HINT}</p>
      <textarea
        className="field mt-3 min-h-20 w-full"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="e.g. What should my ICPO include for CIF sunflower oil?"
      />
      <button
        type="button"
        className="btn btn-outline mt-2"
        disabled={loading}
        onClick={ask}
      >
        {loading ? "Thinking…" : "Ask"}
      </button>
      {answer ? <p className="mt-3 text-sm leading-relaxed text-[var(--ink)]">{answer}</p> : null}
    </section>
  );
}
