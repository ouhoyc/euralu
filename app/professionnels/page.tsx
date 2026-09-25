import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { PageHero } from "@/components/sections/PageHero";
import { Steps } from "@/components/sections/Steps";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { company, yearsOfExperience } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Constructeurs et lotisseurs : zinguerie et étanchéité de maisons neuves",
  description:
    "Constructeurs de maisons individuelles et lotisseurs de la région lyonnaise : EURALU réalise zinguerie, étanchéité de toitures terrasses et sous-faces, dans le respect de vos plannings.",
  path: "/professionnels",
  image: "/og-default.jpg",
});

const engagements = [
  {
    title: "Réactivité",
    text: "Une réponse rapide à vos demandes de chiffrage et une intervention calée sur l’avancement de vos chantiers.",
  },
  {
    title: "Volumes",
    text: "Une équipe salariée, organisée pour suivre plusieurs chantiers en parallèle, du pavillon isolé au lotissement.",
  },
  {
    title: "Respect des plannings",
    text: "Nous intervenons au bon moment dans l’enchaînement des corps d’état, pour ne pas bloquer les lots suivants.",
  },
  {
    title: "Interlocuteur unique",
    text: "Un seul contact pour la zinguerie, l’étanchéité des toitures terrasses et l’habillage des sous-faces.",
  },
];

const process = [
  { title: "Consultation", text: "Vous nous transmettez plans et descriptif ; nous chiffrons chaque lot." },
  { title: "Planification", text: "Nous calons nos interventions sur votre planning de chantier." },
  { title: "Intervention", text: "Notre équipe réalise les travaux, chantier après chantier." },
  { title: "Réception", text: "Contrôle, nettoyage et réception des ouvrages avec votre conducteur de travaux." },
  { title: "Suivi", text: "Un contact direct pour toute question après la livraison." },
];

export default function ProfessionnelsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Professionnels", path: "/professionnels" }])} />
      <PageHero
        kicker="Constructeurs · Lotisseurs"
        title="Votre partenaire toiture, chantier après chantier."
        lead={`Depuis ${company.foundingYear}, EURALU accompagne les constructeurs de maisons individuelles et les lotisseurs de la région lyonnaise : zinguerie, étanchéité de toitures terrasses et sous-faces.`}
        crumbs={[{ href: "/professionnels", label: "Professionnels" }]}
      />

      <section className="py-24 md:py-32">
        <div className="container-page">
          <Reveal className="mb-16 max-w-3xl">
            <p className="kicker mb-5 text-rouge">Nos engagements</p>
            <h2 className="h-display text-4xl text-graphite md:text-5xl">Ce que vous pouvez attendre de nous.</h2>
          </Reveal>
          <RevealGroup className="grid gap-5 md:grid-cols-2">
            {engagements.map((e, i) => (
              <RevealItem key={e.title} className="rounded-2xl border border-graphite/10 bg-blanc p-8 md:p-12">
                <span className="kicker text-zinc">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="h-display mt-6 text-3xl text-graphite">{e.title}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-zinc">{e.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="bg-graphite py-24 text-white md:py-32">
        <div className="container-page grid gap-12 lg:grid-cols-3">
          <Reveal className="lg:col-span-1">
            <p className="kicker mb-5 text-rouge-clair">En bref</p>
            <h2 className="h-display text-4xl">Une entreprise installée, une équipe stable.</h2>
          </Reveal>
          <RevealGroup as="dl" className="grid gap-10 sm:grid-cols-2 lg:col-span-2">
            {[
              [`${yearsOfExperience} ans`, "d’expérience auprès des constructeurs et des particuliers"],
              ["Équipe salariée", "notre propre équipe sur vos chantiers"],
              ["Décennale · RGE · Qualibat", "attestations transmises sur demande"],
              ["Rhône-Alpes", "Lyon et agglomération, Isère, Rhône, secteur de Vienne"],
            ].map(([k, v]) => (
              <RevealItem key={k} className="border-l border-white/15 pl-6">
                <dt className="h-display text-2xl">{k}</dt>
                <dd className="mt-2 text-sm text-zinc-clair">{v}</dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      <section className="py-24 md:py-32">
        <div className="container-page">
          <Reveal className="mb-16 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="kicker mb-5 text-rouge">Méthode</p>
              <h2 className="h-display text-4xl text-graphite md:text-5xl">De la consultation à la réception.</h2>
            </div>
            <Button href="/contact#devis">Consulter EURALU</Button>
          </Reveal>
          <Steps steps={process} />
        </div>
      </section>

      <CTASection
        title="Un programme en préparation ?"
        text="Envoyez-nous vos plans et votre planning : nous revenons vers vous avec un chiffrage détaillé."
      />
    </>
  );
}
