"use client";

import { LazyMotion, MotionConfig } from "motion/react";
import type { ReactNode } from "react";

// Le moteur d'animation est chargé en différé, après l'affichage de la page
const loadFeatures = () => import("./features").then((mod) => mod.default);

/**
 * - LazyMotion : les composants <m.*> sont légers, le moteur arrive juste après (strict : interdit <motion.*>).
 * - reducedMotion="user" : respecte automatiquement le réglage « réduire les animations » du visiteur.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
