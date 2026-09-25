import Image from "next/image";
import { Button } from "@/components/ui/Button";

/**
 * Héro de l'accueil : grande image de toiture, titre posé sur la zone de ciel.
 * Mobile : l'image est affichée en entier sous le menu, le texte en dessous.
 * Ordinateur : image plein écran, texte par-dessus à gauche.
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
    <section className="relative isolate overflow-hidden bg-graphite pt-20 text-white md:flex md:min-h-dvh md:items-center md:pt-0">
      <div className="relative aspect-[16/10] md:absolute md:inset-0 md:-z-20 md:aspect-auto">
        <Image
          src="/images/accueil/toiture-hero.jpg"
          alt="Maison aux toitures en tuiles avec noue et solins, gouttières et bandeaux gris anthracite (image d’illustration)"
          fill
          preload
          quality={80}
          sizes="100vw"
          className="object-cover object-[90%_center] md:object-[70%_center]"
        />
        {/* Voiles pour la lisibilité du texte et du menu */}
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-graphite to-transparent md:hidden" />
        <div aria-hidden className="absolute inset-x-0 top-0 hidden h-40 bg-gradient-to-b from-graphite/50 to-transparent md:block" />
        <div
          aria-hidden
          className="absolute inset-0 hidden bg-gradient-to-r from-graphite/80 via-graphite/35 to-transparent md:block"
        />
      </div>

      <div className="container-page animate-rise pb-20 pt-4 md:py-0">
        <p className="kicker mb-5 text-white/85 md:mb-6">{kicker}</p>
        <h1 className="h-display max-w-3xl text-4xl uppercase tracking-[0.02em] md:text-6xl xl:text-7xl">{title}</h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-white/85 md:mt-6 md:text-lg">{lead}</p>
        <div className="mt-8 flex flex-wrap gap-3 md:mt-10">
          <Button href="/contact#devis">Demander un devis</Button>
          <Button href="/metiers" variant="outline-light">
            Nos métiers
          </Button>
        </div>
      </div>
    </section>
  );
}
