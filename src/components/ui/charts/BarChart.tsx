"use client";

interface Bar {
  label: string;
  value: number;
  color?: string;
}

interface Props {
  data: Bar[];
  height?: number;
  className?: string;
  showValue?: boolean;
}

const DEFAULT_COLOR = "var(--brand)";

export function BarChart({ data, height = 220, className = "", showValue = true }: Props) {
  const w = 600;
  const h = height;
  const padX = 24;
  const padTop = 20;
  const padBottom = 28;
  const innerW = w - padX * 2;
  const innerH = h - padTop - padBottom;
  const max = Math.max(...data.map((d) => d.value), 1);

  const gap = 12;
  const barW = (innerW - gap * (data.length - 1)) / data.length;

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        {[0.25, 0.5, 0.75].map((p) => (
          <line
            key={p}
            x1={padX}
            x2={w - padX}
            y1={padTop + innerH * p}
            y2={padTop + innerH * p}
            stroke="var(--border)"
            strokeDasharray="3 3"
            strokeWidth="1"
          />
        ))}
        {data.map((d, i) => {
          const x = padX + i * (barW + gap);
          const barH = (d.value / max) * innerH;
          const y = padTop + innerH - barH;
          const color = d.color ?? DEFAULT_COLOR;
          return (
            <g key={i}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={4}
                fill={color}
                opacity={0.85}
              />
              {showValue && barH > 14 && (
                <text
                  x={x + barW / 2}
                  y={y + 14}
                  textAnchor="middle"
                  className="fill-white"
                  style={{ fontSize: 10, fontWeight: 600 }}
                >
                  {d.value}
                </text>
              )}
              <text
                x={x + barW / 2}
                y={h - 8}
                textAnchor="middle"
                className="fill-[var(--muted-fg)]"
                style={{ fontSize: 10 }}
              >
                {d.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
