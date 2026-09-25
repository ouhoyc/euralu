import { reassurance } from "@/lib/site";

/**
 * Bandeau de réassurance.
 * Mobile : une seule ligne qui défile doucement (pause au toucher, arrêt si le visiteur
 * préfère réduire les animations). Ordinateur : liste fixe sur une ligne.
 */
export function ReassuranceBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  const styles = tone === "light" ? "bg-creme text-graphite border-graphite/10" : "bg-graphite text-white border-white/10";
  const loop = (copy: boolean) =>
    reassurance.map((item) => (
      <li key={item} aria-hidden={copy || undefined} className="flex shrink-0 items-center gap-8 pr-8">
        <span className="kicker whitespace-nowrap">{item}</span>
        <span aria-hidden className="size-1 rounded-full bg-rouge" />
      </li>
    ));
  return (
    <section aria-label="Nos engagements" className={`overflow-hidden border-y py-5 ${styles}`}>
      {/* Mobile : défilement continu (la liste est doublée pour boucler sans saut) */}
      <ul className="marquee flex w-max md:hidden">
        {loop(false)}
        {loop(true)}
      </ul>
      {/* Ordinateur : fixe */}
      <ul className="container-page hidden items-center justify-between gap-8 md:flex">
        {reassurance.map((item, i) => (
          <li key={item} className="flex items-center gap-8">
            {i > 0 && <span aria-hidden className="size-1 rounded-full bg-rouge" />}
            <span className="kicker whitespace-nowrap">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
