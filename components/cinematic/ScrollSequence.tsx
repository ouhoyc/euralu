"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useState, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Description d'une séquence produite par scripts/extract-frames.sh (manifest.json). */
export type SequenceManifest = {
  name: string;
  desktop: FrameSet;
  mobile: FrameSet;
};
type FrameSet = { path: string; count: number; width: number; height: number };

/** Texte en surimpression, visible entre `from` et `to` (progression du scroll de 0 à 1). */
export type SequenceOverlay = {
  from: number;
  to: number;
  content: ReactNode;
  /** Position du bloc de texte à l'écran. */
  position?: "center" | "bottom-left" | "left" | "right";
};

const FADE = 0.06; // durée des fondus des textes, en part de la séquence
const MAX_DPR = 2; // au-delà, gain invisible et coût de dessin important
const CONCURRENCY = 6; // téléchargements d'images en parallèle

const positions: Record<NonNullable<SequenceOverlay["position"]>, string> = {
  center: "items-center justify-center text-center",
  "bottom-left": "items-end justify-start pb-[14vh]",
  left: "items-center justify-start",
  right: "items-center justify-end text-right",
};

const frameUrl = (set: FrameSet, i: number) => `${set.path}/${String(i + 1).padStart(4, "0")}.webp`;

/**
 * Ordre de chargement progressif : d'abord 1 image sur 16 (toute la séquence est vite
 * « parcourable », en saccadé), puis 1 sur 8, 1 sur 4… jusqu'à toutes les images.
 */
