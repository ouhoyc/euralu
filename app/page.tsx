import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Building2, Home as HomeIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Counter } from "@/components/motion/Counter";
import { Parallax } from "@/components/motion/Parallax";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { CTASection } from "@/components/sections/CTASection";
import { MetierCard } from "@/components/sections/MetierCard";
import { ReassuranceBar } from "@/components/sections/ReassuranceBar";
import { Testimonials } from "@/components/sections/Testimonials";
import { TerraceExperience } from "@/components/three/terrace/TerraceExperience";
import { metiers } from "@/lib/metiers";
import { realisations } from "@/lib/realisations";
import { pageMetadata } from "@/lib/seo";
import { company, yearsOfExperience } from "@/lib/site";

export const metadata = pageMetadata({
  title: "EURALU — Zinguerie, étanchéité et sous-faces à Lyon et en Rhône-Alpes",
  description:
    "Depuis 2005, EURALU pose gouttières zinc et alu, étanchéité de toitures terrasses et habillages de sous-faces PVC à Lyon, en Isère et dans le Rhône. Décennale, RGE, Qualibat. Devis gratuit.",
  path: "/",
});

const showcase = [
  "sous-face-pvc-anthracite-apres",
  "toiture-terrasse-couvertine-alu-blanche",
  "gouttieres-descente-alu-blanc",
].map((slug) => realisations.find((r) => r.src.includes(slug))!);

export default function HomePage() {
  return (
    <>
      {/*
        HÉRO — expérience 3D : une toiture terrasse s'étanche couche après couche au fil du scroll.
        Version statique automatique si le visiteur préfère réduire les animations.
      */}
      <TerraceExperience
        intro={{
          kicker: "Zinguerie · Étanchéité · Sous-faces · Tuiles",
          title: (
            <>
              Le toit, <span className="text-white/70">dans le détail.</span>
            </>
          ),
          lead: `Depuis ${company.foundingYear}, EURALU réalise la zinguerie, l’étanchéité des toitures terrasses et l’habillage des débords de toit des maisons de la région lyonnaise.`,
          hint: "Faites défiler : une toiture terrasse se construit sous vos yeux",
        }}
      />

      <ReassuranceBar />

      {/* MÉTIERS */}
      <section className="py-24 md:py-36">
        <div className="container-page">
          <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="kicker mb-5 text-rouge">Nos métiers</p>
              <h2 className="h-display text-4xl text-graphite md:text-5xl">Quatre savoir-faire, une même exigence.</h2>
            </div>
            <Link href="/metiers" className="group flex min-h-11 items-center gap-2 text-sm text-graphite">
              Tous nos métiers
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </Reveal>
          <RevealGroup className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {metiers.map((m) => (
              <RevealItem key={m.slug}>
                <MetierCard metier={m} />
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* DOUBLE ENTRÉE : particulier / professionnel */}
      <section className="pb-24 md:pb-36">
        <div className="container-page">
          <Reveal className="mb-14 max-w-3xl">
            <p className="kicker mb-5 text-rouge">Votre projet</p>
            <h2 className="h-display text-4xl text-graphite md:text-5xl">Deux façons de travailler avec nous.</h2>
          </Reveal>
          <RevealGroup className="grid gap-5 md:grid-cols-2">
            <RevealItem>
              <EntryCard
                href="/metiers"
                icon={<HomeIcon className="size-6" aria-hidden />}
                kicker="Vous êtes un particulier"
                title="Rénover, protéger, embellir."
                text="Gouttières à remplacer, sous-faces à habiller, toiture terrasse qui fuit, tuiles envahies par la mousse : nous venons voir, nous conseillons et nous chiffrons gratuitement. Entreprise certifiée RGE : pour les travaux éligibles, vous pouvez bénéficier des aides à la rénovation."
                cta="Découvrir nos métiers"
              />
            </RevealItem>
            <RevealItem>
              <EntryCard
                href="/professionnels"
                icon={<Building2 className="size-6" aria-hidden />}
                kicker="Vous êtes un professionnel"
                title="Un partenaire fiable pour vos chantiers."
                text="Constructeurs de maisons individuelles et lotisseurs : une équipe salariée, un interlocuteur unique et le respect de vos plannings, du premier lot au dernier."
                cta="Espace professionnels"
                dark
              />
            </RevealItem>
          </RevealGroup>
        </div>
      </section>

      {/* CHIFFRES */}
      <section className="bg-graphite py-24 text-white md:py-32">
        <div className="container-page">
          <RevealGroup as="dl" className="grid grid-cols-2 gap-y-14 lg:grid-cols-4">
            {[
              { value: yearsOfExperience, suffix: " ans", label: "d’expérience", from: 0 },
              { value: company.foundingYear, suffix: "", label: "année de création", from: 1990 },
              { value: 4, suffix: "", label: "métiers de l’enveloppe", from: 0 },
              { value: 3, suffix: "", label: "garanties et qualifications", from: 0 },
            ].map((s) => (
              <RevealItem key={s.label} className="flex flex-col-reverse gap-3 border-l border-white/15 pl-6">
                <dt className="text-sm text-zinc-clair">{s.label}</dt>
                <dd className="h-display text-5xl md:text-6xl">
                  <Counter to={s.value} from={s.from} />
                  {s.suffix}
                </dd>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* RÉALISATIONS */}
      <section className="py-24 md:py-36">
        <div className="container-page">
          <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="kicker mb-5 text-rouge">Réalisations</p>
              <h2 className="h-display text-4xl text-graphite md:text-5xl">Des chantiers, pas des images de catalogue.</h2>
            </div>
            <Button href="/realisations" variant="outline-dark">
              Toute la galerie
            </Button>
          </Reveal>
          <RevealGroup className="grid gap-4 md:grid-cols-3">
            {showcase.map((r, i) => (
              <RevealItem key={r.src} className={i === 1 ? "md:translate-y-16" : ""}>
                <Parallax strength={4} className="aspect-[3/4] rounded-2xl">
                  <Image src={r.src} alt={r.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
                </Parallax>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="pb-24 pt-8 md:pb-36 md:pt-24">
        <div className="container-page">
          <Reveal className="mb-14 max-w-3xl">
            <p className="kicker mb-5 text-rouge">Ils nous ont confié leur toiture</p>
            <h2 className="h-display text-4xl text-graphite md:text-5xl">Témoignages</h2>
          </Reveal>
          <Testimonials />
        </div>
      </section>

      <CTASection />
    </>
  );
}

function EntryCard({
  href,
  icon,
  kicker,
  title,
  text,
  cta,
  dark = false,
}: {
  href: string;
  icon: ReactNode;
  kicker: string;
  title: string;
  text: string;
  cta: string;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`group flex h-full flex-col justify-between gap-12 rounded-2xl p-8 transition-transform duration-700 ease-premium hover:-translate-y-1 md:p-12 ${
        dark ? "bg-graphite text-white" : "border border-graphite/10 bg-blanc text-graphite"
      }`}
    >
      <div>
        <span
          className={`mb-10 grid size-14 place-items-center rounded-full ${dark ? "bg-white/10" : "bg-graphite/5"}`}
        >
          {icon}
        </span>
        <p className={`kicker mb-4 ${dark ? "text-rouge-clair" : "text-rouge"}`}>{kicker}</p>
        <h3 className="h-display text-3xl md:text-4xl">{title}</h3>
        <p className={`mt-6 max-w-lg leading-relaxed ${dark ? "text-white/70" : "text-zinc"}`}>{text}</p>
      </div>
      <span className="flex items-center gap-2 text-sm font-medium">
        {cta}
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
