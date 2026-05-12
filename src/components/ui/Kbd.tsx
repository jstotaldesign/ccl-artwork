interface Props {
  children: React.ReactNode;
  className?: string;
}

export function Kbd({ children, className = "" }: Props) {
  return (
    <kbd
      className={`inline-flex items-center justify-center min-w-[1.5rem] px-1.5 h-5 rounded border border-[var(--border)] bg-[var(--card)] text-[10px] font-mono font-semibold text-[var(--muted-fg)] shadow-sm ${className}`}
    >
      {children}
    </kbd>
  );
}
