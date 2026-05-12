"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Z_CLASS } from "@/lib/z-index";

type Side = "right" | "left" | "top" | "bottom";

interface Props {
  open: boolean;
  onClose: () => void;
  side?: Side;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES = {
  sm: { right: "max-w-sm", left: "max-w-sm", top: "max-h-72", bottom: "max-h-72" },
  md: { right: "max-w-md", left: "max-w-md", top: "max-h-96", bottom: "max-h-96" },
  lg: { right: "max-w-lg", left: "max-w-lg", top: "max-h-[60vh]", bottom: "max-h-[60vh]" },
  xl: { right: "max-w-2xl", left: "max-w-2xl", top: "max-h-[80vh]", bottom: "max-h-[80vh]" },
};

const POSITION: Record<Side, string> = {
  right: "top-0 right-0 h-full w-full",
  left: "top-0 left-0 h-full w-full",
  top: "top-0 left-0 right-0 w-full",
  bottom: "bottom-0 left-0 right-0 w-full",
};

const SLIDE_FROM: Record<Side, string> = {
  right: "translate-x-full",
  left: "-translate-x-full",
  top: "-translate-y-full",
  bottom: "translate-y-full",
};

export function Drawer({ open, onClose, side = "right", title, children, size = "md", className = "" }: Props) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className={`fixed inset-0 ${Z_CLASS.modal}`}>
      <div
        className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute ${POSITION[side]} ${SIZES[size][side]} bg-[var(--card)] shadow-2xl flex flex-col transition-transform duration-300 ${
          visible ? "translate-x-0 translate-y-0" : SLIDE_FROM[side]
        } ${className}`}
      >
        {title && (
          <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
            <h3 className="font-bold">{title}</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--muted)]"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
