"use client";

import { createContext, useContext, useState } from "react";
import { ChevronDown } from "lucide-react";

interface AccordionCtx {
  open: Set<string>;
  toggle: (id: string) => void;
  type: "single" | "multiple";
}

const Ctx = createContext<AccordionCtx | null>(null);

interface AccordionProps {
  type?: "single" | "multiple";
  defaultOpen?: string | string[];
  children: React.ReactNode;
  className?: string;
}

export function Accordion({ type = "single", defaultOpen, children, className = "" }: AccordionProps) {
  const initial = new Set<string>(Array.isArray(defaultOpen) ? defaultOpen : defaultOpen ? [defaultOpen] : []);
  const [open, setOpen] = useState(initial);

  function toggle(id: string) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else {
        if (type === "single") next.clear();
        next.add(id);
      }
      return next;
    });
  }

  return (
    <Ctx.Provider value={{ open, toggle, type }}>
      <div className={`space-y-2 ${className}`}>{children}</div>
    </Ctx.Provider>
  );
}

interface ItemProps {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export function AccordionItem({ id, title, children, icon, className = "" }: ItemProps) {
  const ctx = useContext(Ctx)!;
  const isOpen = ctx.open.has(id);
  return (
    <div className={`rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden ${className}`}>
      <button
        type="button"
        onClick={() => ctx.toggle(id)}
        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--muted)] transition-colors"
      >
        {icon}
        <span className="flex-1 font-semibold text-sm">{title}</span>
        <ChevronDown className={`w-4 h-4 text-[var(--muted-fg)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-300"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 pt-1 text-sm text-[var(--muted-fg)] leading-relaxed">{children}</div>
        </div>
      </div>
    </div>
  );
}
