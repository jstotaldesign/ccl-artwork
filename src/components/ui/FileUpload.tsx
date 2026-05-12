"use client";

import { useRef, useState, DragEvent } from "react";
import { UploadCloud, X, File as FileIcon, Image as ImageIcon, FileText } from "lucide-react";

interface Props {
  value?: File[];
  onChange: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // bytes
  maxFiles?: number;
  className?: string;
  hint?: string;
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function pickIcon(file: File) {
  if (file.type.startsWith("image/")) return ImageIcon;
  if (file.type.startsWith("text/")) return FileText;
  return FileIcon;
}

export function FileUpload({ value, onChange, accept, multiple = false, maxSize, maxFiles = 8, className = "", hint }: Props) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const files = value ?? [];

  function add(newFiles: FileList | File[]) {
    setError(null);
    const arr = Array.from(newFiles);
    if (maxSize) {
      const tooBig = arr.find((f) => f.size > maxSize);
      if (tooBig) {
        setError(`"${tooBig.name}" exceeds max size of ${fmtSize(maxSize)}`);
        return;
      }
    }
    let next = multiple ? [...files, ...arr] : arr.slice(0, 1);
    if (multiple && maxFiles && next.length > maxFiles) {
      next = next.slice(0, maxFiles);
    }
    onChange(next);
  }

  function remove(idx: number) {
    onChange(files.filter((_, i) => i !== idx));
  }

  function onDrop(e: DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) add(e.dataTransfer.files);
  }

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`w-full flex flex-col items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed transition-all ${
          dragging
            ? "border-[var(--brand)] bg-[var(--brand-soft)]"
            : "border-[var(--border)] bg-[var(--muted)]/30 hover:bg-[var(--muted)]/60"
        }`}
      >
        <UploadCloud className="w-7 h-7 text-[var(--muted-fg)]" />
        <p className="text-sm font-semibold">Drop {multiple ? "files" : "a file"} or click to upload</p>
        {hint && <p className="text-xs text-[var(--muted-fg)]">{hint}</p>}
        {maxSize && <p className="text-[10px] text-[var(--muted-fg)]">Max {fmtSize(maxSize)} each</p>}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(e) => e.target.files && add(e.target.files)}
      />

      {error && <p className="text-xs text-[var(--danger)] mt-2">{error}</p>}

      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((f, i) => {
            const Icon = pickIcon(f);
            return (
              <li
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)]"
              >
                <Icon className="w-4 h-4 text-[var(--muted-fg)] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{f.name}</p>
                  <p className="text-xs text-[var(--muted-fg)]">{fmtSize(f.size)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(i)}
                  className="p-1 rounded hover:bg-[var(--muted)] text-[var(--muted-fg)] hover:text-[var(--danger)]"
                  aria-label="Remove"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
