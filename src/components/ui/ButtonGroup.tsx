"use client";

interface Option<T extends string> {
  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
}

interface Props<T extends string> {
  value: T;
  onChange: (v: T) => void;
  options: Option<T>[];
  size?: "sm" | "md";
  fullWidth?: boolean;
  className?: string;
}

const SIZES = {
  sm: "px-2.5 py-1 text-xs",
  md: "px-3 py-1.5 text-sm",
};

export function ButtonGroup<T extends string>({
  value,
  onChange,
  options,
  size = "md",
  fullWidth,
  className = "",
}: Props<T>) {
  return (
    <div
      role="radiogroup"
      className={`inline-flex ${fullWidth ? "w-full" : ""} rounded-xl border border-[var(--border)] bg-[var(--muted)]/50 p-0.5 ${className}`}
    >
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={`inline-flex items-center justify-center gap-1.5 ${fullWidth ? "flex-1" : ""} ${SIZES[size]} rounded-lg font-semibold transition-all ${
              active
                ? "bg-[var(--background)] text-[var(--foreground)] shadow-sm"
                : "text-[var(--muted-fg)] hover:text-[var(--foreground)]"
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
