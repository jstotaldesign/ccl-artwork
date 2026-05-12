"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  ChevronsUpDown,
  ChevronDown,
  Sparkles,
  LayoutDashboard,
  Settings,
  User as UserIcon,
  FileText,
} from "lucide-react";

interface SidebarProps {
  user: { email: string; name: string | null };
  tenant: { slug: string; name: string };
  collapsed?: boolean;
  onOpenSearch?: () => void;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

interface NavSection {
  label: string;
  items: NavItem[];
  collapsible?: boolean;
}

export function Sidebar({ tenant, collapsed = false, onOpenSearch }: SidebarProps) {
  const pathname = usePathname();

  // ── Add your nav items here ───────────────────────────────────────────────
  const sections: NavSection[] = [
    {
      label: "Workspace",
      items: [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/artwork-discontinue", label: "Artwork Discontinue", icon: FileText },
        { href: "/settings", label: "Settings", icon: Settings },
      ],
    },
  ];
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <aside className={`${collapsed ? "w-16" : "w-64"} shrink-0 border-r border-[var(--border)] bg-[var(--background)] flex flex-col h-screen lg:sticky lg:top-0 transition-all duration-200`}>
      <Link href="/dashboard" className={`flex items-center gap-2 ${collapsed ? "justify-center px-2" : "px-5"} pt-4 pb-3 font-bold text-lg`}>
        <span className="w-8 h-8 rounded-xl bg-brand-gradient flex items-center justify-center text-white shadow-md shrink-0">
          <Sparkles className="w-4 h-4" />
        </span>
        {!collapsed && "ccl-artwork"}
      </Link>

      {!collapsed && (
        <button className="flex items-center gap-3 px-3 mx-3 py-2.5 rounded-xl border border-[var(--border)] bg-[var(--card)] hover:bg-[var(--muted)] transition-colors">
          <span className="w-7 h-7 rounded-lg bg-[var(--brand-soft)] flex items-center justify-center text-[var(--brand)] shrink-0 text-xs font-bold">
            {tenant.name.slice(0, 1).toUpperCase()}
          </span>
          <div className="flex-1 text-left min-w-0">
            <p className="text-[10px] text-[var(--muted-fg)] font-bold uppercase tracking-wider">Workspace</p>
            <p className="text-sm font-bold truncate">{tenant.name}</p>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 text-[var(--muted-fg)] shrink-0" />
        </button>
      )}

      {!collapsed && (
        <button
          onClick={onOpenSearch}
          className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--muted)]/70 text-[var(--muted-fg)] text-sm transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="flex-1 text-left">Search…</span>
          <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--muted-fg)]">⌘K</kbd>
        </button>
      )}

      <nav className="flex-1 px-3 py-4 space-y-3 overflow-y-auto">
        {sections.map((section) => (
          <NavGroup key={section.label} section={section} pathname={pathname} collapsed={collapsed} />
        ))}
      </nav>
    </aside>
  );
}

function NavGroup({ section, pathname, collapsed }: { section: NavSection; pathname: string; collapsed: boolean }) {
  const activeHref = section.items.reduce<string | null>((best, i) => {
    const match = pathname === i.href || pathname.startsWith(i.href + "/");
    if (!match) return best;
    if (!best || i.href.length > best.length) return i.href;
    return best;
  }, null);
  const [open, setOpen] = useState(section.collapsible ? activeHref !== null : true);

  if (collapsed) {
    return (
      <div className="space-y-0.5">
        {section.items.map((item) => {
          const active = item.href === activeHref;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`w-9 h-9 mx-auto flex items-center justify-center rounded-lg ${active ? "bg-[var(--brand-soft)] text-[var(--brand)]" : "text-[var(--muted-fg)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"}`}
            >
              <Icon className="w-4 h-4" />
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {section.collapsible ? (
        <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center gap-2 px-3 mb-1 text-[10px] font-bold text-[var(--muted-fg)] uppercase tracking-wider hover:text-[var(--foreground)]">
          <span className="flex-1 text-left">{section.label}</span>
          <ChevronDown className={`w-3 h-3 transition-transform ${open ? "" : "-rotate-90"}`} />
        </button>
      ) : (
        <p className="text-[10px] font-bold text-[var(--muted-fg)] uppercase tracking-wider px-3 mb-1.5">{section.label}</p>
      )}
      {open && section.items.map((item) => {
        const active = item.href === activeHref;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${active ? "bg-[var(--brand-soft)] text-[var(--brand)] shadow-sm" : "text-[var(--muted-fg)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"}`}
          >
            <Icon className={`w-4 h-4 ${active ? "text-[var(--brand)]" : ""}`} />
            <span className="flex-1 truncate">{item.label}</span>
            {active && <span className="w-1.5 h-1.5 rounded-full bg-[var(--brand)]" />}
          </Link>
        );
      })}
    </div>
  );
}
