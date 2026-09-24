import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { company } from "@/lib/site";

/** Appel à l'action « devis » placé en fin de page. */
export function CTASection({
  title = "Parlons de votre toiture.",
  text = "Visite, conseils et devis gratuits. Nous vous répondons rapidement, du lundi au vendredi.",
}: {
  title?: string;
  text?: string;
}) {
  return (
    <section className="bg-graphite py-24 text-white md:py-36">
      <div className="container-page">
        <Reveal className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="kicker mb-6 text-rouge-clair">Devis gratuit</p>
            <h2 className="h-display text-5xl md:text-7xl">{title}</h2>
            <p className="mt-6 max-w-xl text-lg text-white/70">{text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <Button href="/contact#devis">Demander un devis</Button>
            <Button href={company.phoneHref} variant="outline-light" arrow={false}>
              {company.phone}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
