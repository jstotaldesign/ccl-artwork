"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CalendarEvent {
  date: string; // YYYY-MM-DD
  title: string;
  tone?: "brand" | "info" | "success" | "warning" | "danger";
}

interface Props {
  events?: CalendarEvent[];
  initialMonth?: Date;
  onDayClick?: (date: Date) => void;
  className?: string;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const TONES = {
  brand: "bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand)]/30",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-900",
  success: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300 border-green-200 dark:border-green-900",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900",
  danger: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300 border-red-200 dark:border-red-900",
};

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function Calendar({ events = [], initialMonth, onDayClick, className = "" }: Props) {
  const [view, setView] = useState(initialMonth ?? new Date());

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDow = new Date(year, month, 1).getDay() || 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth = () => setView(new Date(year, month - 1, 1));
  const nextMonth = () => setView(new Date(year, month + 1, 1));
  const today = ymd(new Date());

  const cells: (number | null)[] = [];
  for (let i = 1; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7) cells.push(null);

  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const e of events) {
    const arr = eventsByDate.get(e.date) ?? [];
    arr.push(e);
    eventsByDate.set(e.date, arr);
  }

  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div>
          <h3 className="font-bold">
            {view.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </h3>
          <p className="text-xs text-[var(--muted-fg)]">
            {events.length} event{events.length === 1 ? "" : "s"} this month
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={prevMonth} className="p-1.5 rounded-md hover:bg-[var(--muted)]" aria-label="Previous month">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setView(new Date())}
            className="px-2 py-1 text-xs font-semibold rounded-md hover:bg-[var(--muted)]"
          >
            Today
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-md hover:bg-[var(--muted)]" aria-label="Next month">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-[var(--border)] bg-[var(--muted)]/50 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-fg)]">
        {WEEKDAYS.map((d) => (
          <div key={d} className="px-2 py-2 text-center">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((d, i) => {
          if (d === null) {
            return <div key={i} className="min-h-[80px] border-b border-r border-[var(--border)] last:border-r-0 bg-[var(--muted)]/30" />;
          }
          const date = new Date(year, month, d);
          const key = ymd(date);
          const isToday = key === today;
          const dayEvents = eventsByDate.get(key) ?? [];
          return (
            <button
              key={i}
              type="button"
              onClick={() => onDayClick?.(date)}
              className="min-h-[80px] p-1.5 text-left border-b border-r border-[var(--border)] last:border-r-0 hover:bg-[var(--muted)]/40 transition-colors"
            >
              <span
                className={`inline-flex items-center justify-center w-6 h-6 text-xs font-semibold rounded-full ${
                  isToday ? "bg-[var(--brand)] text-white" : ""
                }`}
              >
                {d}
              </span>
              <div className="space-y-0.5 mt-1">
                {dayEvents.slice(0, 2).map((e, j) => (
                  <span
                    key={j}
                    className={`block text-[10px] font-semibold px-1.5 py-0.5 rounded border truncate ${
                      TONES[e.tone ?? "brand"]
                    }`}
                  >
                    {e.title}
                  </span>
                ))}
                {dayEvents.length > 2 && (
                  <span className="block text-[10px] text-[var(--muted-fg)] font-medium pl-1">
                    +{dayEvents.length - 2} more
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
