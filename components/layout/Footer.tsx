import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { HoursTable } from "@/components/sections/HoursTable";
import { metiers } from "@/lib/metiers";
import { company, mainNav } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-graphite pb-28 pt-20 text-white/85 sm:pb-12">
      <div className="container-page">
        <div className="grid gap-14 md:grid-cols-2 xl:grid-cols-[1.3fr_1fr_1fr_1.3fr]">
          <div className="space-y-6">
            <Logo tone="blanc" className="w-36" />
            <p className="max-w-xs text-sm leading-relaxed text-zinc-clair">
              Zinguerie, étanchéité de toitures terrasses, habillage de sous-faces et traitement de tuiles.
              Rhône-Alpes, depuis {company.foundingYear}.
            </p>
            <p className="text-sm text-zinc-clair">Décennale · RGE · Qualibat</p>
          </div>

          <nav aria-label="Nos métiers">
            <h2 className="kicker mb-5 text-zinc-clair">Nos métiers</h2>
            <ul className="space-y-1 text-sm">
              {metiers.map((m) => (
                <li key={m.slug}>
                  <Link href={`/metiers/${m.slug}`} className="inline-block py-1.5 transition-colors hover:text-white">
                    {m.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Pied de page">
            <h2 className="kicker mb-5 text-zinc-clair">EURALU</h2>
            <ul className="space-y-1 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-block py-1.5 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-6">
            <h2 className="kicker text-zinc-clair">Nous joindre</h2>
            <address className="space-y-1 text-sm not-italic leading-relaxed">
              <p>{company.address.line1}</p>
              <p>{company.address.street}</p>
              <p>
                {company.address.postalCode} {company.address.city}
              </p>
              <p className="pt-3">
                <a href={company.phoneHref} className="inline-block py-1.5 text-lg text-white hover:text-rouge-clair">
                  {company.phone}
                </a>
              </p>
              <p>
                <a href={`mailto:${company.email}`} className="inline-block py-1.5 hover:text-white">
                  {company.email}
                </a>
              </p>
            </address>
            <HoursTable tone="dark" />
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 text-xs text-zinc-clair md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {company.legalName}. SIRET {company.siret}, {company.rcs}.
          </p>
          <ul className="flex gap-6">
            <li>
              <Link href="/mentions-legales" className="inline-block py-2 hover:text-white">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="inline-block py-2 hover:text-white">
                Confidentialité
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
