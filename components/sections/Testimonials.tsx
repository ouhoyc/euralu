import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

/**
 * Témoignages clients. Emplacements à remplacer par de vrais avis
 * (avec l'accord des clients) : ne jamais inventer d'avis.
 */
const testimonials = [
  { quote: "[À COMPLÉTER : avis d’un client particulier]", author: "[À COMPLÉTER]", context: "Rénovation, [ville]" },
  { quote: "[À COMPLÉTER : avis d’un constructeur ou lotisseur]", author: "[À COMPLÉTER]", context: "Constructeur, [ville]" },
  { quote: "[À COMPLÉTER : avis d’un client particulier]", author: "[À COMPLÉTER]", context: "Étanchéité, [ville]" },
];

export function Testimonials() {
  return (
    <RevealGroup className="grid gap-6 md:grid-cols-3">
      {testimonials.map((t, i) => (
        <RevealItem as="article" key={i} className="flex flex-col justify-between gap-10 rounded-2xl border border-graphite/10 bg-blanc p-8">
          <blockquote className="h-display text-2xl leading-snug text-graphite">« {t.quote} »</blockquote>
          <footer className="text-sm">
            <p className="font-medium text-graphite">{t.author}</p>
            <p className="text-zinc">{t.context}</p>
          </footer>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
