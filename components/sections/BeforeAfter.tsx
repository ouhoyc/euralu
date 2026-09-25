"use client";

import Image from "next/image";
import { animate, useInView, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Img = { src: string; alt: string };

/**
 * Comparateur avant / après : les deux images sont superposées, une poignée
 * verticale se fait glisser (souris, doigt ou flèches du clavier) pour révéler l'une ou l'autre.
 * Un <input type="range"> transparent recouvre l'image : accessibilité et tactile natifs.
 */
export function BeforeAfter({
  before,
  after,
  width,
  height,
  caption,
  labels = { before: "Avant", after: "Après" },
}: {
  before: Img;
  after: Img;
  width: number;
  height: number;
  caption?: string;
  labels?: { before: string; after: string };
}) {
  const [pos, setPos] = useState(50); // part de l'image « avant » visible, en %
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -25% 0px" });
  const reduce = useReducedMotion();
  const touched = useRef(false);

  // Petit mouvement d'invitation à l'arrivée à l'écran (si le visiteur n'a pas déjà touché le curseur)
  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(50, [72, 30, 50], {
      duration: 2.2,
      ease: "easeInOut",
      onUpdate: (v) => {
        if (!touched.current) setPos(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce]);

  return (
    <figure>
      <div
        ref={ref}
        className="relative select-none overflow-hidden rounded-2xl bg-graphite/5"
        style={{ aspectRatio: `${width} / ${height}` }}
      >
        {/* Après (dessous) */}
        <Image src={after.src} alt={after.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        {/* Avant (dessus), découpé selon la position du curseur */}
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Image src={before.src} alt={before.alt} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>

        {/* Étiquettes */}
        <span className="kicker pointer-events-none absolute left-4 top-4 rounded-full bg-graphite/70 px-3 py-1.5 text-white backdrop-blur">
          {labels.before}
        </span>
        <span className="kicker pointer-events-none absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1.5 text-graphite backdrop-blur">
          {labels.after}
        </span>

        {/* Ligne et poignée */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgb(0_0_0/0.35)]"
          style={{ left: `${pos}%` }}
        >
          <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-graphite shadow-lg">
            <span className="flex">
              <ChevronLeft className="size-4" />
              <ChevronRight className="size-4" />
            </span>
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => {
            touched.current = true;
            setPos(Number(e.target.value));
          }}
          aria-label={`Comparer ${labels.before.toLowerCase()} et ${labels.after.toLowerCase()}`}
          className="absolute inset-0 size-full cursor-ew-resize appearance-none opacity-0"
        />
      </div>
      {caption && <figcaption className="mt-3 text-xs text-zinc">{caption}</figcaption>}
    </figure>
  );
}
