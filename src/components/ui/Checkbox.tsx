"use client";

import { forwardRef, useId } from "react";
import { Check, Minus } from "lucide-react";

interface Props extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  description?: string;
  indeterminate?: boolean;
  size?: "sm" | "md";
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(function Checkbox(
  { label, description, indeterminate, size = "md", className = "", id, ...rest },
  ref,
) {
  const dim = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  const generatedId = useId();
  const realId = id ?? generatedId;
  return (
    <label htmlFor={realId} className={`inline-flex items-start gap-2.5 cursor-pointer ${className}`}>
      <span className="relative inline-flex items-center justify-center">
        <input
          ref={ref}
          id={realId}
          type="checkbox"
          className="peer sr-only"
          {...rest}
        />
        <span
          className={`${dim} rounded-md border-2 border-[var(--border)] bg-[var(--background)] transition-all peer-checked:border-[var(--brand)] peer-checked:bg-[var(--brand)] peer-disabled:opacity-50 peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--ring)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[var(--background)] flex items-center justify-center`}
        >
          {indeterminate ? (
            <Minus className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100" strokeWidth={3} />
          ) : (
            <Check
              className={`${size === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} text-white opacity-0 transition-opacity`}
              strokeWidth={3}
            />
          )}
        </span>
        {/* Manually toggle the icon visibility because we use peer */}
        <CheckIconShown checked={!!(rest.checked || rest.defaultChecked || indeterminate)} size={size} indeterminate={indeterminate} />
      </span>
      {(label || description) && (
        <span className="-mt-0.5">
          {label && <span className="text-sm font-medium block leading-tight">{label}</span>}
          {description && <span className="text-xs text-[var(--muted-fg)] block leading-snug mt-0.5">{description}</span>}
        </span>
      )}
    </label>
  );
});

// (Peer pattern doesn't propagate to non-peer children — we render the icon
// state from props directly to keep things simple.)
function CheckIconShown({ checked, size, indeterminate }: { checked: boolean; size: "sm" | "md"; indeterminate?: boolean }) {
  if (!checked) return null;
  const Icon = indeterminate ? Minus : Check;
  return (
    <Icon
      className={`absolute ${size === "sm" ? "w-2.5 h-2.5" : "w-3.5 h-3.5"} text-white pointer-events-none`}
      strokeWidth={3}
    />
  );
}
