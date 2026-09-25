import type { Metadata } from "next";
import { TerraceExperience } from "@/components/three/terrace/TerraceExperience";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { Button } from "@/components/ui/Button";

/**
 * PAGE DE TEST, non référencée.
 * Prototypes : la toiture terrasse qui s'étanche au scroll (3D) et le comparateur avant / après des tuiles.
 */
export const metadata: Metadata = {
  title: "Prototype : toiture terrasse en 3D",
  robots: { index: false, follow: false },
};

export default function LaboPage() {
  return (
    <>
      <TerraceExperience />
      <section className="py-24 md:py-32">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="kicker mb-5 text-rouge">Traitement de tuiles</p>
            <h2 className="h-display text-4xl text-graphite md:text-5xl">Rendez à votre toiture sa couleur d’origine.</h2>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-zinc">
              Mousses, lichens et salissures retiennent l’humidité et abîment les tuiles. Un démoussage suivi d’un
              traitement protège la couverture et lui rend son aspect d’origine.
            </p>
            <p className="mt-4 text-sm text-zinc">Faites glisser le curseur pour comparer.</p>
            <div className="mt-8">
              <Button href="/contact#devis">Demander un devis</Button>
            </div>
          </div>
          <BeforeAfter
            before={{ src: "/images/avant-apres/tuiles-avant.jpg", alt: "Toiture en tuiles couverte de mousses et de salissures" }}
            after={{ src: "/images/avant-apres/tuiles-apres.jpg", alt: "La même toiture, propre, après démoussage et traitement (simulation)" }}
            width={960}
            height={1280}
            labels={{ before: "Avant", after: "Après" }}
            caption="Photo « avant » réelle. Image « après » : simulation du résultat après traitement."
          />
        </div>
      </section>
      <section className="py-24">
        <div className="container-page max-w-3xl space-y-4 text-graphite">
          <p className="kicker text-rouge">Prototype</p>
          <h2 className="h-display text-4xl">Fin de la scène de test.</h2>
          <p className="leading-relaxed text-zinc">
            Scène 3D calculée en direct dans le navigateur : aucune vidéo, aucun crédit Higgsfield. Les étapes et leurs
            textes sont à faire valider par EURALU.
          </p>
        </div>
      </section>
    </>
  );
}
