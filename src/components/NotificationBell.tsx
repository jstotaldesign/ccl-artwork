"use client";

import { Bell } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useFetch } from "@/hooks/useFetch";
import { fmtRelative } from "@/lib/formatters";

interface Notif {
  id: string;
  title: string;
  body: string | null;
  link: string | null;
  readAt: string | null;
  createdAt: string;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { data } = useFetch<{ data: Notif[] }>(open ? "/api/notifications?limit=10" : null);
  const notifs = data?.data ?? [];
  const unread = notifs.filter((n) => !n.readAt).length;

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[var(--muted)] text-[var(--muted-fg)] hover:text-[var(--foreground)] transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--brand)] ring-2 ring-[var(--background)]" />
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-[var(--border)] bg-[var(--background)] shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
            <p className="font-bold text-sm">Notifications</p>
            {unread > 0 && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                {unread} new
              </span>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifs.length === 0 ? (
              <p className="text-center text-sm text-[var(--muted-fg)] py-8 px-4">
                You&apos;re all caught up.
              </p>
            ) : (
              notifs.map((n) => (
                <a
                  key={n.id}
                  href={n.link ?? "#"}
                  className={`block px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--muted)] transition-colors ${
                    !n.readAt ? "bg-[var(--brand-soft)]/30" : ""
                  }`}
                >
                  <p className="text-sm font-semibold truncate">{n.title}</p>
                  {n.body && <p className="text-xs text-[var(--muted-fg)] mt-0.5 line-clamp-2">{n.body}</p>}
                  <p className="text-[10px] text-[var(--muted-fg)] mt-1">{fmtRelative(n.createdAt)}</p>
                </a>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
