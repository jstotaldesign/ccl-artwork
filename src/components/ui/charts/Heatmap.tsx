"use client";

/**
 * GitHub-style activity heatmap. Renders a year of daily activity as a grid
 * of 7 rows (weekdays) × N columns (weeks). Intensity is binned into 5 levels.
 */

interface Cell {
  date: string; // YYYY-MM-DD
  value: number;
}

interface Props {
  data: Cell[];
  weeks?: number;
  className?: string;
}

export function Heatmap({ data, weeks = 26, className = "" }: Props) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const byDate = new Map(data.map((d) => [d.date, d.value]));

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  // Start at most recent Sunday going back N weeks.
  const start = new Date(today);
  start.setDate(today.getDate() - today.getDay() - (weeks - 1) * 7);

  const cells: { date: string; value: number; level: number }[] = [];
  for (let w = 0; w < weeks; w++) {
    for (let d = 0; d < 7; d++) {
      const date = new Date(start);
      date.setDate(start.getDate() + w * 7 + d);
      const key = ymd(date);
      const value = byDate.get(key) ?? 0;
      const level = value === 0 ? 0 : Math.min(4, Math.ceil((value / max) * 4));
      cells.push({ date: key, value, level });
    }
  }

  const LEVEL_CLASS = [
    "bg-[var(--muted)]",
    "bg-[var(--brand)]/20",
    "bg-[var(--brand)]/40",
    "bg-[var(--brand)]/70",
    "bg-[var(--brand)]",
  ];

  return (
    <div className={className}>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${weeks}, minmax(0, 1fr))`, gridAutoFlow: "column", gridTemplateRows: "repeat(7, minmax(0, 1fr))" }}
      >
        {cells.map((c, i) => (
          <span
            key={i}
            title={`${c.date}: ${c.value}`}
            className={`w-full aspect-square rounded-sm ${LEVEL_CLASS[c.level]}`}
          />
        ))}
      </div>
      <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-[var(--muted-fg)]">
        <span>Less</span>
        {LEVEL_CLASS.map((cls, i) => (
          <span key={i} className={`w-3 h-3 rounded-sm ${cls}`} />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}

function ymd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
