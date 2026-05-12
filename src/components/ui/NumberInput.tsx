"use client";

import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  disabled?: boolean;
  className?: string;
}

export function NumberInput({
  value,
  onChange,
  min = -Infinity,
  max = Infinity,
  step = 1,
  unit,
  disabled,
  className = "",
}: Props) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));

  return (
    <div
      className={`inline-flex items-stretch rounded-xl border border-[var(--border)] bg-[var(--background)] overflow-hidden ${
        disabled ? "opacity-50" : ""
      } ${className}`}
    >
      <button
        type="button"
        onClick={dec}
        disabled={disabled || value <= min}
        className="px-3 hover:bg-[var(--muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        aria-label="Decrease"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const n = Number(e.target.value);
          if (!isNaN(n)) onChange(Math.max(min, Math.min(max, n)));
        }}
        disabled={disabled}
        className="w-16 text-center bg-transparent outline-none font-mono font-semibold text-sm tabular-nums [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      {unit && <span className="self-center pr-2 text-xs text-[var(--muted-fg)] font-medium">{unit}</span>}
      <button
        type="button"
        onClick={inc}
        disabled={disabled || value >= max}
        className="px-3 hover:bg-[var(--muted)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors border-l border-[var(--border)]"
        aria-label="Increase"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
