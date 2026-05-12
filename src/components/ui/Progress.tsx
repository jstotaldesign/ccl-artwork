interface ProgressProps {
  value: number;
  max?: number;
  tone?: "brand" | "success" | "warning" | "danger" | "info";
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

const HEIGHTS = { sm: "h-1", md: "h-2", lg: "h-3" };
const TONES: Record<NonNullable<ProgressProps["tone"]>, string> = {
  brand: "bg-brand-gradient",
  success: "bg-[var(--success)]",
  warning: "bg-[var(--warning)]",
  danger: "bg-[var(--danger)]",
  info: "bg-[var(--info)]",
};

export function Progress({ value, max = 100, tone = "brand", size = "md", showValue, className = "" }: ProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={`w-full ${className}`}>
      <div className={`w-full ${HEIGHTS[size]} rounded-full bg-[var(--muted)] overflow-hidden`}>
        <div
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          className={`${HEIGHTS[size]} ${TONES[tone]} transition-all duration-500 rounded-full`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showValue && (
        <div className="flex justify-end mt-1 text-xs text-[var(--muted-fg)] font-mono">{Math.round(pct)}%</div>
      )}
    </div>
  );
}

interface CircleProgressProps {
  value: number;
  max?: number;
  size?: number;
  stroke?: number;
  tone?: NonNullable<ProgressProps["tone"]>;
  showValue?: boolean;
  className?: string;
}

const STROKE_VARS: Record<NonNullable<CircleProgressProps["tone"]>, string> = {
  brand: "var(--brand)",
  success: "var(--success)",
  warning: "var(--warning)",
  danger: "var(--danger)",
  info: "var(--info)",
};

export function CircleProgress({
  value,
  max = 100,
  size = 48,
  stroke = 4,
  tone = "brand",
  showValue,
  className = "",
}: CircleProgressProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;
  return (
    <div className={`relative inline-flex ${className}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--muted)"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={STROKE_VARS[tone]}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-[stroke-dashoffset] duration-500"
        />
      </svg>
      {showValue && (
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}
