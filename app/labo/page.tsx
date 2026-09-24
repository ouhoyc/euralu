import type { Metadata } from "next";
import { ScrollSequence, type SequenceManifest } from "@/components/cinematic/ScrollSequence";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import manifest from "@/public/sequences/test/manifest.json";

/**
 * PAGE DE TEST (prototype de l'étape 3), non référencée.
 * Sert à valider la technique du scroll-scrubbing avant de générer les vrais plans.
 */
export const metadata: Metadata = {
  title: "Prototype séquence cinématique",
  robots: { index: false, follow: false },
};

export default function LaboPage() {
  return (
    <>
      <ScrollSequence
        manifest={manifest as SequenceManifest}
        poster="/sequences/test/desktop/0001.webp"
        label="Séquence de démonstration : travelling sur des sous-faces et une descente en aluminium anthracite"
        heightVh={450}
        overlays={[
          {
            from: 0,
            to: 0.18,
            position: "center",
            content: (
              <div className="flex flex-col items-center gap-8">
                <Logo tone="blanc" className="w-56 md:w-80" />
                <p className="kicker text-white/80">Faites défiler</p>
              </div>
            ),
          },
          {
            from: 0.24,
            to: 0.46,
            position: "bottom-left",
            content: (
              <>
                <p className="kicker mb-5 text-white/85">03 — Sous-faces et bandeaux</p>
                <h2 className="h-display text-5xl md:text-7xl">Des lignes nettes, sans entretien.</h2>
              </>
            ),
          },
          {
            from: 0.56,
            to: 0.78,
            position: "right",
            content: (
              <>
                <p className="kicker mb-5 text-white/85">02 — Zinguerie</p>
                <h2 className="h-display text-5xl md:text-7xl">L’eau, guidée jusqu’au sol.</h2>
              </>
            ),
          },
          {
            from: 0.86,
            to: 1,
            position: "center",
            content: (
              <div className="flex flex-col items-center gap-8">
                <h2 className="h-display text-5xl md:text-8xl">Demandez votre devis.</h2>
                <Button href="/contact#devis">Demander un devis</Button>
              </div>
            ),
          },
        ]}
      />

      <section className="py-24">
        <div className="container-page max-w-3xl space-y-4 text-graphite">
          <p className="kicker text-rouge">Prototype — étape 3</p>
          <h1 className="h-display text-5xl">Fin de la séquence de test.</h1>
          <p className="leading-relaxed text-zinc">
            Cette vidéo de test a été fabriquée à partir de deux photos pour valider la technique. Elle sera remplacée
            par les plans Higgsfield. Le numéro affiché en bas à gauche de l’image permet de vérifier que chaque image
            s’affiche bien, en avançant comme en reculant.
          </p>
        </div>
      </section>
    </>
  );
}
