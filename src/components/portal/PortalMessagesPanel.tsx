"use client";

import { FormEvent, useEffect, useState } from "react";
import type { MessageThreadSummary } from "@/lib/messages/message-service";

type Props = {
  apiBase: string;
  initialThreads?: MessageThreadSummary[];
};

export function PortalMessagesPanel({ apiBase, initialThreads = [] }: Props) {
  const [threads, setThreads] = useState<MessageThreadSummary[]>(initialThreads);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<
    Array<{ id: string; body: string; authorName?: string; createdAt: string }>
  >([]);
  const [subject, setSubject] = useState("");
  const [newSubject, setNewSubject] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  async function loadThreads() {
    const res = await fetch(apiBase, { credentials: "same-origin" });
    const data = (await res.json()) as { items?: MessageThreadSummary[]; error?: string };
    if (!res.ok) {
      setError(data.error ?? "Unable to load messages.");
      return;
    }
    setThreads(data.items ?? []);
  }

  async function loadThread(threadId: string) {
    setActiveId(threadId);
    const res = await fetch(`${apiBase}/${threadId}`, { credentials: "same-origin" });
    const data = (await res.json()) as {
      subject?: string;
      messages?: Array<{ id: string; body: string; authorName?: string; createdAt: string }>;
      error?: string;
    };
    if (!res.ok) {
      setError(data.error ?? "Unable to load thread.");
      return;
    }
    setSubject(data.subject ?? "");
    setMessages(data.messages ?? []);
  }

  useEffect(() => {
    if (initialThreads.length > 0) return;
    let cancelled = false;
    fetch(apiBase, { credentials: "same-origin" })
      .then(async (res) => {
        const data = (await res.json()) as { items?: MessageThreadSummary[]; error?: string };
        if (!res.ok) throw new Error(data.error ?? "Unable to load messages.");
        if (!cancelled) setThreads(data.items ?? []);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Error");
      });
    return () => {
      cancelled = true;
    };
  }, [apiBase, initialThreads.length]);

  async function onCompose(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ subject: newSubject, message: newMessage }),
      });
      const data = (await res.json()) as { threadId?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "Unable to send message.");
      setNewSubject("");
      setNewMessage("");
      setShowCompose(false);
      await loadThreads();
      if (data.threadId) await loadThread(data.threadId);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  async function onReply(e: FormEvent) {
    e.preventDefault();
    if (!activeId || !reply.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`${apiBase}/${activeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ message: reply }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Unable to send reply.");
      setReply("");
      await loadThread(activeId);
      await loadThreads();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="rounded-lg border border-[var(--line)] bg-white p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="font-semibold text-[var(--navy)]">Threads</h2>
          <button type="button" className="btn btn-secondary text-sm" onClick={() => setShowCompose((v) => !v)}>
            New message
          </button>
        </div>

        {showCompose ? (
          <form onSubmit={onCompose} className="mb-4 space-y-3 rounded border border-[var(--line)] bg-[var(--cream)] p-3">
            <input
              className="field"
              placeholder="Subject"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              required
            />
            <textarea
              className="field min-h-[100px]"
              placeholder="Message to trade desk"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              required
            />
            <button type="submit" className="btn btn-primary text-sm" disabled={busy}>
              {busy ? "Sending…" : "Send"}
            </button>
          </form>
        ) : null}

        <ul className="space-y-2">
          {threads.length === 0 ? (
            <li className="text-sm text-[var(--stone)]">No messages yet. Start a conversation with the trade desk.</li>
          ) : (
            threads.map((thread) => (
              <li key={thread.id}>
                <button
                  type="button"
                  onClick={() => loadThread(thread.id)}
                  className={`w-full rounded border px-3 py-2 text-left text-sm transition ${
                    activeId === thread.id
                      ? "border-[var(--ocean)] bg-[var(--cream)]"
                      : "border-[var(--line)] hover:border-[var(--ocean)]"
                  }`}
                >
                  <p className="font-semibold text-[var(--navy)]">{thread.subject}</p>
                  {thread.lastMessagePreview ? (
                    <p className="mt-1 line-clamp-2 text-[var(--stone)]">{thread.lastMessagePreview}</p>
                  ) : null}
                </button>
              </li>
            ))
          )}
        </ul>
      </div>

      <div className="rounded-lg border border-[var(--line)] bg-white p-4">
        {activeId ? (
          <>
            <h2 className="font-semibold text-[var(--navy)]">{subject}</h2>
            <div className="mt-4 max-h-[420px] space-y-3 overflow-y-auto">
              {messages.map((m) => (
                <div key={m.id} className="rounded bg-[var(--cream)] px-3 py-2 text-sm">
                  <p className="text-xs font-semibold text-[var(--stone)]">
                    {m.authorName ?? "User"} · {new Date(m.createdAt).toLocaleString()}
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-[var(--ink)]">{m.body}</p>
                </div>
              ))}
            </div>
            <form onSubmit={onReply} className="mt-4 space-y-2">
              <textarea
                className="field min-h-[90px]"
                placeholder="Reply…"
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                required
              />
              <button type="submit" className="btn btn-primary text-sm" disabled={busy}>
                {busy ? "Sending…" : "Send reply"}
              </button>
            </form>
          </>
        ) : (
          <p className="text-sm text-[var(--stone)]">Select a thread or compose a new message.</p>
        )}
        {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}
      </div>
    </div>
  );
}
