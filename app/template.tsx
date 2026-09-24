"use client";

import { motion } from "motion/react";
import { useEffect, type ReactNode } from "react";

// Pas d'animation au tout premier affichage (meilleur temps d'affichage et SEO),
// uniquement lors des navigations suivantes.
let firstRender = true;

/**
 * Transition entre les pages : fondu + légère montée à chaque navigation.
 * (template.tsx est recréé à chaque changement de page, contrairement à layout.tsx)
 */
export default function Template({ children }: { children: ReactNode }) {
  const animateIn = !firstRender;
  useEffect(() => {
    firstRender = false;
  }, []);
  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 12 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
