import type { MetadataRoute } from "next";
import { metiers } from "@/lib/metiers";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/metiers", "/realisations", "/professionnels", "/entreprise", "/contact", "/mentions-legales", "/confidentialite"];
  const now = new Date();
  return [
    ...pages.map((p) => ({
      url: `${SITE_URL}${p}`,
      lastModified: now,
      priority: p === "" ? 1 : p.startsWith("/mentions") || p.startsWith("/confid") ? 0.2 : 0.8,
    })),
    ...metiers.map((m) => ({ url: `${SITE_URL}/metiers/${m.slug}`, lastModified: now, priority: 0.9 })),
  ];
}
