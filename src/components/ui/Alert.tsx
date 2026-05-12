"use client";

import { useState } from "react";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

type Tone = "info" | "success" | "warning" | "danger";

interface Props {
  title?: string;
  children?: React.ReactNode;
  tone?: Tone;
  dismissable?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const STYLES: Record<Tone, { wrap: string; icon: React.ElementType; iconColor: string }> = {
  info: {
    wrap: "bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-900/60 dark:text-blue-200",
    icon: Info,
    iconColor: "text-blue-500",
  },
  success: {
    wrap: "bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-900/60 dark:text-green-200",
    icon: CheckCircle2,
    iconColor: "text-green-500",
  },
  warning: {
    wrap: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-900/60 dark:text-amber-200",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
  },
  danger: {
    wrap: "bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-900/60 dark:text-red-200",
    icon: AlertCircle,
    iconColor: "text-red-500",
  },
};

export function Alert({ title, children, tone = "info", dismissable, className = "", icon }: Props) {
  const [hidden, setHidden] = useState(false);
  if (hidden) return null;
  const style = STYLES[tone];
  const Icon = style.icon;
  return (
    <div className={`relative flex items-start gap-3 p-4 rounded-xl border ${style.wrap} ${className}`}>
      <span className={`shrink-0 mt-0.5 ${style.iconColor}`}>{icon ?? <Icon className="w-5 h-5" />}</span>
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm leading-snug">{title}</p>}
        {children && <div className={`text-sm leading-relaxed ${title ? "mt-1 opacity-90" : ""}`}>{children}</div>}
      </div>
      {dismissable && (
        <button
          onClick={() => setHidden(true)}
          className="shrink-0 p-1 -mr-1 -mt-1 rounded-md opacity-60 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
