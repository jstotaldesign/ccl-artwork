"use client";

import { useState } from "react";
import { Lightbox } from "./Lightbox";

interface Props {
  images: { src: string; alt?: string }[];
  columns?: 2 | 3 | 4 | 5;
  className?: string;
}

const COLS = {
  2: "grid-cols-2",
  3: "grid-cols-2 sm:grid-cols-3",
  4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
};

export function ImageGallery({ images, columns = 4, className = "" }: Props) {
  const [open, setOpen] = useState(false);
  const [start, setStart] = useState(0);

  return (
    <>
      <div className={`grid gap-2 ${COLS[columns]} ${className}`}>
        {images.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => {
              setStart(i);
              setOpen(true);
            }}
            className="group relative aspect-square overflow-hidden rounded-lg bg-[var(--muted)]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.src}
              alt={img.alt ?? ""}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <span className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
          </button>
        ))}
      </div>
      <Lightbox open={open} onClose={() => setOpen(false)} images={images} startIndex={start} />
    </>
  );
}
