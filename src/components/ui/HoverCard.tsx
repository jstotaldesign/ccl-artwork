"use client";

import { useState, useRef } from "react";

interface Props {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

const SIDES: Record<NonNullable<Props["side"]>, string> = {
  top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
  bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
  left: "right-full top-1/2 -translate-y-1/2 mr-2",
  right: "left-full top-1/2 -translate-y-1/2 ml-2",
};

export function HoverCard({ content, children, side = "bottom", delay = 200, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  function show() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), delay);
  }
  function hide() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <span className="relative inline-flex" onMouseEnter={show} onMouseLeave={hide}>
      {children}
      {open && (
        <span
          className={`absolute z-50 ${SIDES[side]} w-72 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl p-4 text-sm ${className}`}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          {content}
        </span>
      )}
    </span>
  );
}
