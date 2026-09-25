import Image from "next/image";
import { Button } from "@/components/ui/Button";

/**
 * Héro de l'accueil : grande image de toiture en plein écran, titre posé sur la zone de ciel.
 * Image d'illustration (générée), jamais présentée comme une réalisation.
 */
export function HomeHero({
  kicker,
  title,
  lead,
}: {
  kicker: string;
  title: string;
  lead: string;
}) {
  return (
    <section className="relative isolate flex min-h-dvh items-end overflow-hidden bg-graphite pb-32 pt-36 text-white md:items-center md:pb-0">
      <Image
        src="/images/accueil/toiture-hero.jpg"
        alt="Maison aux toitures en tuiles avec noue et solins, gouttières et bandeaux gris anthracite (image d’illustration)"
        fill
        preload
        quality={80}
        sizes="100vw"
        className="-z-20 object-cover object-[70%_center]"
      />
      {/* Voiles pour la lisibilité du texte et du menu */}
      <div aria-hidden className="absolute inset-x-0 top-0 -z-10 h-40 bg-gradient-to-b from-graphite/50 to-transparent" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-graphite/90 via-graphite/45 to-graphite/10 md:bg-gradient-to-r md:from-graphite/80 md:via-graphite/35 md:to-transparent"
      />

      <div className="container-page animate-rise">
        <p className="kicker mb-6 text-white/85">{kicker}</p>
        <h1 className="h-display max-w-3xl text-4xl uppercase tracking-[0.02em] md:text-6xl xl:text-7xl">{title}</h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 md:text-lg">{lead}</p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Button href="/contact#devis">Demander un devis</Button>
          <Button href="/metiers" variant="outline-light">
            Nos métiers
          </Button>
        </div>
      </div>
    </section>
  );
}
