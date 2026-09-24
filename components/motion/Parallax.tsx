"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * Parallaxe douce : le contenu se déplace légèrement plus lentement que la page.
 * `strength` en pourcentage de la hauteur (8 = ±8 %).
 */
export function Parallax({ children, strength = 8, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0 will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}
