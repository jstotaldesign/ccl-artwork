/**
 * NextPolyglot — Shared UI primitives.
 * Buyers extend; do not refactor unless you understand the design system.
 *
 * Tokens:
 *   card     : bg-white rounded-2xl border border-[var(--border)] shadow-sm
 *   primary  : bg-[var(--brand)] text-[var(--brand-fg)]
 *   radius   : rounded-xl (interactive) / rounded-2xl (containers)
 */

"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Loader2, X, AlertTriangle, CheckCircle2, Info, AlertCircle } from "lucide-react";
import {
  _subscribe,
  _dismiss,
  _subscribeDialog,
  _closeDialog,
  type ToastItem,
  type AlertDialogItem,
} from "@/lib/toast";
import { Z_CLASS } from "@/lib/z-index";

// ============================================================
// Page Shell
// ============================================================

export function Page({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`space-y-6 ${className}`}>{children}</div>;
}

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-[var(--muted-fg)] mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2 flex-wrap">{children}</div>}
    </div>
  );
}

export function SectionHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-base font-bold">{title}</h2>
      {children}
    </div>
  );
}

// ============================================================
// Card
// ============================================================

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  padding?: "none" | "sm" | "md" | "lg";
}

export function Card({ children, className = "", onClick, padding = "md" }: CardProps) {
  const pad = { none: "", sm: "p-4", md: "p-5", lg: "p-6" }[padding];
  const base = `bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-sm ${pad} ${className}`;
  if (onClick) {
    return (
      <div role="button" onClick={onClick} className={`${base} cursor-pointer hover:shadow-md transition-all`}>
        {children}
      </div>
    );
  }
  return <div className={base}>{children}</div>;
}

// ============================================================
// Button
// ============================================================

type BtnVariant = "primary" | "ghost" | "outline" | "danger" | "success" | "link";
type Size = "sm" | "md" | "lg";

const BTN_VARIANTS: Record<BtnVariant, string> = {
  primary: "bg-[var(--brand)] hover:bg-[var(--brand-hover)] text-[var(--brand-fg)] shadow-sm",
  ghost: "hover:bg-[var(--muted)] text-[var(--foreground)]",
  outline: "border border-[var(--border)] hover:bg-[var(--muted)] text-[var(--foreground)]",
  danger: "bg-[var(--danger)] hover:opacity-90 text-white shadow-sm",
  success: "bg-[var(--success)] hover:opacity-90 text-white shadow-sm",
  link: "text-[var(--brand)] hover:underline px-0 py-0",
};

const BTN_SIZES: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

interface BtnProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: BtnVariant;
  size?: Size;
  icon?: React.ReactNode;
  loading?: boolean;
  href?: string;
}

export function Btn({
  variant = "primary",
  size = "md",
  icon,
  loading,
  children,
  className = "",
  disabled,
  href,
  ...rest
}: BtnProps) {
  const classes = `inline-flex items-center justify-center gap-1.5 font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ${BTN_VARIANTS[variant]} ${variant !== "link" ? BTN_SIZES[size] : ""} ${className}`;
  const inner = (
    <>
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : icon}
      {children}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return (
    <button {...rest} disabled={disabled || loading} className={classes}>
      {inner}
    </button>
  );
}

// ============================================================
// Badge
// ============================================================

type BadgeTone = "default" | "success" | "warning" | "danger" | "info" | "brand";

const BADGE_TONES: Record<BadgeTone, string> = {
  default: "bg-[var(--muted)] text-[var(--muted-fg)]",
  success: "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
  warning: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  info: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  brand: "bg-[var(--brand-soft)] text-[var(--brand)]",
};

