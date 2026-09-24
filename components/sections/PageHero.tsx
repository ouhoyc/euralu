import Image from "next/image";
import Link from "next/link";

type Crumb = { href: string; label: string };

/**
 * En-tête sombre des pages intérieures : fil d'Ariane, surtitre, grand titre,
 * image de fond optionnelle (vraie photo) assombrie.
 */
export function PageHero({
  kicker,
  title,
  lead,
  crumbs = [],
  image,
}: {
  kicker?: string;
  title: string;
  lead?: string;
  crumbs?: Crumb[];
  image?: { src: string; alt: string };
}) {
  return (
    <section className="relative isolate overflow-hidden bg-graphite pb-16 pt-36 text-white md:pb-24 md:pt-48">
      {image && (
        <>
          <Image
            src={image.src}
            alt={image.alt}
            fill
            preload
            sizes="100vw"
            className="-z-20 scale-105 object-cover opacity-45"
          />
          <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-graphite via-graphite/70 to-graphite/40" />
        </>
      )}
      <div className="container-page">
        {crumbs.length > 0 && (
          <nav aria-label="Fil d’Ariane" className="mb-10 text-xs text-zinc-clair">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Accueil
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {i === crumbs.length - 1 ? (
                    <span aria-current="page" className="text-white/90">
                      {c.label}
                    </span>
                  ) : (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="animate-rise">
          {kicker && <p className="kicker mb-6 text-rouge-clair">{kicker}</p>}
          <h1 className="h-display max-w-5xl text-5xl md:text-7xl xl:text-8xl">{title}</h1>
          {lead && <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/75 md:text-xl">{lead}</p>}
        </div>
      </div>
    </section>
  );
}
