import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { ContactForm } from "@/components/sections/ContactForm";
import { HoursTable } from "@/components/sections/HoursTable";
import { PageHero } from "@/components/sections/PageHero";
import { ZoneMap } from "@/components/sections/ZoneMap";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { company } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Contact et devis gratuit",
  description:
    "Demandez un devis gratuit à EURALU : zinguerie, étanchéité de toiture terrasse, sous-faces, traitement de tuiles. 04 74 59 63 76, Saint-Clair-du-Rhône (38).",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Contact", path: "/contact" }])} />
      <PageHero
        kicker="Contact"
        title="Parlons de votre toiture."
        lead="Décrivez votre projet : nous vous rappelons pour convenir d’une visite. Le devis est gratuit et sans engagement."
        crumbs={[{ href: "/contact", label: "Contact" }]}
      />

      <section id="devis" className="scroll-mt-20 py-20 md:py-28">
        <div className="container-page grid gap-16 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
          <Reveal>
            <h2 className="h-display mb-10 text-3xl text-graphite md:text-4xl">Demande de devis</h2>
            <ContactForm />
          </Reveal>

          <Reveal delay={0.1} className="space-y-10">
            <div className="space-y-5">
              <h2 className="h-display text-3xl text-graphite">Coordonnées</h2>
              <a href={company.phoneHref} className="flex items-center gap-4 text-2xl text-graphite hover:text-rouge">
                <Phone className="size-5 text-rouge" aria-hidden /> {company.phone}
              </a>
              <a href={`mailto:${company.email}`} className="flex items-center gap-4 text-graphite hover:text-rouge">
                <Mail className="size-5 text-rouge" aria-hidden /> {company.email}
              </a>
              <address className="flex gap-4 not-italic text-graphite">
                <MapPin className="mt-1 size-5 shrink-0 text-rouge" aria-hidden />
                <span>
                  {company.legalName}
                  <br />
                  {company.address.line1}
                  <br />
                  {company.address.street}
                  <br />
                  {company.address.postalCode} {company.address.city}
                </span>
              </address>
            </div>
            <div>
              <h2 className="h-display mb-4 text-3xl text-graphite">Horaires</h2>
              <HoursTable tone="light" />
            </div>
            <p className="text-sm leading-relaxed text-zinc">
              Zone d’intervention : Lyon et son agglomération, le Rhône, l’Isère, le secteur de Vienne et
              l’ensemble de la région Rhône-Alpes.
            </p>
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="acces" className="pb-24">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-2xl border border-graphite/10">
            <div className="h-[380px] md:h-[520px]">
              <ZoneMap />
            </div>
            {/* Carte d'accès : posée sur la carte sur ordinateur, en dessous sur mobile */}
            <div className="border-t border-graphite/10 bg-blanc p-6 md:absolute md:left-6 md:top-6 md:w-80 md:rounded-xl md:border md:shadow-xl md:shadow-graphite/10">
              <p className="kicker mb-3 text-rouge">Nous trouver</p>
              <h2 id="acces" className="h-display text-2xl text-graphite">
                {company.address.city}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-zinc">
                {company.address.street}, {company.address.postalCode}. Entre Lyon et Vienne, au cœur de notre zone
                d’intervention.
              </p>
              <a
                href={company.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-graphite px-5 text-sm font-medium text-white transition-colors hover:bg-rouge"
              >
                <MapPin className="size-4" aria-hidden /> Itinéraire
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
