"use client";

import { createContext, useContext, useId } from "react";

interface RadioContextValue {
  name: string;
  value?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
}

const Ctx = createContext<RadioContextValue | null>(null);

interface RadioGroupProps {
  name?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (v: string) => void;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  orientation?: "horizontal" | "vertical";
}

import { useState } from "react";

export function RadioGroup({
  name,
  value,
  defaultValue,
  onChange,
  disabled,
  children,
  className = "",
  orientation = "vertical",
}: RadioGroupProps) {
  const generated = useId();
  const [internal, setInternal] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const set = (v: string) => {
    if (!controlled) setInternal(v);
    onChange?.(v);
  };

  return (
    <Ctx.Provider value={{ name: name ?? `rg-${generated}`, value: current, onChange: set, disabled }}>
      <div
        role="radiogroup"
        className={`${orientation === "horizontal" ? "flex gap-4" : "flex flex-col gap-2"} ${className}`}
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

interface RadioProps {
  value: string;
  label?: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function Radio({ value, label, description, disabled, className = "" }: RadioProps) {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("Radio must be inside RadioGroup");
  const checked = ctx.value === value;
  const isDisabled = disabled || ctx.disabled;
  return (
    <label className={`inline-flex items-start gap-2.5 cursor-pointer ${isDisabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      <input
        type="radio"
        name={ctx.name}
        value={value}
        checked={checked}
        disabled={isDisabled}
        onChange={() => ctx.onChange?.(value)}
        className="peer sr-only"
      />
      <span className="relative w-5 h-5 rounded-full border-2 border-[var(--border)] bg-[var(--background)] transition-colors peer-checked:border-[var(--brand)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--background)] flex items-center justify-center shrink-0 mt-0.5">
        <span className={`w-2.5 h-2.5 rounded-full bg-[var(--brand)] transition-transform ${checked ? "scale-100" : "scale-0"}`} />
      </span>
      {(label || description) && (
        <span>
          {label && <span className="text-sm font-medium block leading-tight">{label}</span>}
          {description && <span className="text-xs text-[var(--muted-fg)] block leading-snug mt-0.5">{description}</span>}
        </span>
      )}
    </label>
  );
}
