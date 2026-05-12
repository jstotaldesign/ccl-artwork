"use client";

import { toast } from "@/lib/toast";

const PROVIDERS = [
  {
    id: "google",
    label: "Google",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.15-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
        <path fill="#FBBC04" d="M5.85 14.1a6.6 6.6 0 0 1 0-4.2V7.07H2.18a11 11 0 0 0 0 9.87l3.67-2.84Z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.2 1.64l3.15-3.15A11 11 0 0 0 2.18 7.07L5.85 9.9C6.71 7.3 9.14 5.38 12 5.38Z" />
      </svg>
    ),
  },
  {
    id: "github",
    label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4 text-[var(--foreground)]" fill="currentColor" aria-hidden>
        <path d="M12 .3a12 12 0 0 0-3.79 23.4c.6.1.82-.26.82-.58v-2.05c-3.34.73-4.04-1.42-4.04-1.42-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .1-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.95 0-1.31.46-2.39 1.24-3.23-.13-.31-.54-1.54.11-3.2 0 0 1-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.3-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.89.12 3.2.77.84 1.24 1.92 1.24 3.23 0 4.63-2.8 5.65-5.48 5.95.43.37.82 1.1.82 2.21v3.28c0 .32.22.7.83.58A12 12 0 0 0 12 .3Z" />
      </svg>
    ),
  },
  {
    id: "line",
    label: "LINE",
    icon: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" aria-hidden>
        <path fill="#06C755" d="M22 10.4C22 5.76 17.51 2 12 2S2 5.76 2 10.4c0 4.16 3.56 7.65 8.36 8.31.33.07.77.22.88.5.1.25.07.65.03.92l-.14.85c-.04.25-.2.99.87.54 1.08-.45 5.8-3.41 7.9-5.84 1.46-1.6 2.16-3.21 2.16-4.88Z" />
      </svg>
    ),
  },
];

interface Props {
  layout?: "row" | "col";
}

export function OAuthRow({ layout = "row" }: Props) {
  function onClick(provider: string) {
    toast.info(`${provider} OAuth not configured yet`);
  }
  return (
    <div className={layout === "col" ? "flex flex-col gap-2" : "grid grid-cols-3 gap-2"}>
      {PROVIDERS.map((p) => (
        <button
          key={p.id}
          type="button"
          onClick={() => onClick(p.label)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--background)] hover:bg-[var(--muted)] text-sm font-medium transition-colors"
        >
          {p.icon}
          {layout === "col" && <span>Continue with {p.label}</span>}
        </button>
      ))}
    </div>
  );
}
