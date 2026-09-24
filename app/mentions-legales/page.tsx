import Link from "next/link";
import { LegalContent } from "@/components/sections/LegalContent";
import { PageHero } from "@/components/sections/PageHero";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL, company } from "@/lib/site";

export const metadata = {
  ...pageMetadata({
    title: "Mentions légales",
    description: "Mentions légales du site EURALU : éditeur, hébergeur, propriété intellectuelle.",
    path: "/mentions-legales",
  }),
  robots: { index: true, follow: true },
};

export default function MentionsLegalesPage() {
  return (
    <>
      <PageHero title="Mentions légales" crumbs={[{ href: "/mentions-legales", label: "Mentions légales" }]} />
      <LegalContent>
        <h2>Éditeur du site</h2>
        <p>
          {company.legalName}, société à responsabilité limitée au capital de [À COMPLÉTER] €
          <br />
          Siège social : {company.address.line1}, {company.address.street}, {company.address.postalCode}{" "}
          {company.address.city}
          <br />
          SIRET : {company.siret} — {company.rcs}
          <br />
          N° de TVA intracommunautaire : [À COMPLÉTER]
          <br />
          Téléphone : <a href={company.phoneHref}>{company.phone}</a> — Email :{" "}
          <a href={`mailto:${company.email}`}>{company.email}</a>
        </p>
        <p>Directeur de la publication : [À COMPLÉTER : nom du gérant]</p>

        <h2>Hébergement</h2>
        <p>
          Vercel Inc., 440 N Barranca Avenue #4133, Covina, CA 91723, États-Unis —{" "}
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            vercel.com
          </a>
        </p>

        <h2>Assurance et qualifications</h2>
        <ul>
          <li>Assurance décennale : {company.certifications.decennale}</li>
          <li>Qualification RGE : {company.certifications.rge}</li>
          <li>Qualification Qualibat : {company.certifications.qualibat}</li>
        </ul>

        <h2>Propriété intellectuelle</h2>
        <p>
          L’ensemble des contenus du site {SITE_URL.replace(/^https?:\/\//, "")} (textes, photographies, logo,
          vidéos) est la propriété de {company.legalName} ou de ses partenaires. Toute reproduction, même partielle,
          sans autorisation écrite préalable est interdite.
        </p>
        <p>
          Les photographies de la rubrique Réalisations sont des photos de chantiers réalisés par EURALU. Certaines
          séquences animées de la page d’accueil sont des illustrations créées numériquement.
        </p>

        <h2>Données personnelles</h2>
        <p>
          Le traitement des données transmises via le formulaire de contact est décrit dans notre{" "}
          <Link href="/confidentialite">politique de confidentialité</Link>.
        </p>
      </LegalContent>
    </>
  );
}
