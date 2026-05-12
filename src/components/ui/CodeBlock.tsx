"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export function CodeBlock({ code, language, filename, className = "" }: Props) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className={`rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border)] bg-[var(--muted)]/50">
        <div className="flex items-center gap-2 min-w-0">
          {filename ? (
            <span className="text-xs font-mono text-[var(--muted-fg)] truncate">{filename}</span>
          ) : language ? (
            <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted-fg)]">{language}</span>
          ) : null}
        </div>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1 text-xs text-[var(--muted-fg)] hover:text-[var(--foreground)] px-2 py-1 rounded hover:bg-[var(--muted)]"
          aria-label="Copy"
        >
          {copied ? <Check className="w-3 h-3 text-[var(--success)]" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="text-xs font-mono p-4 overflow-x-auto leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}
