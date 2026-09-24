"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { stepIndexAt, steps } from "./timeline";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// La 3D n'est chargée que côté navigateur, et seulement sur la page qui l'utilise
const TerraceScene = dynamic(() => import("./TerraceScene"), {
  ssr: false,
  loading: () => (
    <div className="grid size-full place-items-center bg-graphite text-sm text-zinc-clair">Chargement de la scène 3D…</div>
  ),
});

function useMediaQuery(query: string, serverValue = false) {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", onChange);
      return () => mql.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Expérience « la toiture terrasse s'étanche sous vos yeux » :
 * une scène 3D épinglée à l'écran, dont le scroll pilote l'assemblage couche par couche.
 */
export function TerraceExperience() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [stepIndex, setStepIndex] = useState(-1);
  const stepRef = useRef(-1);

  // Le texte suit la progression lissée de la scène 3D (et non le scroll brut) :
  // image et texte restent toujours synchronisés.
  const onProgress = useCallback((p: number) => {
    const i = stepIndexAt(p);
    if (i !== stepRef.current) {
      stepRef.current = i;
      setStepIndex(i);
    }
  }, []);
  const [active, setActive] = useState(true);
  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const narrow = useMediaQuery("(max-width: 767px)");

  useGSAP(
    () => {
      if (reduced) {
        progress.current = 1; // version statique : la toiture terminée
        return;
      }
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.current = self.progress;
        },
        onToggle: (self) => setActive(self.isActive),
      });
      // Retour sur la page (ou rechargement au milieu) : on repart de la position réelle du scroll
      progress.current = trigger.progress;
      setActive(trigger.isActive || trigger.progress === 0);
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  const current = stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex] : null;

  return (
    <section
      ref={sectionRef}
      aria-label="Les étapes de l'étanchéité d'une toiture terrasse"
      className="relative bg-graphite text-white"
      style={{ height: reduced ? "auto" : "760vh" }}
    >
      <div className={reduced ? "relative h-[80dvh]" : "sticky top-0 h-dvh overflow-hidden"}>
        <div className="absolute inset-0">
          <TerraceScene progress={progress} active={active} narrow={narrow} onProgress={onProgress} />
        </div>

        {/* Voiles pour la lisibilité des textes et du menu sur le ciel clair */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-graphite/40 to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 hidden bg-gradient-to-r from-graphite/60 via-graphite/10 to-transparent md:block"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-graphite/85 via-graphite/40 to-transparent md:hidden"
        />

        {!reduced && (
          <>
            {/* Intro */}
            <AnimatePresence>
              {stepIndex === -1 && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="container-page absolute inset-x-0 bottom-32 md:bottom-auto md:top-1/2 md:-translate-y-1/2"
                >
                  <p className="kicker mb-6 text-white/85">Étanchéité de toiture terrasse</p>
                  <h1 className="h-display max-w-3xl text-5xl md:text-7xl xl:text-8xl">
                    Une toiture terrasse, <em className="text-alu">couche après couche.</em>
                  </h1>
                  <p className="mt-8 text-sm text-white/60">Faites défiler pour voir le chantier se faire</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Étape en cours */}
            <div className="container-page pointer-events-none absolute inset-x-0 bottom-32 md:bottom-auto md:top-1/2 md:-translate-y-1/2">
              <AnimatePresence mode="wait">
                {current && (
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="max-w-md [text-shadow:0_2px_24px_rgb(0_0_0/0.5)]"
                  >
                    <p className="kicker mb-5 text-white/70">
                      Étape {String(stepIndex + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}
                    </p>
                    <h2 className="h-display text-5xl md:text-7xl">{current.title}</h2>
                    <p className="mt-5 text-lg leading-relaxed text-white/80">{current.text}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Fin : la toiture terminée */}
            <AnimatePresence>
              {stepIndex === steps.length && (
                <motion.div
                  key="outro"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: EASE }}
                  className="container-page absolute inset-x-0 bottom-32 md:bottom-[14vh]"
                >
                  <h2 className="h-display max-w-3xl text-5xl md:text-7xl">Étanche. Protégée. Finie.</h2>
                  <div className="mt-8">
                    <Button href="/contact#devis">Demander un devis</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Rail de progression des étapes : seule l'étape en cours est nommée */}
            <ol className="absolute bottom-10 right-8 hidden items-end gap-2 lg:flex" aria-hidden>
              {steps.map((s, i) => (
                <li key={s.id} className="relative">
                  <span
                    className={`absolute bottom-3 right-0 whitespace-nowrap text-[11px] tracking-wide transition-opacity duration-500 ${
                      i === stepIndex ? "opacity-90" : "opacity-0"
                    }`}
                  >
                    {s.title}
                  </span>
                  <span
                    className={`block h-0.5 w-10 transition-colors duration-500 ${
                      i === stepIndex ? "bg-rouge-clair" : i < stepIndex ? "bg-white/60" : "bg-white/20"
                    }`}
                  />
                </li>
              ))}
            </ol>
          </>
        )}
      </div>

      {/* Version statique (animations réduites) : toutes les étapes lisibles */}
      {reduced && (
        <div className="container-page py-20">
          <h1 className="h-display text-5xl md:text-7xl">Une toiture terrasse, couche après couche.</h1>
          <ol className="mt-12 grid gap-8 md:grid-cols-2">
            {steps.map((s, i) => (
              <li key={s.id} className="border-t border-white/15 pt-6">
                <p className="kicker text-white/60">Étape {String(i + 1).padStart(2, "0")}</p>
                <h2 className="h-display mt-3 text-3xl">{s.title}</h2>
                <p className="mt-2 text-white/70">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Pour le référencement : le texte de toutes les étapes existe toujours dans la page */}
      {!reduced && (
        <ol className="sr-only">
          {steps.map((s) => (
            <li key={s.id}>
              {s.title} : {s.text}
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
