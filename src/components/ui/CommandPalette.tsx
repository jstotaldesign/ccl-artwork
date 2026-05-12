"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Search, CornerDownLeft } from "lucide-react";
import { Z_CLASS } from "@/lib/z-index";

export interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ReactNode;
  group?: string;
  shortcut?: string;
  onSelect: () => void;
}

interface Props {
  open: boolean;
  onClose: () => void;
  items: CommandItem[];
  placeholder?: string;
}

export function CommandPalette({ open, onClose, items, placeholder = "Search commands…" }: Props) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((i) => i.label.toLowerCase().includes(q) || i.hint?.toLowerCase().includes(q));
  }, [items, query]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    for (const it of filtered) {
      const g = it.group ?? "";
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(it);
    }
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((v) => Math.min(filtered.length - 1, v + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((v) => Math.max(0, v - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        const it = filtered[active];
        if (it) {
          it.onSelect();
          onClose();
        }
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, filtered, active, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className={`fixed inset-0 ${Z_CLASS.priorityModal} flex items-start justify-center pt-[15vh] p-4 bg-black/40 backdrop-blur-sm`} onClick={onClose}>
      <div
        className="w-full max-w-xl rounded-2xl bg-[var(--card)] shadow-2xl border border-[var(--border)] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)]">
          <Search className="w-4 h-4 text-[var(--muted-fg)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent outline-none text-sm"
          />
          <kbd className="text-[10px] font-mono text-[var(--muted-fg)] px-1.5 py-0.5 rounded border border-[var(--border)]">
            esc
          </kbd>
        </div>
        <div className="flex-1 overflow-y-auto max-h-[60vh] py-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-[var(--muted-fg)] text-center py-8">No results</p>
          ) : (
            grouped.map(([group, gItems]) => (
              <div key={group} className="mb-1">
                {group && (
                  <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-fg)]">
                    {group}
                  </p>
                )}
                {gItems.map((it) => {
                  const idx = filtered.indexOf(it);
                  const isActive = idx === active;
                  return (
                    <button
                      key={it.id}
                      onClick={() => {
                        it.onSelect();
                        onClose();
                      }}
                      onMouseEnter={() => setActive(idx)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors ${
                        isActive ? "bg-[var(--brand-soft)] text-[var(--brand)]" : ""
                      }`}
                    >
                      {it.icon && <span className="shrink-0">{it.icon}</span>}
                      <span className="flex-1 truncate font-medium">{it.label}</span>
                      {it.hint && <span className="text-xs text-[var(--muted-fg)] truncate">{it.hint}</span>}
                      {it.shortcut && (
                        <kbd className="text-[10px] font-mono text-[var(--muted-fg)] px-1.5 py-0.5 rounded border border-[var(--border)]">
                          {it.shortcut}
                        </kbd>
                      )}
                      {isActive && <CornerDownLeft className="w-3.5 h-3.5 text-[var(--brand)] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
