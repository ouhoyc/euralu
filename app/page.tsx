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

const heroPhoto = realisations.find((r) => r.src.includes("gouttiere-descente-alu-anthracite"))!;
const showcase = [
  "sous-face-pvc-anthracite-apres",
  "toiture-terrasse-couvertine-alu-blanche",
  "gouttieres-descente-alu-blanc",
].map((slug) => realisations.find((r) => r.src.includes(slug))!);

export default function HomePage() {
  return (
    <>
      {/*
        HÉRO — version provisoire.
        Sera remplacé par l'expérience cinématique (scroll-scrubbing vidéo) à l'étape 3 ;
        cette version restera la variante statique (prefers-reduced-motion).
      */}
      <section className="relative isolate min-h-dvh overflow-hidden bg-graphite text-white">
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_70%_20%,rgba(200,204,209,0.10),transparent_55%)]"
        />
        <div className="container-page grid min-h-dvh items-center gap-12 pb-16 pt-32 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:pt-24">
          <div className="animate-rise">
            <p className="kicker mb-8 text-rouge-clair">Zinguerie · Étanchéité · Sous-faces · Tuiles</p>
            <h1 className="h-display text-[3.4rem] sm:text-7xl xl:text-[7.5rem]">
              Le toit, <em className="text-alu">dans le détail.</em>
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70 md:text-xl">
              Depuis {company.foundingYear}, EURALU réalise la zinguerie, l’étanchéité des toitures terrasses et
              l’habillage des débords de toit des maisons de la région lyonnaise.
            </p>
            <div className="mt-12 flex flex-col gap-3 sm:flex-row">
              <Button href="/contact#devis">Demander un devis</Button>
              <Button href="/realisations" variant="outline-light">
                Voir nos réalisations
              </Button>
            </div>
          </div>

          <Parallax strength={6} className="aspect-[3/4] w-full max-w-md justify-self-center rounded-[2rem] lg:max-w-none">
            <Image
              src={heroPhoto.src}
              alt={heroPhoto.alt}
              fill
              preload
              sizes="(min-width: 1024px) 40vw, 90vw"
              className="object-cover"
            />
          </Parallax>
        </div>
      </section>

      <ReassuranceBar />

      {/* DOUBLE ENTRÉE : particulier / professionnel */}
      <section className="py-24 md:py-36">
        <div className="container-page">
          <Reveal className="mb-14 max-w-3xl">
            <p className="kicker mb-5 text-rouge">Votre projet</p>
            <h2 className="h-display text-5xl text-graphite md:text-6xl">Deux façons de travailler avec nous.</h2>
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

      {/* MÉTIERS */}
      <section className="pb-24 md:pb-36">
        <div className="container-page">
          <Reveal className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="kicker mb-5 text-rouge">Nos métiers</p>
              <h2 className="h-display text-5xl text-graphite md:text-6xl">Quatre savoir-faire, une même exigence.</h2>
            </div>
            <Link href="/metiers" className="group flex items-center gap-2 text-sm text-graphite">
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
                <dd className="h-display text-6xl md:text-7xl">
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
              <h2 className="h-display text-5xl text-graphite md:text-6xl">Des chantiers, pas des images de catalogue.</h2>
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
            <h2 className="h-display text-5xl text-graphite md:text-6xl">Témoignages</h2>
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
        <h3 className="h-display text-4xl md:text-5xl">{title}</h3>
        <p className={`mt-6 max-w-lg leading-relaxed ${dark ? "text-white/70" : "text-zinc"}`}>{text}</p>
      </div>
      <span className="flex items-center gap-2 text-sm font-medium">
        {cta}
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
