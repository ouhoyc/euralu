import { reassurance } from "@/lib/site";

/**
 * Bandeau de réassurance : liste fixe et sobre (pas de défilement automatique,
 * conforme aux règles d'accessibilité sur les contenus en mouvement).
 */
export function ReassuranceBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  const styles = tone === "light" ? "bg-creme text-graphite border-graphite/10" : "bg-graphite text-white border-white/10";
  return (
    <section aria-label="Nos engagements" className={`border-y py-5 ${styles}`}>
      <ul className="container-page flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-between">
        {reassurance.map((item, i) => (
          <li key={item} className="flex items-center gap-8">
            {i > 0 && <span aria-hidden className="hidden size-1 rounded-full bg-rouge md:block" />}
            <span className="kicker whitespace-nowrap">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
