"use client";

import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";

interface Props {
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  className?: string;
}

const DEFAULT_PRESETS = [
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#6366f1",
  "#3b82f6",
  "#06b6d4",
  "#10b981",
  "#22c55e",
  "#eab308",
  "#71717a",
  "#1f2937",
];

export function ColorPicker({ value, onChange, presets = DEFAULT_PRESETS, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(value);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => setHex(value), [value]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  function commit(c: string) {
    if (/^#[0-9a-fA-F]{6}$/.test(c)) {
      onChange(c);
      setHex(c);
    }
  }

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] transition-colors"
      >
        <span
          className="w-6 h-6 rounded-md border border-[var(--border)]"
          style={{ backgroundColor: value }}
        />
        <span className="font-mono text-xs uppercase tracking-wider">{value}</span>
      </button>
      {open && (
        <div className="absolute z-50 left-0 top-full mt-2 p-4 rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-xl w-64">
          <div className="grid grid-cols-6 gap-2 mb-4">
            {presets.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => {
                  onChange(c);
                  setHex(c);
                }}
                className="relative w-9 h-9 rounded-lg ring-1 ring-black/5 hover:scale-110 transition-transform"
                style={{ backgroundColor: c }}
                aria-label={`Pick ${c}`}
              >
                {c.toLowerCase() === value.toLowerCase() && (
                  <Check className="absolute inset-0 m-auto w-4 h-4 text-white mix-blend-difference" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={value}
                onChange={(e) => commit(e.target.value)}
                className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)]"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                onBlur={() => commit(hex)}
                onKeyDown={(e) => e.key === "Enter" && commit(hex)}
                placeholder="#000000"
                className="flex-1 px-3 py-2 text-sm font-mono rounded-lg border border-[var(--border)] bg-[var(--background)] outline-none focus:ring-2 focus:ring-[var(--ring)]"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
