import { Check } from "lucide-react";

export interface TimelineItem {
  title: string;
  description?: string;
  date?: string;
  icon?: React.ReactNode;
  tone?: "default" | "success" | "warning" | "danger" | "info" | "brand";
}

interface Props {
  items: TimelineItem[];
  className?: string;
}

const TONES = {
  default: "bg-[var(--muted)] text-[var(--muted-fg)] border-[var(--border)]",
  brand: "bg-[var(--brand-soft)] text-[var(--brand)] border-[var(--brand)]/40",
  success: "bg-green-100 text-green-700 border-green-300 dark:bg-green-950 dark:text-green-300 dark:border-green-900",
  warning: "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-900",
  danger: "bg-red-100 text-red-700 border-red-300 dark:bg-red-950 dark:text-red-300 dark:border-red-900",
  info: "bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900",
};

export function Timeline({ items, className = "" }: Props) {
  return (
    <ol className={`relative ${className}`}>
      {items.map((item, i) => {
        const tone = item.tone ?? "default";
        const last = i === items.length - 1;
        return (
          <li key={i} className="flex gap-4 pb-6 last:pb-0 relative">
            {!last && (
              <span
                aria-hidden
                className="absolute left-[15px] top-8 bottom-0 w-px bg-[var(--border)]"
              />
            )}
            <span
              className={`relative z-10 shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center ${TONES[tone]}`}
            >
              {item.icon ?? <Check className="w-3.5 h-3.5" strokeWidth={3} />}
            </span>
            <div className="flex-1 min-w-0 pb-2">
              <div className="flex items-baseline justify-between gap-2 flex-wrap">
                <p className="font-semibold text-sm">{item.title}</p>
                {item.date && <p className="text-xs text-[var(--muted-fg)] font-mono">{item.date}</p>}
              </div>
              {item.description && (
                <p className="text-sm text-[var(--muted-fg)] mt-1 leading-relaxed">{item.description}</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
