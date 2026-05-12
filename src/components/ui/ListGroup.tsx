"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface ListGroupItem {
  id: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  active?: boolean;
}

interface Props {
  items: ListGroupItem[];
  variant?: "default" | "flush";
  className?: string;
}

export function ListGroup({ items, variant = "default", className = "" }: Props) {
  const wrap =
    variant === "flush"
      ? "divide-y divide-[var(--border)]"
      : "rounded-xl border border-[var(--border)] bg-[var(--card)] divide-y divide-[var(--border)] overflow-hidden";

  return (
    <ul className={`${wrap} ${className}`}>
      {items.map((item) => {
        const inner = (
          <>
            {item.icon && (
              <span className="shrink-0 w-9 h-9 rounded-lg bg-[var(--muted)] text-[var(--muted-fg)] flex items-center justify-center">
                {item.icon}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium leading-tight">{item.label}</p>
              {item.description && (
                <p className="text-xs text-[var(--muted-fg)] mt-0.5 leading-snug">{item.description}</p>
              )}
            </div>
            {item.trailing}
            {(item.href || item.onClick) && !item.trailing && (
              <ChevronRight className="w-4 h-4 text-[var(--muted-fg)] shrink-0" />
            )}
          </>
        );

        const cls = `flex items-center gap-3 px-4 py-3 transition-colors ${
          item.disabled ? "opacity-50 cursor-not-allowed" : ""
        } ${item.active ? "bg-[var(--brand-soft)]" : ""} ${
          (item.href || item.onClick) && !item.disabled ? "hover:bg-[var(--muted)] cursor-pointer" : ""
        }`;

        return (
          <li key={item.id}>
            {item.href ? (
              <Link href={item.href} className={cls}>
                {inner}
              </Link>
            ) : item.onClick ? (
              <button type="button" onClick={item.onClick} disabled={item.disabled} className={`w-full text-left ${cls}`}>
                {inner}
              </button>
            ) : (
              <div className={cls}>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
