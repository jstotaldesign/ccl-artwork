import { X } from "lucide-react";

interface Props {
  children: React.ReactNode;
  onRemove?: () => void;
  tone?: "default" | "brand" | "success" | "warning" | "danger" | "info";
  icon?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}

const TONES = {
  default: "bg-[var(--muted)] text-[var(--foreground)]",
  brand: "bg-[var(--brand-soft)] text-[var(--brand)]",
  success: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
};

const SIZES = {
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-2 py-1",
};

export function Chip({ children, onRemove, tone = "default", icon, size = "md", className = "" }: Props) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md font-medium ${TONES[tone]} ${SIZES[size]} ${className}`}
    >
      {icon}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:bg-black/10 dark:hover:bg-white/15 rounded p-0.5 -mr-0.5"
          aria-label="Remove"
        >
          <X className={size === "sm" ? "w-2.5 h-2.5" : "w-3 h-3"} />
        </button>
      )}
    </span>
  );
}
