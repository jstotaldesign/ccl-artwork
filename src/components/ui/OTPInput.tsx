"use client";

import { useRef, useState, useEffect } from "react";

interface Props {
  length?: number;
  value?: string;
  onChange?: (v: string) => void;
  onComplete?: (v: string) => void;
  autoFocus?: boolean;
  disabled?: boolean;
  className?: string;
}

export function OTPInput({
  length = 6,
  value = "",
  onChange,
  onComplete,
  autoFocus,
  disabled,
  className = "",
}: Props) {
  const [digits, setDigits] = useState<string[]>(() => splitToLen(value, length));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setDigits(splitToLen(value, length));
  }, [value, length]);

  function update(next: string[]) {
    setDigits(next);
    const joined = next.join("");
    onChange?.(joined);
    if (joined.length === length && !next.includes("")) onComplete?.(joined);
  }

  function onInput(i: number, raw: string) {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      const next = [...digits];
      next[i] = "";
      update(next);
      return;
    }
    // If user pastes multiple digits, distribute them forward.
    const chars = cleaned.split("");
    const next = [...digits];
    for (let j = 0; j < chars.length && i + j < length; j++) {
      next[i + j] = chars[j];
    }
    update(next);
    const target = Math.min(length - 1, i + chars.length);
    refs.current[target]?.focus();
    refs.current[target]?.select();
  }

  function onKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      refs.current[i - 1]?.focus();
      const next = [...digits];
      next[i - 1] = "";
      update(next);
    } else if (e.key === "ArrowLeft" && i > 0) {
      refs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < length - 1) {
      refs.current[i + 1]?.focus();
    }
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          autoFocus={autoFocus && i === 0}
          disabled={disabled}
          value={digits[i] ?? ""}
          onChange={(e) => onInput(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          onFocus={(e) => e.target.select()}
          className="w-12 h-14 text-center text-xl font-bold font-mono rounded-xl border-2 border-[var(--border)] bg-[var(--background)] focus:border-[var(--brand)] focus:ring-2 focus:ring-[var(--brand)]/30 outline-none disabled:opacity-50 transition-colors"
        />
      ))}
    </div>
  );
}

function splitToLen(v: string, n: number): string[] {
  const arr: string[] = [];
  for (let i = 0; i < n; i++) arr.push(v[i] ?? "");
  return arr;
}
