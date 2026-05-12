"use client";

import { useRef } from "react";

interface Props {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  showValue?: boolean;
  marks?: number[];
  disabled?: boolean;
  className?: string;
}

export function Slider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  showValue,
  marks,
  disabled,
  className = "",
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pct = ((value - min) / (max - min)) * 100;

  function setFromClientX(clientX: number) {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const raw = min + ratio * (max - min);
    const stepped = Math.round(raw / step) * step;
    onChange(Math.max(min, Math.min(max, stepped)));
  }

  function onPointerDown(e: React.PointerEvent) {
    if (disabled) return;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setFromClientX(e.clientX);
  }
  function onPointerMove(e: React.PointerEvent) {
    if (disabled) return;
    if (e.buttons !== 1) return;
    setFromClientX(e.clientX);
  }

  return (
    <div className={`w-full ${disabled ? "opacity-50" : ""} ${className}`}>
      <div className="flex items-center gap-3">
        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          className="relative flex-1 h-1.5 rounded-full bg-[var(--muted)] cursor-pointer select-none"
        >
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-brand-gradient"
            style={{ width: `${pct}%` }}
          />
          {marks?.map((m) => {
            const mp = ((m - min) / (max - min)) * 100;
            return (
              <span
                key={m}
                className="absolute -top-0.5 w-0.5 h-2.5 bg-[var(--muted-fg)]/40 rounded-full -translate-x-1/2"
                style={{ left: `${mp}%` }}
              />
            );
          })}
          <button
            type="button"
            disabled={disabled}
            aria-label="slider thumb"
            className="absolute top-1/2 w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white border-2 border-[var(--brand)] shadow-md hover:scale-110 transition-transform focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            style={{ left: `${pct}%` }}
          />
        </div>
        {showValue && (
          <span className="font-mono text-xs font-semibold w-10 text-right tabular-nums">{value}</span>
        )}
      </div>
    </div>
  );
}
