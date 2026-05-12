"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  value?: Date | string | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  className?: string;
  locale?: string;
}

function toDate(v: Date | string | null | undefined): Date | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  return isNaN(d.getTime()) ? null : d;
}

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function DatePicker({ value, onChange, placeholder = "Pick a date", min, max, disabled, className = "", locale = "en-US" }: Props) {
  const sel = toDate(value);
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => sel ?? new Date());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDow = new Date(year, month, 1).getDay() || 7; // Mon=1..Sun=7
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = ymd(new Date());

  function shift(delta: number) {
    setView(new Date(year, month + delta, 1));
  }

  const cells: (number | null)[] = [];
  for (let i = 1; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);

  function pick(d: number) {
    const date = new Date(year, month, d);
    if (min && date < min) return;
    if (max && date > max) return;
    onChange(date);
    setOpen(false);
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => !disabled && setOpen((v) => !v)}
        disabled={disabled}
        className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--background)] text-left disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[var(--muted)]/40 transition-colors"
      >
        <Calendar className="w-3.5 h-3.5 text-[var(--muted-fg)]" />
        <span className={`flex-1 ${!sel ? "text-[var(--muted-fg)]" : ""}`}>
          {sel ? sel.toLocaleDateString(locale, { day: "2-digit", month: "short", year: "numeric" }) : placeholder}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 left-0 mt-2 p-3 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl w-72">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => shift(-1)}
              className="p-1 rounded-md hover:bg-[var(--muted)]"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <p className="font-semibold text-sm">
              {view.toLocaleDateString(locale, { month: "long", year: "numeric" })}
            </p>
            <button
              type="button"
              onClick={() => shift(1)}
              className="p-1 rounded-md hover:bg-[var(--muted)]"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] text-[var(--muted-fg)] mb-1 font-medium">
            {WEEKDAYS.map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <span key={i} />;
              const date = new Date(year, month, d);
              const isToday = ymd(date) === today;
              const isSelected = sel && ymd(date) === ymd(sel);
              const isDisabled = (min && date < min) || (max && date > max);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(d)}
                  disabled={!!isDisabled}
                  className={`w-9 h-9 rounded-md text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                    isSelected
                      ? "bg-[var(--brand)] text-white"
                      : isToday
                        ? "bg-[var(--brand-soft)] text-[var(--brand)]"
                        : "hover:bg-[var(--muted)]"
                  }`}
                >
                  {d}
                </button>
              );
            })}
          </div>
          <div className="flex justify-between mt-3 pt-3 border-t border-[var(--border)] text-xs">
            <button
              type="button"
              onClick={() => {
                onChange(new Date());
                setOpen(false);
              }}
              className="font-semibold text-[var(--brand)] hover:underline"
            >
              Today
            </button>
            {sel && (
              <button
                type="button"
                onClick={() => {
                  onChange(null);
                  setOpen(false);
                }}
                className="font-medium text-[var(--muted-fg)] hover:text-[var(--danger)]"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
