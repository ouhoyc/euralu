"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import dynamic from "next/dynamic";
import { AnimatePresence, m } from "motion/react";
import { useCallback, useRef, useState, useSyncExternalStore } from "react";
import { stepIndexAt, steps } from "@/components/three/terrace/timeline";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TerraceScene = dynamic(() => import("@/components/three/terrace/TerraceScene"), {
  ssr: false,
  loading: () => <div className="size-full bg-[#f5f5f7]" />,
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

const EASE = [0.22, 1, 0.36, 1] as const;

/** Textes affichés : intro, une étape par couche, puis la vue éclatée. */
function copyFor(index: number) {
  if (index < 0) return { eyebrow: "Toiture terrasse", title: "Couche après couche.", text: "Faites défiler : elle se construit sous vos yeux." };
  if (index >= steps.length)
    return {
      eyebrow: "Vue éclatée",
      title: "Cinq couches. Une étanchéité.",
      text: "Pare-vapeur, isolant, membrane et relevés, gravillons, couvertines : chacune a son rôle.",
    };
  const s = steps[index];
  return { eyebrow: `Étape ${index + 1} sur ${steps.length}`, title: `${s.title}.`, text: s.text };
}

/**
 * Animation « style page produit » (labo) : la maison sur fond clair, un grand titre par étape,
 * des points de progression, et une vue éclatée des couches pour finir.
 */
export function TerraceApple() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [index, setIndex] = useState(-1);
  const indexRef = useRef(-1);
  const [active, setActive] = useState(true);
  const narrow = useMediaQuery("(max-width: 767px)");

  const onProgress = useCallback((p: number) => {
    const i = stepIndexAt(p);
    if (i !== indexRef.current) {
      indexRef.current = i;
      setIndex(i);
    }
  }, []);

  useGSAP(
    () => {
      const trigger = ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          progress.current = self.progress;
        },
        onToggle: (self) => setActive(self.isActive),
      });
      progress.current = trigger.progress;
      setActive(trigger.isActive || trigger.progress === 0);
    },
    { scope: sectionRef },
  );

  const copy = copyFor(index);
  const dots = steps.length + 1;
  const activeDot = index < 0 ? -1 : Math.min(index, steps.length);

  return (
    <section
      id="etapes"
      ref={sectionRef}
      aria-label="Les étapes de l'étanchéité d'une toiture terrasse"
      className="relative bg-[#f5f5f7]"
      style={{ height: "720vh" }}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div className="absolute inset-0">
          <TerraceScene progress={progress} active={active} narrow={narrow} onProgress={onProgress} variant="studio" />
        </div>

        {/* Titre de l'étape : centré en haut, comme une page produit */}
        <div className="pointer-events-none absolute inset-x-0 top-[11vh] px-5 text-center md:top-[12vh]">
          <AnimatePresence mode="wait">
            <m.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="mx-auto max-w-4xl"
            >
              <p className="text-[14px] font-semibold tracking-[-0.01em] text-[#c22c34] md:text-[17px]">{copy.eyebrow}</p>
              <h2 className="mt-2 text-[40px] font-bold leading-[1.05] tracking-[-0.03em] text-[#1d1d1f] md:text-[64px]">
                {copy.title}
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-[17px] leading-snug tracking-[-0.01em] text-[#707070] md:text-[21px]">
                {copy.text}
              </p>
            </m.div>
          </AnimatePresence>
        </div>

        {/* Points de progression */}
        <ol aria-hidden className="absolute inset-x-0 bottom-8 flex justify-center gap-[7px]">
          {Array.from({ length: dots }, (_, i) => (
            <li
              key={i}
              className={`size-2 rounded-full transition-colors duration-300 ${i === activeDot ? "bg-[#1d1d1f]" : "bg-[#777779]/40"}`}
            />
          ))}
        </ol>
      </div>

      {/* Pour le référencement et les lecteurs d'écran : toutes les étapes en texte */}
      <ol className="sr-only">
        {steps.map((s) => (
          <li key={s.id}>
            {s.title} : {s.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
