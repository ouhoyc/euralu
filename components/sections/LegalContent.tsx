import type { ReactNode } from "react";

/** Mise en forme lisible des pages juridiques (titres, paragraphes, listes). */
export function LegalContent({ children }: { children: ReactNode }) {
  return (
    <section className="py-20 md:py-28">
      <div className="container-page">
        <div className="max-w-3xl space-y-5 leading-relaxed text-graphite-2 [&_a]:underline [&_a]:underline-offset-4 [&_h2]:h-display [&_h2]:pt-8 [&_h2]:text-2xl [&_h2]:text-graphite [&_li]:ml-5 [&_li]:list-disc [&_ul]:space-y-2">
          {children}
        </div>
      </div>
    </section>
  );
}
