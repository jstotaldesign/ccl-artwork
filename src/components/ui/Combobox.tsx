"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

export interface ComboboxOption {
  value: string;
  label: string;
  hint?: string;
  disabled?: boolean;
}

interface Props {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  onSearch?: (query: string) => Promise<ComboboxOption[]>;
  truncated?: boolean;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
}

export function Combobox({
  options: initialOptions,
  value,
  onChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No matches.",
  onSearch,
  truncated,
  disabled,
  clearable = true,
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [serverOpts, setServerOpts] = useState<ComboboxOption[] | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  // Server-search mode: debounced
  useEffect(() => {
    if (!onSearch || !open) return;
    const t = setTimeout(async () => {
      const res = await onSearch(query).catch(() => []);
      setServerOpts(res);
      setActive(0);
    }, 200);
    return () => clearTimeout(t);
  }, [query, onSearch, open]);

  const filtered = useMemo(() => {
    if (onSearch) return serverOpts ?? initialOptions;
    if (!query.trim()) return initialOptions;
    const q = query.trim().toLowerCase();
    return initialOptions.filter(
      (o) => o.label.toLowerCase().includes(q) || o.hint?.toLowerCase().includes(q),
    );
  }, [initialOptions, query, onSearch, serverOpts]);

  const selected = initialOptions.find((o) => o.value === value);

  function onKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((v) => Math.min(filtered.length - 1, v + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((v) => Math.max(0, v - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = filtered[active];
      if (it && !it.disabled) {
        onChange(it.value);
        setOpen(false);
        setQuery("");
      }
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] text-left disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--muted)]/40 transition-colors"
      >
        <span className={`flex-1 truncate ${!selected ? "text-[var(--muted-fg)]" : ""}`}>
          {selected ? selected.label : placeholder}
        </span>
        {clearable && selected && !disabled && (
          <X
            className="w-3.5 h-3.5 text-[var(--muted-fg)] hover:text-[var(--foreground)]"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
          />
        )}
        <ChevronDown className={`w-3.5 h-3.5 text-[var(--muted-fg)] transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 left-0 right-0 mt-2 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)]">
            <Search className="w-3.5 h-3.5 text-[var(--muted-fg)]" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              onKeyDown={onKey}
              placeholder={searchPlaceholder}
              className="flex-1 bg-transparent text-sm outline-none"
            />
          </div>
          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-[var(--muted-fg)] py-4">{emptyText}</p>
            ) : (
              filtered.map((opt, i) => {
                const isActive = i === active;
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      if (opt.disabled) return;
                      onChange(opt.value);
                      setOpen(false);
                      setQuery("");
                    }}
                    onMouseEnter={() => setActive(i)}
                    disabled={opt.disabled}
                    className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                      isActive ? "bg-[var(--muted)]" : ""
                    }`}
                  >
                    <Check className={`w-3.5 h-3.5 text-[var(--brand)] ${isSelected ? "opacity-100" : "opacity-0"}`} />
                    <span className="flex-1 truncate font-medium">{opt.label}</span>
                    {opt.hint && <span className="text-xs text-[var(--muted-fg)] truncate">{opt.hint}</span>}
                  </button>
                );
              })
            )}
            {truncated && (
              <p className="text-[10px] text-[var(--muted-fg)] px-3 py-1.5 border-t border-[var(--border)] bg-[var(--muted)]/50">
                Showing first {initialOptions.length} — type to search for more.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
