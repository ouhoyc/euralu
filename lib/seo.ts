import type { Metadata } from "next";
import { SITE_URL, company, openingHours } from "./site";

/** Métadonnées complètes (title, description, canonical, Open Graph, Twitter) d'une page. */
export function pageMetadata({
  title,
  description,
  path,
  image = "/og-default.jpg",
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      siteName: company.name,
      url: path,
      title,
      description,
      images: [{ url: image, width: 1200, height: 630, alt: `${company.name} — ${title}` }],
    },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

/** Données structurées schema.org de l'entreprise (RoofingContractor = couvreur / zingueur). */
export function localBusinessJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RoofingContractor",
    "@id": `${SITE_URL}/#entreprise`,
    name: company.name,
    legalName: company.legalName,
    description:
      "Zinguerie zinc et aluminium, étanchéité de toitures terrasses, habillage de sous-faces et bandeaux, traitement de tuiles. Lyon, Isère, Rhône.",
    url: SITE_URL,
    logo: `${SITE_URL}/logo/euralu-rouge.svg`,
    image: `${SITE_URL}/og-default.jpg`,
    telephone: "+33474596376",
    email: company.email,
    foundingDate: String(company.foundingYear),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${company.address.street}, ${company.address.line1}`,
      postalCode: company.address.postalCode,
      addressLocality: company.address.city,
      addressRegion: company.address.region,
      addressCountry: company.address.country,
    },
    areaServed: company.areaServed.map((name) => ({ "@type": "Place", name })),
    openingHoursSpecification: openingHours.flatMap((d) =>
      d.slots.map(([opens, closes]) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${d.schemaDay}`,
        opens,
        closes,
      })),
    ),
    priceRange: "Devis gratuit",
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Accueil", path: "/" }, ...items].map((i, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: i.name,
      item: `${SITE_URL}${i.path}`,
    })),
  };
}
