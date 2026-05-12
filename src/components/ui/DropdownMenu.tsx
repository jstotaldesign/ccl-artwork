"use client";

import { useState, useRef, useEffect } from "react";
import { Check, ChevronRight } from "lucide-react";

interface MenuProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: "start" | "end";
  className?: string;
}

const alignClass = { start: "left-0", end: "right-0" };

export function DropdownMenu({ trigger, children, align = "start", className = "" }: MenuProps) {
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
          role="menu"
          className={`absolute z-50 mt-2 min-w-[180px] py-1 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl ${alignClass[align]} ${className}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Auto-close on item click */}
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  );
}

interface ItemProps {
  onClick?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  checked?: boolean;
  href?: string;
}

export function MenuItem({ onClick, icon, children, shortcut, danger, disabled, checked, href }: ItemProps) {
  const cls = `w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed ${
    danger ? "text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-950/30" : "hover:bg-[var(--muted)]"
  }`;
  const inner = (
    <>
      {icon && <span className="text-[var(--muted-fg)]">{icon}</span>}
      <span className="flex-1">{children}</span>
      {checked !== undefined && checked && <Check className="w-3.5 h-3.5 text-[var(--brand)]" />}
      {shortcut && <kbd className="text-[10px] font-mono text-[var(--muted-fg)]">{shortcut}</kbd>}
    </>
  );
  if (href) {
    return (
      <a href={href} className={cls}>
        {inner}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={cls}>
      {inner}
    </button>
  );
}

export function MenuSeparator() {
  return <div className="my-1 h-px bg-[var(--border)]" />;
}

export function MenuLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--muted-fg)]">{children}</p>
  );
}

export function MenuSubmenu({ trigger, children }: { trigger: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="relative group">
      <div className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-[var(--muted)] cursor-pointer">
        <span className="flex-1">{trigger}</span>
        <ChevronRight className="w-3 h-3 text-[var(--muted-fg)]" />
      </div>
      <div className="absolute left-full top-0 ml-1 min-w-[180px] py-1 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity">
        {children}
      </div>
    </div>
  );
}
