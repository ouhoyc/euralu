"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { categoryLabels, type GalleryCategory } from "@/lib/metiers";
import type { Realisation } from "@/lib/realisations";

/**
 * Galerie de réalisations : filtres par métier + visionneuse plein écran (lightbox).
 * Les filtres n'apparaissent que pour les métiers qui ont au moins une photo.
 * Clavier : ← / → pour naviguer, Échap pour fermer.
 */
export function Gallery({
  items,
  showFilters = true,
  initialFilter = "tous",
}: {
  items: Realisation[];
  showFilters?: boolean;
  initialFilter?: GalleryCategory | "tous";
}) {
  const [filter, setFilter] = useState<GalleryCategory | "tous">(initialFilter);
  const [index, setIndex] = useState<number | null>(null);

  const categories = useMemo(
    () => (Object.keys(categoryLabels) as GalleryCategory[]).filter((c) => items.some((i) => i.metier === c)),
    [items],
  );
  const visible = useMemo(() => (filter === "tous" ? items : items.filter((i) => i.metier === filter)), [items, filter]);

  return (
    <div>
      {showFilters && categories.length > 1 && (
        <div role="group" aria-label="Filtrer par métier" className="mb-10 flex flex-wrap gap-2">
          {(["tous", ...categories] as const).map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
              className="min-h-11 rounded-full border border-graphite/15 px-5 text-sm text-graphite transition-colors duration-300 hover:border-graphite aria-pressed:border-graphite aria-pressed:bg-graphite aria-pressed:text-white"
            >
              {c === "tous" ? "Tous" : categoryLabels[c]}
              <span className="ml-2 text-xs opacity-60">
                {c === "tous" ? items.length : items.filter((i) => i.metier === c).length}
              </span>
            </button>
          ))}
        </div>
      )}

      <motion.ul layout className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {visible.map((item, i) => (
            <motion.li
              key={item.src}
              layout
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block aspect-[3/4] w-full overflow-hidden rounded-xl bg-graphite/5"
                aria-label={`Agrandir : ${item.alt}`}
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[1200ms] ease-premium group-hover:scale-[1.05]"
                />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-graphite/80 to-transparent p-4 pt-12 text-left text-xs text-white opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  {categoryLabels[item.metier]}
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Lightbox items={visible} index={index} onChange={setIndex} />
    </div>
  );
}

function Lightbox({
  items,
  index,
  onChange,
}: {
  items: Realisation[];
  index: number | null;
  onChange: (i: number | null) => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const current = open ? items[index] : null;

  const go = useCallback(
    (delta: number) => {
      if (index === null) return;
      onChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onChange],
  );

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
      previouslyFocused?.focus();
    };
  }, [open, go, onChange]);

  return (
    <AnimatePresence>
      {current && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Visionneuse de photos"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[70] flex flex-col bg-graphite/95 backdrop-blur-md"
          onClick={() => onChange(null)}
        >
          <div className="flex items-center justify-between p-4 text-sm text-white/70">
            <span className="tabular-nums">
              {index! + 1} / {items.length}
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => onChange(null)}
              aria-label="Fermer"
              className="grid size-11 place-items-center rounded-full text-white hover:bg-white/10"
            >
              <X className="size-6" />
            </button>
          </div>

          <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.src}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 mx-4 md:mx-20"
              >
                <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
              </motion.div>
            </AnimatePresence>
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Photo précédente"
                  className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-graphite/60 text-white hover:bg-white/15 md:left-4"
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Photo suivante"
                  className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-graphite/60 text-white hover:bg-white/15 md:right-4"
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>

          <p className="p-5 text-center text-sm text-white/75" onClick={(e) => e.stopPropagation()}>
            {current.alt}
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
