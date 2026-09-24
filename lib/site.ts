/**
 * Informations de l'entreprise : source unique utilisée par tout le site
 * (header, footer, contact, mentions légales, schema.org…).
 * Toute valeur marquée [À COMPLÉTER] doit être renseignée avant la mise en ligne.
 */

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.euralu.fr").replace(/\/$/, "");

export const company = {
  name: "EURALU",
  legalName: "SARL EURALU",
  tagline: "Zinguerie, étanchéité et habillage de toiture",
  foundingYear: 2005,
  siret: "483 255 204 00024",
  rcs: "RCS Vienne",
  phone: "04 74 59 63 76",
  phoneHref: "tel:+33474596376",
  email: "euralu@wanadoo.fr",
  address: {
    line1: "ZA de Varambon",
    street: "179 rue Marius Feuillet",
    postalCode: "38370",
    city: "Saint-Clair-du-Rhône",
    region: "Auvergne-Rhône-Alpes",
    country: "FR",
  },
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("EURALU 179 rue Marius Feuillet 38370 Saint-Clair-du-Rhône"),
  areaServed: [
    "Lyon et son agglomération",
    "Rhône",
    "Isère",
    "Vienne",
    "Saint-Clair-du-Rhône",
    "Rhône-Alpes",
  ],
  certifications: {
    decennale: "[À COMPLÉTER : assureur et n° de contrat]",
    rge: "[À COMPLÉTER : n° de certificat RGE]",
    qualibat: "[À COMPLÉTER : n° de certificat Qualibat]",
  },
} as const;

/** Nombre d'années d'expérience, calculé automatiquement. */
export const yearsOfExperience = new Date().getFullYear() - company.foundingYear;

/** Horaires d'ouverture (affichage + schema.org). */
export const openingHours = [
  { day: "Lundi", schemaDay: "Monday", slots: [["08:30", "12:00"], ["13:30", "16:30"]] },
  { day: "Mardi", schemaDay: "Tuesday", slots: [["08:30", "12:00"], ["13:30", "16:30"]] },
  { day: "Mercredi", schemaDay: "Wednesday", slots: [["08:30", "12:00"], ["13:30", "16:00"]] },
  { day: "Jeudi", schemaDay: "Thursday", slots: [["08:00", "12:00"], ["13:30", "16:30"]] },
  { day: "Vendredi", schemaDay: "Friday", slots: [["08:00", "12:00"]] },
  { day: "Samedi", schemaDay: "Saturday", slots: [] },
  { day: "Dimanche", schemaDay: "Sunday", slots: [] },
] as const;

/** "08:30" → "8h30" */
export function formatHour(h: string) {
  const [hh, mm] = h.split(":");
  return `${Number(hh)}h${mm === "00" ? "" : mm}`;
}

export const mainNav = [
  { href: "/metiers", label: "Nos métiers" },
  { href: "/realisations", label: "Réalisations" },
  { href: "/professionnels", label: "Professionnels" },
  { href: "/entreprise", label: "L’entreprise" },
  { href: "/contact", label: "Contact" },
] as const;

export const reassurance = ["Garantie décennale", "RGE", "Qualibat", "Depuis 2005", "Devis gratuit"] as const;