export function Badge({ tone = "default", children, className = "" }: { tone?: BadgeTone; children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${BADGE_TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}

// ============================================================
// Field
// ============================================================

interface FieldProps {
  label: React.ReactNode;
  hint?: string;
  error?: string;
  required?: boolean;
  trailing?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Field({ label, hint, error, required, trailing, children, className = "" }: FieldProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium">
          {label}
          {required && <span className="text-[var(--danger)] ml-0.5">*</span>}
        </label>
        {trailing}
      </div>
      {children}
      {error ? (
        <p className="text-xs text-[var(--danger)]">{error}</p>
      ) : hint ? (
        <p className="text-xs text-[var(--muted-fg)]">{hint}</p>
      ) : null}
    </div>
  );
}

// ============================================================
// Input
// ============================================================

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = "", ...rest }, ref) {
    return (
      <input
        ref={ref}
        {...rest}
        className={`w-full px-3 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--card)] outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all ${className}`}
      />
    );
  },
);

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className = "", ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        {...rest}
        className={`w-full px-3 py-2 text-sm rounded-xl border border-[var(--border)] bg-[var(--card)] outline-none focus:ring-2 focus:ring-[var(--ring)] focus:border-transparent transition-all min-h-[80px] ${className}`}
      />
    );
  },
);

// ============================================================
// Empty State
// ============================================================

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="w-12 h-12 rounded-full bg-[var(--muted)] flex items-center justify-center mb-4 text-[var(--muted-fg)]">{icon}</div>}
      <h3 className="text-base font-semibold">{title}</h3>
      {description && <p className="text-sm text-[var(--muted-fg)] mt-1 max-w-md">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ============================================================
// Spinner
// ============================================================

export function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const cls = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" }[size];
  return <Loader2 className={`${cls} animate-spin text-[var(--brand)]`} />;
}

// ============================================================
// Modal
// ============================================================

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  priority?: boolean;
}

const MODAL_SIZES = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl" };

export function Modal({ open, onClose, title, children, size = "md", priority }: ModalProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;
  const zClass = priority ? Z_CLASS.priorityModal : Z_CLASS.modal;

  return createPortal(
    <div className={`fixed inset-0 ${zClass} flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm`} onClick={onClose}>
      <div
        className={`bg-[var(--card)] rounded-2xl shadow-2xl w-full ${MODAL_SIZES[size]} max-h-[90vh] flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h3 className="font-bold">{title}</h3>
            <button onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--muted)]" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}

// ============================================================
// ToastHost — mount once in root layout
// ============================================================

const TOAST_ICONS = {
  success: <CheckCircle2 className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
};

const TOAST_TONES: Record<ToastItem["kind"], string> = {
  success: "bg-green-50 border-green-200 text-green-800 dark:bg-green-950/50 dark:border-green-900 dark:text-green-300",
  error: "bg-red-50 border-red-200 text-red-800 dark:bg-red-950/50 dark:border-red-900 dark:text-red-300",
  info: "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/50 dark:border-blue-900 dark:text-blue-300",
  warning: "bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/50 dark:border-amber-900 dark:text-amber-300",
};

export function ToastHost() {
  const [items, setItems] = useState<ToastItem[]>([]);
  const [dialog, setDialog] = useState<AlertDialogItem | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const unsubT = _subscribe(setItems);
    const unsubD = _subscribeDialog(setDialog);
    return () => {
      unsubT();
      unsubD();
    };
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <div className={`fixed top-4 right-4 ${Z_CLASS.toast} flex flex-col gap-2 max-w-sm pointer-events-none`}>
        {items.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-2 px-4 py-3 rounded-xl border shadow-lg ${TOAST_TONES[t.kind]}`}
          >
            {TOAST_ICONS[t.kind]}
            <p className="text-sm font-medium flex-1">{t.message}</p>
            <button onClick={() => _dismiss(t.id)} className="opacity-60 hover:opacity-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {dialog && (
        <div className={`fixed inset-0 ${Z_CLASS.priorityModal} flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm`}>
          <div className="bg-[var(--card)] rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-start gap-3">
              {dialog.variant === "danger" || dialog.variant === "warning" ? (
                <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
              ) : dialog.variant === "success" ? (
                <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center shrink-0">
                  <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold">{dialog.title}</h3>
                {dialog.message && <p className="text-sm text-[var(--muted-fg)] mt-1">{dialog.message}</p>}
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              {dialog.cancelLabel !== "" && (
                <Btn variant="ghost" onClick={() => _closeDialog(false)}>
                  {dialog.cancelLabel ?? "Cancel"}
                </Btn>
              )}
              <Btn
                variant={dialog.variant === "danger" ? "danger" : "primary"}
                onClick={() => _closeDialog(true)}
              >
                {dialog.confirmLabel ?? "Confirm"}
              </Btn>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body,
  );
}
