"use client";

import { forwardRef } from "react";

interface Props {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  size?: "sm" | "md";
  className?: string;
  name?: string;
  id?: string;
}

export const Switch = forwardRef<HTMLButtonElement, Props>(function Switch(
  { checked, defaultChecked, onChange, disabled, label, description, size = "md", className = "", name, id },
  ref,
) {
  const [internal, setInternal] = useControlled(checked, defaultChecked, onChange);
  const dim = size === "sm" ? { w: "w-8", h: "h-4", thumb: "w-3 h-3", on: "translate-x-4" } : { w: "w-11", h: "h-6", thumb: "w-5 h-5", on: "translate-x-5" };

  const toggle = () => !disabled && setInternal(!internal);

  return (
    <label className={`inline-flex items-start gap-3 cursor-pointer ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}>
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={internal}
        onClick={toggle}
        disabled={disabled}
        id={id}
        name={name}
        className={`${dim.w} ${dim.h} relative rounded-full transition-colors shrink-0 mt-0.5 ${
          internal ? "bg-[var(--brand)]" : "bg-[var(--muted)]"
        } focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-not-allowed`}
      >
        <span
          className={`${dim.thumb} absolute top-1/2 left-0.5 -translate-y-1/2 rounded-full bg-white shadow-md transition-transform ${
            internal ? dim.on : "translate-x-0"
          }`}
        />
      </button>
      {(label || description) && (
        <span>
          {label && <span className="text-sm font-medium block">{label}</span>}
          {description && <span className="text-xs text-[var(--muted-fg)] block">{description}</span>}
        </span>
      )}
    </label>
  );
});

import { useState } from "react";

function useControlled<T>(value: T | undefined, defaultValue: T | undefined, onChange?: (v: T) => void): [T, (v: T) => void] {
  const [internal, setInternal] = useState<T>(defaultValue as T);
  const isControlled = value !== undefined;
  const current = isControlled ? (value as T) : internal;
  const set = (v: T) => {
    if (!isControlled) setInternal(v);
    onChange?.(v);
  };
  return [current, set];
}
