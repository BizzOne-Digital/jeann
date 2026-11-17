"use client";

import { useEffect, useRef, useState } from "react";

export type PickerProduct = {
  id: string;
  name: string;
  slug?: string;
  code?: string;
  categoryId?: string;
  grade?: string;
  origins: string[];
  inspections?: string[];
  incoterms: string[];
  packaging: string[];
  specificationVersionId?: string;
  specificationName?: string;
  specification: string;
};

type Props = {
  /** Text in the box. The buyer may also type a product that is not on the list. */
  value: string;
  onTextChange: (text: string) => void;
  onPick: (product: PickerProduct) => void;
  /** Set when the text no longer matches the chosen product. */
  onClearPick?: () => void;
  pickedId?: string;
};

/** Searchable product dropdown for the order form. Type to search, then choose a product from the list. */
export function ProductPicker({ value, onTextChange, onPick, onClearPick, pickedId }: Props) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<PickerProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      setLoading(true);
      fetch("/api/portal/buyer/products?q=" + encodeURIComponent(value.trim()), { credentials: "same-origin" })
        .then((r) => (r.ok ? r.json() : { items: [] }))
        .then((d: { items?: PickerProduct[] }) => {
          if (!cancelled) {
            setItems(d.items ?? []);
            setActive(0);
          }
        })
        .catch(() => {
          if (!cancelled) setItems([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [value, open]);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  function choose(p: PickerProduct) {
    onPick(p);
    setOpen(false);
  }

  return (
    <div className="relative" ref={boxRef}>
      <input
        className="field mt-1 w-full"
        value={value}
        placeholder="Type to search the product list"
        id="product-picker"
        role="combobox"
        aria-controls="product-picker-list"
        aria-expanded={open}
        aria-autocomplete="list"
        autoComplete="off"
        required
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onTextChange(e.target.value);
          if (pickedId) onClearPick?.();
          setOpen(true);
        }}
        onKeyDown={(e) => {
          if (!open) return;
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActive((a) => Math.min(a + 1, Math.max(items.length - 1, 0)));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActive((a) => Math.max(a - 1, 0));
          } else if (e.key === "Enter" && items[active]) {
            e.preventDefault();
            choose(items[active]);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
      />
      {open ? (
        <ul
          id="product-picker-list"
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-[var(--line)] bg-white shadow-lg"
        >
          {loading && items.length === 0 ? (
            <li className="px-3 py-2 text-sm text-[var(--stone)]">Searching...</li>
          ) : items.length === 0 ? (
            <li className="px-3 py-2 text-sm text-[var(--stone)]">
              No product found. You can keep your own wording and the trade desk will confirm it.
            </li>
          ) : (
            items.map((p, i) => (
              <li
                key={p.id}
                role="option"
                aria-selected={i === active}
                className={"cursor-pointer px-3 py-2 text-sm " + (i === active ? "bg-[var(--cream)]" : "")}
                onMouseEnter={() => setActive(i)}
                onMouseDown={(e) => {
                  e.preventDefault();
                  choose(p);
                }}
              >
                <span className="font-medium text-[var(--navy)]">{p.name}</span>
                {p.grade ? <span className="ml-2 text-xs text-[var(--stone)]">{p.grade}</span> : null}
              </li>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
