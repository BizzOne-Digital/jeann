"use client";

import { useRef } from "react";
import { richTextToHtml } from "@/lib/documents/rich-text";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

/**
 * Document editor with formatting tools. The text is plain markup (see lib/documents/rich-text.ts),
 * so the preview below and the generated PDF show exactly the same formatting.
 */
export function FormattedTextEditor({ value, onChange, placeholder }: Props) {
  const ref = useRef<HTMLTextAreaElement>(null);

  function selection() {
    const el = ref.current;
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    return { start, end, selected: value.slice(start, end) };
  }

  function put(next: string, cursor: number) {
    onChange(next);
    requestAnimationFrame(() => {
      ref.current?.focus();
      ref.current?.setSelectionRange(cursor, cursor);
    });
  }

  /** Wrap the selected text, e.g. with ** for bold. */
  function wrap(mark: string) {
    const { start, end, selected } = selection();
    const text = selected || "text";
    put(value.slice(0, start) + mark + text + mark + value.slice(end), start + mark.length + text.length + mark.length);
  }

  /** Put a prefix at the start of every selected line, replacing any existing line format. */
  function linePrefix(prefix: string) {
    const { start, end } = selection();
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = value.indexOf("\n", end);
    if (lineEnd === -1) lineEnd = value.length;
    const block = value.slice(lineStart, lineEnd);
    const cleaned = block
      .split("\n")
      .map((l) => l.replace(/^\[(left|center|right)\]\s*/i, "").replace(/^(#{1,2} |- )/, ""))
      .map((l) => prefix + l)
      .join("\n");
    put(value.slice(0, lineStart) + cleaned + value.slice(lineEnd), lineStart + cleaned.length);
  }

  function align(kind: "left" | "center" | "right") {
    const { start, end } = selection();
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    let lineEnd = value.indexOf("\n", end);
    if (lineEnd === -1) lineEnd = value.length;
    const block = value
      .slice(lineStart, lineEnd)
      .split("\n")
      .map((l) => l.replace(/^\[(left|center|right)\]\s*/i, ""))
      .map((l) => (kind === "left" ? l : "[" + kind + "] " + l))
      .join("\n");
    put(value.slice(0, lineStart) + block + value.slice(lineEnd), lineStart + block.length);
  }

  function insertLine(line: string) {
    const { end } = selection();
    const before = value.slice(0, end);
    const prefix = before && !before.endsWith("\n") ? "\n" : "";
    const insert = prefix + line + "\n";
    put(before + insert + value.slice(end), before.length + insert.length);
  }

  const btn = "rounded border border-[var(--line)] bg-white px-2 py-1 text-xs hover:bg-[var(--mist)]";

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1" role="toolbar" aria-label="Formatting tools">
        <button type="button" className={btn + " font-bold"} onClick={() => wrap("**")} title="Bold">B</button>
        <button type="button" className={btn + " italic"} onClick={() => wrap("*")} title="Italic">I</button>
        <button type="button" className={btn + " underline"} onClick={() => wrap("__")} title="Underline">U</button>
        <button type="button" className={btn} onClick={() => linePrefix("# ")} title="Large heading">Heading 1</button>
        <button type="button" className={btn} onClick={() => linePrefix("## ")} title="Small heading">Heading 2</button>
        <button type="button" className={btn} onClick={() => linePrefix("")} title="Normal text">Normal</button>
        <button type="button" className={btn} onClick={() => linePrefix("- ")} title="Bullet">Bullet</button>
        <button type="button" className={btn} onClick={() => align("left")} title="Align left">Left</button>
        <button type="button" className={btn} onClick={() => align("center")} title="Centre">Center</button>
        <button type="button" className={btn} onClick={() => align("right")} title="Align right">Right</button>
        <button type="button" className={btn} onClick={() => insertLine("---")} title="Horizontal line">Line</button>
        <button type="button" className={btn} onClick={() => insertLine("[pagebreak]")} title="Start a new page">Page break</button>
      </div>
      <textarea
        ref={ref}
        className="field min-h-40 font-mono text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div>
        <p className="text-xs font-medium text-[var(--stone)]">Preview (as it will print)</p>
        <div
          className="mt-1 max-h-72 overflow-y-auto rounded border border-[var(--line)] bg-white p-3"
          dangerouslySetInnerHTML={{ __html: richTextToHtml(value) }}
        />
      </div>
    </div>
  );
}
