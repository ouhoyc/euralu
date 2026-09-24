import type { Metadata } from "next";
import { TerraceExperience } from "@/components/three/terrace/TerraceExperience";

/**
 * PAGE DE TEST, non référencée.
 * Prototype : la toiture terrasse qui s'étanche au scroll, en 3D.
 */
export const metadata: Metadata = {
  title: "Prototype : toiture terrasse en 3D",
  robots: { index: false, follow: false },
};

export default function LaboPage() {
  return (
    <>
      <TerraceExperience />
      <section className="py-24">
        <div className="container-page max-w-3xl space-y-4 text-graphite">
          <p className="kicker text-rouge">Prototype</p>
          <h2 className="h-display text-5xl">Fin de la scène de test.</h2>
          <p className="leading-relaxed text-zinc">
            Scène 3D calculée en direct dans le navigateur : aucune vidéo, aucun crédit Higgsfield. Les étapes et leurs
            textes sont à faire valider par EURALU.
          </p>
        </div>
      </section>
    </>
  );
}
