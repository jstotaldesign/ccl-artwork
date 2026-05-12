"use client";

import { forwardRef, useId, useState } from "react";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "placeholder"> {
  label: string;
  error?: string;
  className?: string;
}

export const FloatingLabelInput = forwardRef<HTMLInputElement, Props>(function FloatingLabelInput(
  { label, error, className = "", id, value, ...rest },
  ref,
) {
  const generated = useId();
  const realId = id ?? generated;
  const [focused, setFocused] = useState(false);
  const filled = focused || !!value || rest.defaultValue !== undefined;

  return (
    <div className={`relative ${className}`}>
      <input
        ref={ref}
        id={realId}
        value={value}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`peer w-full px-3 pt-5 pb-1.5 text-sm rounded-xl border bg-[var(--background)] outline-none transition-colors ${
          error
            ? "border-[var(--danger)] focus:ring-2 focus:ring-[var(--danger)]/30"
            : "border-[var(--border)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/30"
        }`}
        placeholder=" "
        {...rest}
      />
      <label
        htmlFor={realId}
        className={`absolute left-3 pointer-events-none transition-all ${
          filled
            ? "top-1 text-[10px] font-semibold text-[var(--brand)] uppercase tracking-wider"
            : "top-1/2 -translate-y-1/2 text-sm text-[var(--muted-fg)]"
        } ${error && filled ? "!text-[var(--danger)]" : ""}`}
      >
        {label}
      </label>
      {error && <p className="text-xs text-[var(--danger)] mt-1">{error}</p>}
    </div>
  );
});