function loadingOrder(count: number) {
  const order: number[] = [];
  const seen = new Set<number>();
  for (let step = 16; step >= 1; step /= 2) {
    for (let i = 0; i < count; i += step) {
      if (!seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    }
  }
  if (!seen.has(count - 1)) order.splice(1, 0, count - 1);
  return order;
}

/**
 * Expérience « scroll-scrubbing » façon pages produits Apple :
 * une vidéo découpée en images est dessinée dans un <canvas>, et le défilement
 * de la page fait avancer ou reculer la vidéo image par image.
 *
 * - Textes en vrai HTML (référencement), en fondu selon la progression.
 * - Jeu d'images allégé sur mobile, chargement progressif.
 * - Si le visiteur préfère réduire les animations : version statique (voir globals.css).
 */
export function ScrollSequence({
  manifest,
  overlays = [],
  poster,
  heightVh = 400,
  label,
}: {
  manifest: SequenceManifest;
  overlays?: SequenceOverlay[];
  /** Image affichée avant le chargement et dans la version statique. */
  poster: string;
  /** Longueur de défilement de la séquence (400 = 4 hauteurs d'écran). */
  heightVh?: number;
  /** Description de la séquence pour les lecteurs d'écran. */
  label: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [loaded, setLoaded] = useState(0); // proportion d'images chargées (0 à 1)

  useGSAP(
    () => {
      const section = sectionRef.current;
      const canvas = canvasRef.current;
      if (!section || !canvas) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const set = window.matchMedia("(max-width: 767px)").matches ? manifest.mobile : manifest.desktop;
      const frames: (HTMLImageElement | null)[] = new Array(set.count).fill(null);
      const state = { frame: 0 };
      let drawn = -1;
      let cancelled = false;

      // --- Dessin -------------------------------------------------------
      /** Image chargée la plus proche de l'image demandée (tant que tout n'est pas chargé). */
      const nearestLoaded = (i: number) => {
        for (let d = 0; d < set.count; d++) {
          if (frames[i - d]) return frames[i - d];
          if (frames[i + d]) return frames[i + d];
        }
        return null;
      };

      const draw = (force = false) => {
        const i = Math.round(state.frame);
        const img = nearestLoaded(i);
        if (!img || (!force && i === drawn)) return;
        drawn = frames[i] ? i : -1; // redessinera quand la bonne image arrivera
        // Remplissage « cover » : l'image couvre tout le canvas sans déformation
        const { width: cw, height: ch } = canvas;
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
        const w = img.naturalWidth * scale;
        const h = img.naturalHeight * scale;
        ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
      };

      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
        canvas.width = Math.round(canvas.clientWidth * dpr);
        canvas.height = Math.round(canvas.clientHeight * dpr);
        ctx.imageSmoothingQuality = "high";
        draw(true);
      };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(canvas);

      // --- Chargement progressif ----------------------------------------
      const order = loadingOrder(set.count);
      let next = 0;
      let done = 0;
      const loadNext = async (): Promise<void> => {
        if (cancelled || next >= order.length) return;
        const i = order[next++];
        const img = new Image();
        img.src = frameUrl(set, i);
        try {
          await img.decode();
          if (cancelled) return;
          frames[i] = img;
          if (Math.abs(i - Math.round(state.frame)) < 16) draw(true);
        } catch {
          // image manquante : la plus proche sera utilisée à la place
        }
        done++;
        if (done % 8 === 0 || done === order.length) setLoaded(done / order.length);
        return loadNext();
      };
      for (let k = 0; k < CONCURRENCY; k++) void loadNext();

      // --- Défilement → image -------------------------------------------
      // scrub: 0.6 = la vidéo « rattrape » le scroll en 0,6 s, pour un rendu fluide
      gsap.to(state, {
        frame: set.count - 1,
        ease: "none",
        scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6 },
        onUpdate: () => draw(),
      });

      // --- Textes en surimpression --------------------------------------
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        onUpdate: ({ progress }) => {
          overlays.forEach((o, idx) => {
            const el = overlayRefs.current[idx];
            if (!el) return;
            const fadeIn = o.from <= 0 ? 1 : gsap.utils.clamp(0, 1, (progress - o.from) / FADE);
            const fadeOut = o.to >= 1 ? 1 : gsap.utils.clamp(0, 1, (o.to - progress) / FADE);
            const opacity = Math.min(fadeIn, fadeOut);
            el.style.opacity = String(opacity);
            el.style.transform = `translate3d(0, ${(1 - opacity) * 24}px, 0)`;
            el.style.visibility = opacity > 0 ? "visible" : "hidden";
          });
        },
      });

      return () => {
        cancelled = true;
        resizeObserver.disconnect();
      };
    },
    { scope: sectionRef, dependencies: [manifest] },
  );

  return (
    <section
      ref={sectionRef}
      data-sequence
      aria-label={label}
      className="relative bg-graphite text-white"
      style={{ height: `${heightVh}vh` }}
    >
      <div data-sequence-stage className="sticky top-0 h-dvh overflow-hidden">
        {/* Image d'attente (et version statique) ; le canvas se dessine par-dessus */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          data-sequence-poster
          src={poster}
          alt=""
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover"
        />
        <canvas ref={canvasRef} data-sequence-canvas aria-hidden className="absolute inset-0 size-full" />
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-gradient-to-t from-graphite/75 via-graphite/10 to-graphite/45" />

        {overlays.map((o, idx) => (
          <div
            key={idx}
            ref={(el) => {
              overlayRefs.current[idx] = el;
            }}
            data-sequence-overlay
            className={`container-page pointer-events-none absolute inset-0 flex ${positions[o.position ?? "center"]}`}
            style={{ opacity: o.from <= 0 ? 1 : 0, visibility: o.from <= 0 ? "visible" : "hidden" }}
          >
            <div className="pointer-events-auto max-w-3xl [text-shadow:0_2px_30px_rgb(0_0_0/0.55)]">{o.content}</div>
          </div>
        ))}

        {/* Indicateur discret de chargement des images */}
        <div
          aria-hidden
          data-sequence-progress
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-white/40 transition-[transform,opacity] duration-500"
          style={{ transform: `scaleX(${loaded})`, opacity: loaded >= 1 ? 0 : 1 }}
        />
      </div>
    </section>
  );
}
