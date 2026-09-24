import Image from "next/image";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { realisations } from "@/lib/realisations";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { company, yearsOfExperience } from "@/lib/site";

export const metadata = pageMetadata({
  title: "L’entreprise : zingueur à Saint-Clair-du-Rhône depuis 2005",
  description:
    "EURALU, SARL créée en 2005 à Saint-Clair-du-Rhône : une équipe salariée spécialisée en zinguerie, étanchéité et sous-faces. Décennale, RGE, Qualibat.",
  path: "/entreprise",
});

const valeurs = [
  { title: "Le soin du détail", text: "Un raccord, un relevé, une ligne de sous-face : ce sont les détails qui font la qualité et la durée d’un ouvrage." },
  { title: "La parole tenue", text: "Des devis clairs, des délais annoncés et respectés, un chantier laissé propre." },
  { title: "Le conseil honnête", text: "Nous proposons ce dont votre maison a besoin, ni plus, ni moins." },
];

const certifications = [
  { name: "Garantie décennale", text: "Nos ouvrages sont couverts par une assurance décennale.", ref: company.certifications.decennale },
  {
    name: "RGE",
    text: "Reconnu Garant de l’Environnement : pour les travaux éligibles, nos clients particuliers peuvent prétendre aux aides à la rénovation énergétique.",
    ref: company.certifications.rge,
  },
  { name: "Qualibat", text: "Qualification délivrée par l’organisme de référence du bâtiment.", ref: company.certifications.qualibat },
];

const photo = realisations.find((r) => r.src.includes("toiture-terrasse-couvertine-alu-blanche"))!;

export default function EntreprisePage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "L’entreprise", path: "/entreprise" }])} />
      <PageHero
        kicker={`Depuis ${company.foundingYear}`}
        title={`${yearsOfExperience} ans au-dessus des maisons de la région.`}
        crumbs={[{ href: "/entreprise", label: "L’entreprise" }]}
      />

      {/* HISTOIRE */}
      <section className="py-24 md:py-32">
        <div className="container-page grid gap-14 lg:grid-cols-2 lg:gap-24">
          <Reveal className="space-y-6 text-lg leading-relaxed md:text-xl">
            <p className="kicker text-rouge">Notre histoire</p>
            <p>
              EURALU a été créée en {company.foundingYear} à Saint-Clair-du-Rhône, entre Lyon et Vienne. Depuis, la SARL
              réalise la zinguerie, l’étanchéité des toitures terrasses et l’habillage des débords de toit de
              maisons individuelles dans toute la région Rhône-Alpes.
            </p>
            <p>
              Nos clients sont des constructeurs de maisons individuelles, des lotisseurs et des particuliers qui
              rénovent. À chacun, nous apportons la même chose : un travail propre et durable, réalisé par notre propre
              équipe.
            </p>
            <p className="text-base text-zinc">[À COMPLÉTER : quelques dates clés, le parcours du fondateur, l’évolution de l’entreprise.]</p>
          </Reveal>
          <Parallax strength={5} className="aspect-[4/5] rounded-2xl">
            <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
          </Parallax>
        </div>
      </section>

      {/* ÉQUIPE */}
      <section className="bg-graphite py-24 text-white md:py-32">
        <div className="container-page">
          <Reveal className="mb-16 max-w-3xl">
            <p className="kicker mb-5 text-rouge-clair">L’équipe</p>
            <h2 className="h-display text-5xl md:text-6xl">Une équipe salariée, formée à nos méthodes.</h2>
          </Reveal>
          <RevealGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <RevealItem key={i}>
                <div className="grid aspect-[3/4] place-items-center rounded-2xl border border-dashed border-white/20 text-center text-sm text-zinc-clair">
                  [À COMPLÉTER : photo]
                </div>
                <p className="mt-4 font-medium">[Prénom Nom]</p>
                <p className="text-sm text-zinc-clair">[Fonction]</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* VALEURS */}
      <section className="py-24 md:py-32">
        <div className="container-page">
          <Reveal className="mb-16 max-w-3xl">
            <p className="kicker mb-5 text-rouge">Nos valeurs</p>
            <h2 className="h-display text-5xl text-graphite md:text-6xl">Ce qui nous guide sur chaque chantier.</h2>
          </Reveal>
          <RevealGroup className="grid gap-10 md:grid-cols-3">
            {valeurs.map((v) => (
              <RevealItem key={v.title} className="border-t border-graphite/15 pt-8">
                <h3 className="h-display text-3xl text-graphite">{v.title}</h3>
                <p className="mt-4 leading-relaxed text-zinc">{v.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section id="certifications" className="pb-24 md:pb-32">
        <div className="container-page">
          <Reveal className="mb-16 max-w-3xl">
            <p className="kicker mb-5 text-rouge">Garanties et qualifications</p>
            <h2 className="h-display text-5xl text-graphite md:text-6xl">Des engagements vérifiables.</h2>
          </Reveal>
          <RevealGroup className="grid gap-5 md:grid-cols-3">
            {certifications.map((c) => (
              <RevealItem key={c.name} className="flex flex-col gap-6 rounded-2xl border border-graphite/10 bg-blanc p-8">
                <h3 className="h-display text-4xl text-graphite">{c.name}</h3>
                <p className="leading-relaxed text-zinc">{c.text}</p>
                <p className="mt-auto text-xs text-zinc">{c.ref}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <CTASection />
    </>
  );
}
