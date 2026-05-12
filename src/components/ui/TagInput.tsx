"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";

interface Props {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  max?: number;
  suggestions?: string[];
  className?: string;
  disabled?: boolean;
}

export function TagInput({ value, onChange, placeholder = "Add a tag…", max, suggestions, className = "", disabled }: Props) {
  const [input, setInput] = useState("");

  function add(tag: string) {
    const t = tag.trim();
    if (!t) return;
    if (value.includes(t)) return;
    if (max && value.length >= max) return;
    onChange([...value, t]);
    setInput("");
  }

  function remove(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add(input);
    } else if (e.key === "Backspace" && !input && value.length) {
      remove(value[value.length - 1]);
    }
  }

  const remaining = suggestions?.filter((s) => !value.includes(s) && s.toLowerCase().includes(input.toLowerCase())).slice(0, 6);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`flex flex-wrap gap-1.5 items-center w-full px-2 py-1.5 min-h-[42px] rounded-xl border border-[var(--border)] bg-[var(--background)] focus-within:ring-2 focus-within:ring-[var(--ring)] ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 pl-2 pr-1 py-0.5 rounded-md bg-[var(--brand-soft)] text-[var(--brand)] text-xs font-medium"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
              aria-label={`Remove ${tag}`}
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder={value.length === 0 ? placeholder : ""}
          disabled={disabled || (max ? value.length >= max : false)}
          className="flex-1 min-w-[8ch] bg-transparent outline-none text-sm py-1"
        />
      </div>

      {remaining && remaining.length > 0 && input && (
        <div className="absolute z-40 left-0 right-0 mt-1 py-1 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg max-h-44 overflow-y-auto">
          {remaining.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="w-full px-3 py-1.5 text-sm text-left hover:bg-[var(--muted)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {max && (
        <p className="text-[10px] text-[var(--muted-fg)] mt-1 text-right">
          {value.length} / {max}
        </p>
      )}
    </div>
  );
}
