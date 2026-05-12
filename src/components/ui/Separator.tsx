interface Props {
  orientation?: "horizontal" | "vertical";
  label?: string;
  className?: string;
}

export function Separator({ orientation = "horizontal", label, className = "" }: Props) {
  if (label && orientation === "horizontal") {
    return (
      <div className={`flex items-center gap-3 my-4 ${className}`}>
        <span className="flex-1 h-px bg-[var(--border)]" />
        <span className="text-xs font-medium text-[var(--muted-fg)] uppercase tracking-wider">{label}</span>
        <span className="flex-1 h-px bg-[var(--border)]" />
      </div>
    );
  }
  if (orientation === "vertical") return <span className={`inline-block w-px self-stretch bg-[var(--border)] ${className}`} />;
  return <hr className={`border-0 h-px bg-[var(--border)] my-4 ${className}`} />;
}
