import type { ComponentType } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  delta?: { value: string; up: boolean };
  description?: string;
  icon?: ComponentType<{ className?: string }>;
  tone?: "brand" | "info" | "success" | "warning" | "danger" | "violet";
  className?: string;
}

const TONES: Record<NonNullable<Props["tone"]>, string> = {
  brand: "from-orange-500/15 to-orange-500/5 text-[var(--brand)]",
  info: "from-blue-500/15 to-blue-500/5 text-blue-500",
  success: "from-green-500/15 to-green-500/5 text-green-500",
  warning: "from-amber-500/15 to-amber-500/5 text-amber-500",
  danger: "from-red-500/15 to-red-500/5 text-red-500",
  violet: "from-violet-500/15 to-violet-500/5 text-violet-500",
};

export function Stat({ label, value, delta, description, icon: Icon, tone = "brand", className = "" }: Props) {
  return (
    <div className={`rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[var(--muted-fg)] uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-extrabold mt-1.5">{value}</p>
          {delta && (
            <p
              className={`text-xs font-semibold flex items-center gap-1 mt-1 ${
                delta.up ? "text-[var(--success)]" : "text-[var(--danger)]"
              }`}
            >
              {delta.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {delta.value}
            </p>
          )}
          {description && <p className="text-xs text-[var(--muted-fg)] mt-1">{description}</p>}
        </div>
        {Icon && (
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${TONES[tone]} flex items-center justify-center shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </div>
  );
}
