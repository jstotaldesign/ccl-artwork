"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface Props {
  children: React.ReactNode; // the surface that receives right-click
  menu: React.ReactNode;     // the menu items (use MenuItem etc.)
  className?: string;
}

interface Pos {
  x: number;
  y: number;
}

export function ContextMenu({ children, menu, className = "" }: Props) {
  const [pos, setPos] = useState<Pos | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!pos) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setPos(null);
    }
    function onEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setPos(null);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [pos]);

  function onContextMenu(e: React.MouseEvent) {
    e.preventDefault();
    setPos({ x: e.clientX, y: e.clientY });
  }

  return (
    <>
      <div onContextMenu={onContextMenu} className={className}>
        {children}
      </div>
      {mounted && pos &&
        createPortal(
          <div
            ref={ref}
            role="menu"
            className="fixed z-[10100] min-w-[200px] py-1 rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-xl"
            style={{ left: pos.x, top: pos.y }}
            onClick={() => setPos(null)}
          >
            {menu}
          </div>,
          document.body,
        )}
    </>
  );
}
