"use client";

import { useState, useRef, useEffect } from "react";

interface Props {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom";
  className?: string;
}

const alignClass = {
  start: "left-0",
  center: "left-1/2 -translate-x-1/2",
  end: "right-0",
};

export function Popover({ trigger, children, align = "start", side = "bottom", className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("mousedown", onClick);
      document.addEventListener("keydown", onEsc);
    }
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <span onClick={() => setOpen((v) => !v)} className="inline-flex cursor-pointer">
        {trigger}
      </span>
      {open && (
        <div
          className={`absolute z-50 min-w-[200px] rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl ${
            side === "bottom" ? "top-full mt-2" : "bottom-full mb-2"
          } ${alignClass[align]} ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
}
