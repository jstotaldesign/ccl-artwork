"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  slides: React.ReactNode[];
  autoPlay?: boolean;
  interval?: number;
  showArrows?: boolean;
  showDots?: boolean;
  className?: string;
  height?: number | string;
}

export function Carousel({
  slides,
  autoPlay = false,
  interval = 4000,
  showArrows = true,
  showDots = true,
  className = "",
  height = 280,
}: Props) {
  const [idx, setIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const go = (n: number) => setIdx((n + slides.length) % slides.length);
  const next = () => go(idx + 1);
  const prev = () => go(idx - 1);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(next, interval);
    return () => clearInterval(id);
  });

  // Swipe support
  const startX = useRef<number | null>(null);
  function onPointerDown(e: React.PointerEvent) {
    startX.current = e.clientX;
  }
  function onPointerUp(e: React.PointerEvent) {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    if (Math.abs(dx) > 40) (dx > 0 ? prev : next)();
    startX.current = null;
  }

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] ${className}`}>
      <div
        ref={ref}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="flex transition-transform duration-500 ease-out cursor-grab active:cursor-grabbing"
        style={{ transform: `translateX(-${idx * 100}%)`, height }}
      >
        {slides.map((s, i) => (
          <div key={i} className="w-full shrink-0 h-full flex items-center justify-center">
            {s}
          </div>
        ))}
      </div>

      {showArrows && slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center hover:bg-[var(--background)] transition-colors shadow-md"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[var(--background)]/80 backdrop-blur-sm border border-[var(--border)] flex items-center justify-center hover:bg-[var(--background)] transition-colors shadow-md"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {showDots && slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                idx === i ? "w-6 bg-[var(--brand)]" : "w-1.5 bg-[var(--muted-fg)]/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
