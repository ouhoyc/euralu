import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Metier } from "@/lib/metiers";

/** Carte métier : photo qui zoome lentement au survol, titre en surimpression. */
export function MetierCard({ metier, priority = false }: { metier: Metier; priority?: boolean }) {
  return (
    <Link
      href={`/metiers/${metier.slug}`}
      className="group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl bg-graphite-2 p-7 text-white md:p-9"
    >
      {metier.cover ? (
        <Image
          src={metier.cover.src}
          alt={metier.cover.alt}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
          preload={priority}
          className="object-cover transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.06]"
        />
      ) : (
        /* Pas encore de photo réelle : motif graphique sobre (jamais d'image IA ici) */
        <div
          aria-hidden
          className="absolute inset-0 bg-[repeating-linear-gradient(135deg,transparent_0_22px,rgba(255,255,255,0.035)_22px_23px)] transition-transform duration-[1400ms] ease-premium group-hover:scale-[1.06]"
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-graphite via-graphite/35 to-transparent" />
      <div className="relative">
        <span className="kicker text-white/60">{metier.index}</span>
        <h3 className="h-display mt-3 text-2xl md:text-3xl">{metier.title}</h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">{metier.summary}</p>
      </div>
      <span
        aria-hidden
        className="absolute right-6 top-6 grid size-11 place-items-center rounded-full border border-white/25 transition-[background-color,border-color,transform] duration-500 ease-premium group-hover:rotate-45 group-hover:border-rouge group-hover:bg-rouge"
      >
        <ArrowUpRight className="size-5" />
      </span>
    </Link>
  );
}
