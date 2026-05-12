import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({ items, showHome = true, className = "" }: Props) {
  const all = showHome ? [{ label: "Home", href: "/" }, ...items] : items;
  return (
    <nav aria-label="Breadcrumb" className={`flex items-center flex-wrap gap-1 text-sm ${className}`}>
      {all.map((item, i) => {
        const last = i === all.length - 1;
        const isHome = i === 0 && showHome;
        return (
          <span key={i} className="flex items-center gap-1">
            {item.href && !last ? (
              <Link
                href={item.href}
                className="flex items-center gap-1 text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors"
              >
                {isHome ? <Home className="w-3.5 h-3.5" /> : item.label}
              </Link>
            ) : (
              <span className={`flex items-center gap-1 ${last ? "font-semibold" : "text-[var(--muted-fg)]"}`}>
                {isHome ? <Home className="w-3.5 h-3.5" /> : item.label}
              </span>
            )}
            {!last && <ChevronRight className="w-3.5 h-3.5 text-[var(--muted-fg)]" />}
          </span>
        );
      })}
    </nav>
  );
}
