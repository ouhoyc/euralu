import { LegalContent } from "@/components/sections/LegalContent";
import { PageHero } from "@/components/sections/PageHero";
import { pageMetadata } from "@/lib/seo";
import { company } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Politique de confidentialité",
  description: "Comment EURALU collecte et protège vos données personnelles (RGPD).",
  path: "/confidentialite",
});

export default function ConfidentialitePage() {
  return (
    <>
      <PageHero title="Politique de confidentialité" crumbs={[{ href: "/confidentialite", label: "Confidentialité" }]} />
      <LegalContent>
        <p>
          {company.legalName} attache une grande importance à la protection de vos données personnelles. Cette page
          explique quelles données nous collectons, pourquoi, et quels sont vos droits, conformément au Règlement
          général sur la protection des données (RGPD).
        </p>

        <h2>Responsable du traitement</h2>
        <p>
          {company.legalName}, {company.address.line1}, {company.address.street}, {company.address.postalCode}{" "}
          {company.address.city}. Contact : <a href={`mailto:${company.email}`}>{company.email}</a>.
        </p>

        <h2>Données collectées</h2>
        <p>Via le formulaire de demande de devis, uniquement lorsque vous l’envoyez :</p>
        <ul>
          <li>nom et prénom, téléphone, adresse email ;</li>
          <li>commune du chantier, type de travaux et description de votre projet ;</li>
          <li>votre profil (particulier ou professionnel).</li>
        </ul>

        <h2>Finalité et base légale</h2>
        <p>
          Ces données servent uniquement à traiter votre demande, vous recontacter et établir un devis. Le traitement
          repose sur votre consentement, exprimé en cochant la case prévue, et sur les mesures précontractuelles prises
          à votre demande.
        </p>

        <h2>Destinataires</h2>
        <p>
          Vos données sont destinées exclusivement à EURALU. Elles transitent par le service Web3Forms, qui transmet
          le formulaire par email, et le site est hébergé par Vercel. Elles ne sont jamais vendues ni cédées à des
          tiers.
        </p>

        <h2>Durée de conservation</h2>
        <p>
          Les demandes sans suite sont conservées au maximum 3 ans après le dernier contact. Les données des clients
          sont conservées pendant la durée de la relation commerciale puis selon les obligations légales (comptables
          notamment).
        </p>

        <h2>Vos droits</h2>
        <p>
          Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation,
          d’opposition et de portabilité de vos données, ainsi que du droit de retirer votre consentement à tout
          moment. Pour les exercer, écrivez à <a href={`mailto:${company.email}`}>{company.email}</a>. Vous pouvez
          également adresser une réclamation à la CNIL (
          <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">
            cnil.fr
          </a>
          ).
        </p>

        <h2>Cookies</h2>
        <p>
          Ce site n’utilise ni cookie publicitaire ni outil de mesure d’audience. La carte de la page Contact
          est fournie par OpenStreetMap, qui peut recevoir votre adresse IP lors de son affichage.
        </p>

        <p className="pt-6 text-sm text-zinc">Dernière mise à jour : [À COMPLÉTER : date de mise en ligne]</p>
      </LegalContent>
    </>
  );
}
