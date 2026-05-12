"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface Props {
  value?: number;
  onChange?: (v: number) => void;
  max?: number;
  size?: "sm" | "md" | "lg";
  readonly?: boolean;
  allowHalf?: boolean;
  className?: string;
}

const SIZES = { sm: "w-3.5 h-3.5", md: "w-5 h-5", lg: "w-7 h-7" };

export function Rating({
  value = 0,
  onChange,
  max = 5,
  size = "md",
  readonly,
  allowHalf,
  className = "",
}: Props) {
  const [hover, setHover] = useState<number | null>(null);
  const display = hover ?? value;
  const sz = SIZES[size];

  function pick(star: number, isHalf: boolean) {
    if (readonly) return;
    onChange?.(allowHalf && isHalf ? star - 0.5 : star);
  }

  return (
    <div
      className={`inline-flex items-center gap-0.5 ${className}`}
      onMouseLeave={() => setHover(null)}
    >
      {Array.from({ length: max }).map((_, i) => {
        const star = i + 1;
        const fill = display >= star ? 1 : display >= star - 0.5 ? 0.5 : 0;
        return (
          <span key={i} className="relative inline-flex">
            <Star className={`${sz} text-[var(--muted-fg)]/40`} />
            {fill > 0 && (
              <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
                <Star className={`${sz} text-amber-400 fill-amber-400`} />
              </span>
            )}
            {!readonly && (
              <>
                <button
                  type="button"
                  aria-label={`${star - 0.5} stars`}
                  className="absolute left-0 top-0 h-full w-1/2 cursor-pointer"
                  onMouseEnter={() => setHover(allowHalf ? star - 0.5 : star)}
                  onClick={() => pick(star, true)}
                />
                <button
                  type="button"
                  aria-label={`${star} stars`}
                  className="absolute right-0 top-0 h-full w-1/2 cursor-pointer"
                  onMouseEnter={() => setHover(star)}
                  onClick={() => pick(star, false)}
                />
              </>
            )}
          </span>
        );
      })}
    </div>
  );
}
