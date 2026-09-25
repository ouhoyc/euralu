import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { MetierCard } from "@/components/sections/MetierCard";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";
import { JsonLd } from "@/components/seo/JsonLd";
import { metiers } from "@/lib/metiers";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/sections/PageHero";

export const metadata = pageMetadata({
  title: "Nos métiers : zinguerie, étanchéité, sous-faces, tuiles",
  description:
    "Zinguerie zinc et alu, étanchéité de toitures terrasses, habillage de sous-faces PVC et traitement de tuiles : les métiers d’EURALU à Lyon, en Isère et dans le Rhône.",
  path: "/metiers",
});

export default function MetiersPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Nos métiers", path: "/metiers" }])} />
      <PageHero
        kicker="Nos métiers"
        title="Tout ce qui protège votre maison par le haut."
        lead="Quatre métiers complémentaires, réalisés par notre équipe salariée, pour les particuliers comme pour les constructeurs."
        crumbs={[{ href: "/metiers", label: "Nos métiers" }]}
      />
      <ReassuranceBar />
      <section className="py-24 md:py-32" aria-labelledby="liste-metiers">
        <div className="container-page">
          <h2 id="liste-metiers" className="sr-only">
            Nos quatre métiers
          </h2>
          <RevealGroup className="grid gap-5 md:grid-cols-2">
            {metiers.map((m) => (
              <RevealItem key={m.slug}>
                <MetierCard metier={m} />
              </RevealItem>
            ))}
          </RevealGroup>
          <Reveal className="mt-20 grid gap-8 rounded-2xl border border-graphite/10 bg-blanc p-8 md:grid-cols-[auto_1fr] md:items-center md:p-12">
            <p className="h-display text-5xl text-rouge">RGE</p>
            <p className="max-w-3xl leading-relaxed text-zinc">
              <strong className="font-medium text-graphite">Particuliers : EURALU est certifiée RGE.</strong> Pour les
              travaux de rénovation énergétique éligibles, cette qualification vous permet de prétendre aux aides
              publiques (MaPrimeRénov’, certificats d’économies d’énergie, éco-prêt à taux zéro), sous
              conditions. Nous vous indiquons lors du devis si vos travaux sont concernés.
            </p>
          </Reveal>
        </div>
      </section>
      <CTASection />
    </>
  );
}
