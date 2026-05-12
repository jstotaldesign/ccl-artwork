"use client";

interface Slice {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  data: Slice[];
  size?: number;
  thickness?: number;
  showLegend?: boolean;
  centerLabel?: React.ReactNode;
  className?: string;
}

const PALETTE = ["var(--brand)", "#3b82f6", "#22c55e", "#8b5cf6", "#ec4899", "#f59e0b", "#06b6d4"];

export function DonutChart({
  data,
  size = 160,
  thickness = 24,
  showLegend = true,
  centerLabel,
  className = "",
}: Props) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let acc = 0;

  return (
    <div className={`flex items-center gap-6 flex-wrap ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {data.map((d, i) => {
            const color = d.color ?? PALETTE[i % PALETTE.length];
            const portion = (d.value / total) * c;
            const offset = -acc;
            acc += portion;
            return (
              <circle
                key={i}
                cx={size / 2}
                cy={size / 2}
                r={r}
                stroke={color}
                strokeWidth={thickness}
                fill="none"
                strokeDasharray={`${portion} ${c}`}
                strokeDashoffset={offset}
              />
            );
          })}
        </svg>
        {centerLabel && (
          <div className="absolute inset-0 flex items-center justify-center text-center">
            {centerLabel}
          </div>
        )}
      </div>
      {showLegend && (
        <ul className="space-y-1.5 flex-1 min-w-[140px]">
          {data.map((d, i) => {
            const color = d.color ?? PALETTE[i % PALETTE.length];
            const pct = ((d.value / total) * 100).toFixed(0);
            return (
              <li key={d.label} className="flex items-center gap-2 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: color }} />
                <span className="flex-1 truncate">{d.label}</span>
                <span className="font-mono font-semibold text-[var(--muted-fg)] tabular-nums">{pct}%</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
