import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <section className="grid min-h-[80dvh] place-items-center bg-graphite px-5 pt-24 text-center text-white">
      <div>
        <p className="kicker mb-6 text-rouge-clair">Erreur 404</p>
        <h1 className="h-display text-5xl md:text-7xl">Page introuvable.</h1>
        <p className="mx-auto mt-6 max-w-md text-white/70">Cette page n’existe pas ou a été déplacée.</p>
        <div className="mt-10">
          <Button href="/">Retour à l’accueil</Button>
        </div>
      </div>
    </section>
  );
}
