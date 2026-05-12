"use client";

import { useId } from "react";

export interface Series {
  name: string;
  color?: string;
  data: number[];
}

interface Props {
  series: Series[];
  labels?: string[];
  height?: number;
  className?: string;
  showGrid?: boolean;
  showDots?: boolean;
  area?: boolean;
}

const PALETTE = ["var(--brand)", "#3b82f6", "#22c55e", "#8b5cf6", "#ec4899", "#f59e0b"];

export function LineChart({
  series,
  labels,
  height = 220,
  className = "",
  showGrid = true,
  showDots = true,
  area = true,
}: Props) {
  const uid = useId();
  const w = 600;
  const h = height;
  const padX = 24;
  const padTop = 12;
  const padBottom = labels ? 24 : 12;
  const innerW = w - padX * 2;
  const innerH = h - padTop - padBottom;

  const allValues = series.flatMap((s) => s.data);
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const range = max - min || 1;
  const len = Math.max(...series.map((s) => s.data.length), 2);
  const step = innerW / (len - 1);

  function norm(v: number): number {
    return padTop + innerH - ((v - min) / range) * innerH;
  }

  return (
    <div className={className}>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
        <defs>
          {series.map((s, i) => {
            const color = s.color ?? PALETTE[i % PALETTE.length];
            return (
              <linearGradient key={i} id={`${uid}-${i}`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            );
          })}
        </defs>

        {showGrid &&
          [0.25, 0.5, 0.75].map((p) => (
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

        {series.map((s, i) => {
          const color = s.color ?? PALETTE[i % PALETTE.length];
          const linePath = s.data
            .map((v, j) => `${j === 0 ? "M" : "L"}${padX + j * step},${norm(v)}`)
            .join(" ");
          const areaPath = `${linePath} L${padX + (s.data.length - 1) * step},${padTop + innerH} L${padX},${padTop + innerH} Z`;
          return (
            <g key={i}>
              {area && <path d={areaPath} fill={`url(#${uid}-${i})`} />}
              <path
                d={linePath}
                stroke={color}
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {showDots &&
                s.data.map((v, j) => (
                  <circle key={j} cx={padX + j * step} cy={norm(v)} r={3} fill={color} />
                ))}
            </g>
          );
        })}

        {labels && (
          <g>
            {labels.map((l, i) => (
              <text
                key={i}
                x={padX + i * step}
                y={h - 4}
                textAnchor="middle"
                className="fill-[var(--muted-fg)]"
                style={{ fontSize: 10 }}
              >
                {l}
              </text>
            ))}
          </g>
        )}
      </svg>
      {series.length > 1 && (
        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {series.map((s, i) => (
            <span key={s.name} className="inline-flex items-center gap-1.5 text-xs text-[var(--muted-fg)]">
              <span
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: s.color ?? PALETTE[i % PALETTE.length] }}
              />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
