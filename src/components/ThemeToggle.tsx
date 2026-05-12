"use client";

import { useState, useRef, useEffect } from "react";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useTheme } from "./ThemeProvider";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, resolved, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const Icon = resolved === "dark" ? Moon : Sun;
  const options: { value: typeof theme; label: string; icon: React.ElementType }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center justify-center rounded-lg hover:bg-[var(--muted)] text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors ${compact ? "w-9 h-9" : "p-2"}`}
        aria-label="Theme"
      >
        <Icon className="w-4 h-4" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 min-w-[140px] py-1 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-lg z-50">
          {options.map((opt) => {
            const Ico = opt.icon;
            const active = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => {
                  setTheme(opt.value);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--muted)] transition-colors"
              >
                <Ico className="w-4 h-4 text-[var(--muted-fg)]" />
                <span className="flex-1 text-left">{opt.label}</span>
                {active && <Check className="w-3.5 h-3.5 text-[var(--brand)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
