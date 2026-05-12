"use client";

import { useState } from "react";

type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  name?: string | null;
  src?: string | null;
  size?: Size;
  status?: "online" | "offline" | "busy" | "away";
  className?: string;
}

const SIZES: Record<Size, { box: string; text: string; dot: string }> = {
  xs: { box: "w-6 h-6 text-[10px]", text: "text-[10px]", dot: "w-1.5 h-1.5" },
  sm: { box: "w-8 h-8 text-xs", text: "text-xs", dot: "w-2 h-2" },
  md: { box: "w-10 h-10 text-sm", text: "text-sm", dot: "w-2.5 h-2.5" },
  lg: { box: "w-14 h-14 text-base", text: "text-base", dot: "w-3 h-3" },
  xl: { box: "w-20 h-20 text-lg", text: "text-lg", dot: "w-3.5 h-3.5" },
};

const STATUS_COLORS = {
  online: "bg-[var(--success)]",
  offline: "bg-[var(--muted-fg)]",
  busy: "bg-[var(--danger)]",
  away: "bg-[var(--warning)]",
};

// Stable hash → palette index, so the same name always gets the same gradient.
const GRADIENTS = [
  "from-orange-400 to-rose-500",
  "from-blue-400 to-cyan-500",
  "from-violet-400 to-purple-500",
  "from-pink-400 to-rose-500",
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-indigo-400 to-blue-500",
  "from-fuchsia-400 to-pink-500",
];

function hashName(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h << 5) - h + s.charCodeAt(i);
  return Math.abs(h);
}

function initials(name: string | null | undefined): string {
  if (!name) return "?";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

export function Avatar({ name, src, size = "md", status, className = "" }: AvatarProps) {
  const [errored, setErrored] = useState(false);
  const s = SIZES[size];
  const showImg = src && !errored;
  const grad = GRADIENTS[hashName(name ?? "?") % GRADIENTS.length];

  return (
    <span className={`relative inline-flex ${className}`}>
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name ?? ""}
          onError={() => setErrored(true)}
          className={`${s.box} rounded-full object-cover ring-2 ring-[var(--background)]`}
        />
      ) : (
        <span
          className={`${s.box} rounded-full bg-gradient-to-br ${grad} text-white font-semibold flex items-center justify-center select-none ring-2 ring-[var(--background)]`}
          aria-label={name ?? "avatar"}
        >
          {initials(name)}
        </span>
      )}
      {status && (
        <span
          className={`absolute bottom-0 right-0 ${s.dot} rounded-full ${STATUS_COLORS[status]} ring-2 ring-[var(--background)]`}
          aria-label={`status: ${status}`}
        />
      )}
    </span>
  );
}

interface AvatarGroupProps {
  users: { name: string; src?: string | null }[];
  size?: Size;
  max?: number;
  className?: string;
}

export function AvatarGroup({ users, size = "sm", max = 4, className = "" }: AvatarGroupProps) {
  const shown = users.slice(0, max);
  const overflow = Math.max(0, users.length - max);
  const s = SIZES[size];
  return (
    <div className={`flex -space-x-2 ${className}`}>
      {shown.map((u, i) => (
        <Avatar key={i} name={u.name} src={u.src} size={size} />
      ))}
      {overflow > 0 && (
        <span
          className={`${s.box} rounded-full bg-[var(--muted)] text-[var(--muted-fg)] font-semibold flex items-center justify-center ring-2 ring-[var(--background)]`}
        >
          +{overflow}
        </span>
      )}
    </div>
  );
}
