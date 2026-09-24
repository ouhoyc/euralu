import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";
import { CTASection } from "@/components/sections/CTASection";
import { FAQ } from "@/components/sections/FAQ";
import { Gallery } from "@/components/sections/Gallery";
import { PageHero } from "@/components/sections/PageHero";
import { Steps } from "@/components/sections/Steps";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getMetier, metiers } from "@/lib/metiers";
import { realisationsFor } from "@/lib/realisations";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

/** Les 4 pages sont générées à l'avance (pages statiques, très rapides). */
export function generateStaticParams() {
  return metiers.map((m) => ({ slug: m.slug }));
}
export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/metiers/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const m = getMetier(slug);
  if (!m) return {};
  return pageMetadata({ title: m.metaTitle, description: m.metaDescription, path: `/metiers/${m.slug}` });
}

export default async function MetierPage(props: PageProps<"/metiers/[slug]">) {
  const { slug } = await props.params;
  const m = getMetier(slug);
  if (!m) notFound();

  const photos = realisationsFor(m.category);
  const others = metiers.filter((o) => o.slug !== m.slug);

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Nos métiers", path: "/metiers" },
          { name: m.title, path: `/metiers/${m.slug}` },
        ])}
      />
      <JsonLd data={faqJsonLd(m.faq)} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: m.title,
          description: m.metaDescription,
          provider: { "@id": `${SITE_URL}/#entreprise` },
          areaServed: ["Lyon", "Rhône", "Isère", "Vienne", "Rhône-Alpes"],
        }}
      />

      <PageHero
        kicker={`${m.index} — ${m.kicker}`}
        title={m.title}
        lead={m.summary}
        image={m.cover}
        crumbs={[
          { href: "/metiers", label: "Nos métiers" },
          { href: `/metiers/${m.slug}`, label: m.shortTitle },
        ]}
      />

      {/* INTRO */}
      <section className="py-24 md:py-32">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-24">
          <Reveal className="space-y-6 text-lg leading-relaxed text-graphite-2 md:text-xl">
            {m.intro.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
            <div className="pt-4">
              <Button href="/contact#devis">Demander un devis</Button>
            </div>
          </Reveal>
          {m.cover ? (
            <Parallax strength={5} className="aspect-[4/5] rounded-2xl">
              <Image src={m.cover.src} alt={m.cover.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </Parallax>
          ) : (
            <Reveal className="flex aspect-[4/5] items-end rounded-2xl bg-graphite p-10 text-white">
              <p className="h-display text-4xl">
                Inspection, nettoyage, traitement : une couverture qui retrouve sa teinte et sa protection.
              </p>
            </Reveal>
          )}
        </div>
      </section>

      {/* SAVOIR-FAIRE */}
      <section className="bg-graphite py-24 text-white md:py-32">
        <div className="container-page">
          <Reveal className="mb-16 max-w-3xl">
            <p className="kicker mb-5 text-rouge-clair">Savoir-faire</p>
            <h2 className="h-display text-5xl md:text-6xl">Ce qui fait la différence.</h2>
          </Reveal>
          <RevealGroup className="grid gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-2">
            {m.savoirFaire.map((s) => (
              <RevealItem key={s.title} className="bg-graphite p-8 md:p-12">
                <h3 className="h-display text-3xl">{s.title}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-white/70">{s.text}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </section>

      {/* ÉTAPES */}
      <section className="py-24 md:py-32">
        <div className="container-page">
          <Reveal className="mb-16 max-w-3xl">
            <p className="kicker mb-5 text-rouge">Déroulement</p>
            <h2 className="h-display text-5xl text-graphite md:text-6xl">Les étapes de l’intervention.</h2>
          </Reveal>
          <Steps steps={m.steps} />
        </div>
      </section>

      {/* GALERIE (uniquement de vraies photos) */}
      {photos.length > 0 && (
        <section className="pb-24 md:pb-32">
          <div className="container-page">
            <Reveal className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="kicker mb-5 text-rouge">Réalisations</p>
                <h2 className="h-display text-5xl text-graphite md:text-6xl">Sur nos chantiers.</h2>
              </div>
              <Button href="/realisations" variant="outline-dark">
                Toutes les réalisations
              </Button>
            </Reveal>
            <Gallery items={photos} showFilters={false} />
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="pb-24 md:pb-32">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <Reveal>
            <p className="kicker mb-5 text-rouge">Questions fréquentes</p>
            <h2 className="h-display text-5xl text-graphite md:text-6xl">Vos questions.</h2>
          </Reveal>
          <FAQ items={m.faq} />
        </div>
      </section>

      {/* AUTRES MÉTIERS */}
      <section className="border-t border-graphite/10 py-16">
        <div className="container-page">
          <p className="kicker mb-8 text-zinc">Nos autres métiers</p>
          <ul className="grid gap-4 md:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/metiers/${o.slug}`}
                  className="group flex items-center justify-between border-b border-graphite/15 py-4 text-graphite"
                >
                  <span className="h-display text-2xl">{o.title}</span>
                  <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CTASection title="Parlons de votre projet." />
    </>
  );
}
