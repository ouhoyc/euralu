"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import type { TileControls } from "./TileScene";

const TileScene = dynamic(() => import("./TileScene"), {
  ssr: false,
  loading: () => <div className="grid size-full place-items-center text-sm text-zinc">Chargement de la scène 3D…</div>,
});

function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

const DONE = 0.9; // au-delà, on considère la toiture nettoyée

/**
 * « Nettoyez la toiture vous-même » : pan de toiture 3D couvert de mousse,
 * que le visiteur nettoie en passant la souris ou le doigt.
 * Illustration (et non photo de chantier) : la mention est affichée.
 */
export function TileCleaner() {
  const controls = useRef<TileControls | null>(null);
  const [cleaned, setCleaned] = useState(0);
  const narrow = useMediaQuery("(max-width: 767px)");
  const touch = useMediaQuery("(hover: none)");
  const onProgress = useCallback((p: number) => setCleaned(p), []);
  const done = cleaned >= DONE;

  return (
    <section
      aria-label="Démonstration interactive : nettoyer une toiture en tuiles"
      className="relative overflow-hidden bg-gradient-to-b from-[#6fa3dc] via-[#b9d3ea] to-[#e6edf2] py-16 md:py-24"
    >
      <div className="container-page grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="relative z-10 text-graphite">
          <p className="kicker mb-5 text-graphite/70">Traitement de tuiles</p>
          <h2 className="h-display text-5xl md:text-6xl">Rendez à votre toiture sa couleur d’origine.</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-graphite-2">
            {touch
              ? "Balayez la toiture du doigt, de gauche à droite, pour retirer la mousse."
              : "Passez la souris sur la toiture pour retirer la mousse."}
          </p>

          {/* Progression */}
          <div className="mt-8 max-w-sm" aria-live="polite">
            <div className="mb-2 flex justify-between text-sm">
              <span>Toiture nettoyée</span>
              <span className="tabular-nums">{Math.round(cleaned * 100)} %</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-graphite/10">
              <div
                className="h-full origin-left rounded-full bg-rouge transition-transform duration-300"
                style={{ transform: `scaleX(${cleaned})` }}
              />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => controls.current?.cleanAll()}
              className="min-h-11 rounded-full border border-graphite/25 px-5 text-sm transition-colors hover:border-graphite hover:bg-graphite hover:text-white"
            >
              Tout nettoyer
            </button>
            <button
              type="button"
              onClick={() => controls.current?.reset()}
              className="min-h-11 rounded-full px-5 text-sm text-graphite/70 underline-offset-4 hover:underline"
            >
              Recommencer
            </button>
          </div>

          <AnimatePresence>
            {done && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 rounded-2xl bg-graphite p-6 text-white"
              >
                <p className="h-display text-3xl">C’est l’effet d’un démoussage suivi d’un traitement.</p>
                <p className="mt-2 text-sm text-white/70">Inspection et devis gratuits.</p>
                <div className="mt-5">
                  <Button href="/contact#devis">Demander un devis</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="mt-8 text-xs text-graphite/60">
            Illustration 3D. Le résultat réel dépend de l’état et du type de tuiles.
          </p>
        </div>

        <div className="relative -mx-5 h-[62vh] min-h-[380px] md:mx-0 md:h-[70vh]">
          <TileScene controls={controls} onProgress={onProgress} narrow={narrow} />
        </div>
      </div>
    </section>
  );
}
