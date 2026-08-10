"use client";

import Image from "next/image";
import { FormEvent, useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; text: string };

const GREETING = "Hello! I'm Finekarts AI. How can I help you today?";

export function HomeCtaChat({ focusToken = 0 }: { focusToken?: number }) {
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", text: GREETING },
  ]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focusToken > 0) {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [focusToken]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setBusy(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, consentToContact: false }),
      });
      if (res.ok) {
        const data = (await res.json()) as { reply?: string };
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text:
              data.reply ||
              "I can help with products, packaging, and purchase requests. General information only — not a binding quote.",
          },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            text: "I couldn't answer just now. Please try again or use Post a Purchase Request / Contact.",
          },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          text: "Connection issue. Please try again shortly, or reach the trade desk via Contact.",
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-3 bg-[#0b1f33] px-4 py-3 text-white">
        <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-white">
          <Image
            src="/brand/finekarts-logo.png"
            alt=""
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-semibold">Finekarts AI</p>
          <p className="flex items-center gap-1.5 text-xs text-white/70">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" aria-hidden />
            Online
          </p>
        </div>
      </div>

      <div ref={listRef} className="h-[220px] space-y-3 overflow-y-auto bg-[#f5f7fa] px-4 py-4">
        {messages.map((m, i) => (
          <div
            key={`${m.role}-${i}`}
            className={
              m.role === "user"
                ? "ml-8 rounded-2xl rounded-br-md bg-[#0b1f33] px-3.5 py-2.5 text-sm text-white"
                : "mr-6 rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm text-[#333] shadow-sm"
            }
          >
            {m.text}
          </div>
        ))}
        {busy ? (
          <p className="text-xs text-[#888]" aria-live="polite">
            Finekarts AI is typing…
          </p>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="border-t border-[#e6e9ee] bg-white p-3">
        <div className="flex items-center gap-2 rounded-lg border border-[#d8dde5] bg-white px-3 py-2">
          <label className="sr-only" htmlFor="home-cta-chat-input">
            Type your message
          </label>
          <input
            id="home-cta-chat-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="w-full bg-transparent text-sm text-[#222] outline-none placeholder:text-[#9aa3af]"
            autoComplete="off"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2f6fed] text-white transition hover:bg-[#2558c4] disabled:opacity-50"
            aria-label="Send message"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M4 12l16-8-6 16-2.5-6.5L4 12z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-[10px] leading-snug text-[#8a93a0]">
          General information only — not a binding quote, contract, or bank instruction.
        </p>
      </form>
    </div>
  );
}
