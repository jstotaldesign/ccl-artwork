"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import { Checkbox } from "./Checkbox";

export interface Column<T> {
  key: keyof T & string;
  header: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "right" | "center";
  cell?: (row: T) => React.ReactNode;
}

interface Props<T> {
  data: T[];
  columns: Column<T>[];
  selectable?: boolean;
  selected?: Set<string>;
  onSelectChange?: (selected: Set<string>) => void;
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
  empty?: React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  selectable,
  selected,
  onSelectChange,
  rowKey,
  onRowClick,
  empty = "No data.",
  className = "",
}: Props<T>) {
  const [sort, setSort] = useState<{ key: keyof T & string; dir: "asc" | "desc" } | null>(null);

  const sorted = useMemo(() => {
    if (!sort) return data;
    const { key, dir } = sort;
    return [...data].sort((a, b) => {
      const av = a[key];
      const bv = b[key];
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av === bv) return 0;
      const cmp = av < bv ? -1 : 1;
      return dir === "asc" ? cmp : -cmp;
    });
  }, [data, sort]);

  function toggleSort(key: keyof T & string) {
    setSort((s) =>
      !s || s.key !== key ? { key, dir: "asc" } : s.dir === "asc" ? { key, dir: "desc" } : null,
    );
  }

  const sel = selected ?? new Set<string>();
  const allKeys = sorted.map(rowKey);
  const allSelected = allKeys.length > 0 && allKeys.every((k) => sel.has(k));
  const someSelected = !allSelected && allKeys.some((k) => sel.has(k));

  function toggleAll() {
    if (!onSelectChange) return;
    if (allSelected) onSelectChange(new Set());
    else onSelectChange(new Set(allKeys));
  }
  function toggleOne(k: string) {
    if (!onSelectChange) return;
    const next = new Set(sel);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    onSelectChange(next);
  }

  return (
    <div className={`overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--card)] ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-[var(--muted)]/50 border-b border-[var(--border)]">
            <tr>
              {selectable && (
                <th className="w-10 px-3 py-3">
                  <Checkbox checked={allSelected} indeterminate={someSelected} onChange={toggleAll} />
                </th>
              )}
              {columns.map((c) => {
                const isSorted = sort?.key === c.key;
                const Ico = !isSorted ? ChevronsUpDown : sort?.dir === "asc" ? ChevronUp : ChevronDown;
                return (
                  <th
                    key={c.key}
                    style={{ width: c.width, textAlign: c.align ?? "left" }}
                    className="px-3 py-3 text-xs font-bold text-[var(--muted-fg)] uppercase tracking-wider"
                  >
                    {c.sortable ? (
                      <button
                        onClick={() => toggleSort(c.key)}
                        className="inline-flex items-center gap-1 hover:text-[var(--foreground)] transition-colors"
                      >
                        {c.header}
                        <Ico className="w-3 h-3" />
                      </button>
                    ) : (
                      c.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-3 py-10 text-center text-[var(--muted-fg)]">
                  {empty}
                </td>
              </tr>
            ) : (
              sorted.map((row) => {
                const k = rowKey(row);
                const isSelected = sel.has(k);
                return (
                  <tr
                    key={k}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    className={`${onRowClick ? "cursor-pointer hover:bg-[var(--muted)]/40" : ""} ${
                      isSelected ? "bg-[var(--brand-soft)]/30" : ""
                    } transition-colors`}
                  >
                    {selectable && (
                      <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                        <Checkbox checked={isSelected} onChange={() => toggleOne(k)} />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td key={c.key} style={{ textAlign: c.align ?? "left" }} className="px-3 py-3">
                        {c.cell ? c.cell(row) : String(row[c.key] ?? "")}
                      </td>
                    ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
