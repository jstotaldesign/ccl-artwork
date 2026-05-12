interface Props extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "rect" | "circle" | "text";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({
  variant = "rect",
  width,
  height,
  lines = 1,
  className = "",
  style,
  ...rest
}: Props) {
  const base = "animate-pulse bg-[var(--muted)]";
  const shape =
    variant === "circle" ? "rounded-full" : variant === "text" ? "rounded h-4" : "rounded-md";

  if (variant === "text" && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`${base} ${shape} ${className}`}
            style={{ width: i === lines - 1 ? "70%" : "100%" }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${base} ${shape} ${className}`}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}
