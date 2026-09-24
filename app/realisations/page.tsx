import { Reveal } from "@/components/motion/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { Gallery } from "@/components/sections/Gallery";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { realisations } from "@/lib/realisations";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Réalisations : zinguerie, étanchéité, sous-faces",
  description:
    "Photos de chantiers EURALU : gouttières zinc et alu, toitures terrasses, habillages de sous-faces PVC anthracite et aspect bois, dans la région lyonnaise.",
  path: "/realisations",
});

export default function RealisationsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Réalisations", path: "/realisations" }])} />
      <PageHero
        kicker="Réalisations"
        title="Nos chantiers, en vraies photos."
        lead="Toutes les images de cette galerie ont été prises sur nos chantiers. Filtrez par métier, puis cliquez sur une photo pour l’agrandir."
        crumbs={[{ href: "/realisations", label: "Réalisations" }]}
      />
      <section className="py-20 md:py-28">
        <div className="container-page">
          <Reveal>
            <Gallery items={realisations} />
          </Reveal>
        </div>
      </section>
      <CTASection title="Votre chantier, prochainement ici ?" />
    </>
  );
}
