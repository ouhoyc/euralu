"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

/**
 * Compteur animé de 0 (ou `from`) à `to` quand il devient visible.
 * Le vrai nombre est rendu côté serveur (SEO, sans JavaScript) puis animé.
 */
export function Counter({ to, from = 0, duration = 1.8 }: { to: number; from?: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotion();

  // Une fois hydraté et tant qu'il n'est pas visible, le compteur part de `from`.
  useEffect(() => {
    if (ref.current && !reduce && !inView) ref.current.textContent = from.toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(from, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        el.textContent = Math.round(v).toString();
      },
    });
    return () => controls.stop();
  }, [inView, reduce, from, to, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {to}
    </span>
  );
}
