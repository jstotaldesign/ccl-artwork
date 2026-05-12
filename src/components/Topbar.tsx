"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  Search,
  Settings,
  User as UserIcon,
  LogOut,
  ChevronDown,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { NotificationBell } from "./NotificationBell";
import { LocaleSwitcher } from "./LocaleSwitcher";

interface TopbarProps {
  user: { email: string; name: string | null };
  tenant: { slug: string; name: string };
  onMobileMenu: () => void;
  onToggleSidebar: () => void;
  collapsed: boolean;
  onOpenSearch: () => void;
}

/**
 * Derive a page title from the pathname. Avoids prop-drilling a title
 * through every page; matches the topbar/breadcrumb pattern from tjr_food.
 */
function deriveTitle(pathname: string): string {
  const seg = pathname.split("/").filter(Boolean);
  if (seg.length === 0) return "Home";
  // Special-case dashboards/* and apps/*
  if (seg[0] === "dashboards") return seg[1] ? capitalize(seg[1]) + " · Dashboard" : "Dashboards";
  if (seg[0] === "apps") return seg[1] ? capitalize(seg[1]) : "Apps";
  if (seg[0] === "settings") return seg[1] ? capitalize(seg[1]) + " · Settings" : "Settings";
  return capitalize(seg[seg.length - 1]);
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, " ");
}

export function Topbar({ user, tenant, onMobileMenu, onToggleSidebar, collapsed, onOpenSearch }: TopbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const title = deriveTitle(pathname);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    }
    if (menuOpen) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  async function onSignOut() {
    await fetch("/api/auth/sign-out", { method: "POST" });
    router.push("/auth/sign-in");
    router.refresh();
  }

  const initials = (user.name || user.email)
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--background)]/80 border-b border-[var(--border)]">
      <div className="flex items-center gap-3 px-4 sm:px-6 h-14">
        {/* Hamburger — mobile */}
        <button
          onClick={onMobileMenu}
          className="lg:hidden w-9 h-9 rounded-lg hover:bg-[var(--muted)] flex items-center justify-center text-[var(--foreground)]"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Collapse toggle — desktop */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex w-9 h-9 rounded-lg hover:bg-[var(--muted)] items-center justify-center text-[var(--muted-fg)] hover:text-[var(--foreground)]"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>

        {/* Page title */}
        <h1 className="font-bold text-base sm:text-lg tracking-tight truncate">{title}</h1>

        {/* Spacer + Search (desktop) */}
        <div className="hidden md:flex flex-1 justify-center max-w-md mx-auto">
          <button
            onClick={onOpenSearch}
            className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--muted)] hover:bg-[var(--muted)]/70 text-[var(--muted-fg)] text-sm transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex-1 text-left">Search anything…</span>
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-[var(--border)] bg-[var(--background)] text-[var(--muted-fg)]">
              ⌘K
            </kbd>
          </button>
        </div>

        <div className="md:hidden flex-1">
          <button
            onClick={onOpenSearch}
            className="ml-auto w-9 h-9 rounded-lg hover:bg-[var(--muted)] flex items-center justify-center text-[var(--muted-fg)]"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-1">
          <Link
            href="/faq"
            className="hidden sm:flex w-9 h-9 rounded-lg hover:bg-[var(--muted)] items-center justify-center text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors"
            aria-label="Help"
            title="Help"
          >
            <HelpCircle className="w-4 h-4" />
          </Link>
          <LocaleSwitcher compact />
          <NotificationBell />
          <ThemeToggle compact />

          {/* User dropdown */}
          <div ref={menuRef} className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-lg hover:bg-[var(--muted)] transition-colors"
              aria-label="User menu"
            >
              <span className="w-7 h-7 rounded-full bg-brand-gradient text-white font-semibold text-[11px] flex items-center justify-center">
                {initials || "U"}
              </span>
              <ChevronDown className="w-3 h-3 text-[var(--muted-fg)] hidden sm:block" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-[var(--border)] flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-brand-gradient text-white font-semibold flex items-center justify-center">
                    {initials || "U"}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm truncate">{user.name || user.email.split("@")[0]}</p>
                    <p className="text-xs text-[var(--muted-fg)] truncate">{user.email}</p>
                  </div>
                </div>
                <div className="px-3 py-2 border-b border-[var(--border)]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-fg)] mb-1">Workspace</p>
                  <p className="text-sm font-semibold truncate">{tenant.name}</p>
                </div>
                <div className="py-1" onClick={() => setMenuOpen(false)}>
                  <Link href="/profile" className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[var(--muted)]">
                    <UserIcon className="w-4 h-4 text-[var(--muted-fg)]" /> Profile
                  </Link>
                  <Link href="/settings" className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[var(--muted)]">
                    <Settings className="w-4 h-4 text-[var(--muted-fg)]" /> Settings
                  </Link>
                  <Link href="/faq" className="flex items-center gap-2.5 px-4 py-2 text-sm hover:bg-[var(--muted)]">
                    <HelpCircle className="w-4 h-4 text-[var(--muted-fg)]" /> Help
                  </Link>
                </div>
                <div className="py-1 border-t border-[var(--border)]">
                  <button
                    onClick={onSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-[var(--danger)] hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
