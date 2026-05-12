import { Check } from "lucide-react";

export interface Step {
  label: string;
  description?: string;
}

interface Props {
  steps: Step[];
  current: number; // 0-indexed
  className?: string;
  variant?: "horizontal" | "vertical";
}

export function Stepper({ steps, current, className = "", variant = "horizontal" }: Props) {
  if (variant === "vertical") return <VerticalStepper steps={steps} current={current} className={className} />;
  return (
    <ol className={`flex items-start ${className}`}>
      {steps.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;
        const last = i === steps.length - 1;
        return (
          <li key={i} className={`flex items-start ${last ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? "bg-[var(--brand)] text-white"
                    : isActive
                      ? "bg-brand-gradient text-white shadow-md ring-4 ring-[var(--brand-soft)]"
                      : "bg-[var(--muted)] text-[var(--muted-fg)] border border-[var(--border)]"
                }`}
              >
                {isDone ? <Check className="w-4 h-4" strokeWidth={3} /> : i + 1}
              </div>
              <p className={`text-xs font-semibold mt-2 ${isActive ? "text-[var(--foreground)]" : "text-[var(--muted-fg)]"}`}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-[10px] text-[var(--muted-fg)] mt-0.5 max-w-[120px]">{step.description}</p>
              )}
            </div>
            {!last && (
              <div className={`flex-1 h-px mt-4 mx-2 ${isDone ? "bg-[var(--brand)]" : "bg-[var(--border)]"}`} />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function VerticalStepper({ steps, current, className }: { steps: Step[]; current: number; className: string }) {
  return (
    <ol className={`space-y-3 ${className}`}>
      {steps.map((step, i) => {
        const isDone = i < current;
        const isActive = i === current;
        return (
          <li key={i} className="flex items-start gap-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                isDone
                  ? "bg-[var(--brand)] text-white"
                  : isActive
                    ? "bg-brand-gradient text-white shadow ring-4 ring-[var(--brand-soft)]"
                    : "bg-[var(--muted)] text-[var(--muted-fg)] border border-[var(--border)]"
              }`}
            >
              {isDone ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : i + 1}
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className={`text-sm font-semibold ${isActive ? "text-[var(--foreground)]" : "text-[var(--muted-fg)]"}`}>
                {step.label}
              </p>
              {step.description && <p className="text-xs text-[var(--muted-fg)] mt-0.5">{step.description}</p>}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
