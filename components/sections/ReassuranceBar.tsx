import { reassurance } from "@/lib/site";

/**
 * Bandeau de réassurance défilant en continu (CSS uniquement, pas de JavaScript).
 * Le texte est doublé pour une boucle sans à-coup ; la copie est masquée aux lecteurs d'écran.
 * Défilement stoppé si l'utilisateur préfère réduire les animations.
 */
export function ReassuranceBar({ tone = "light" }: { tone?: "light" | "dark" }) {
  const styles = tone === "light" ? "bg-creme text-graphite border-graphite/10" : "bg-graphite text-white border-white/10";
  const row = (hidden?: boolean) => (
    <ul aria-hidden={hidden} className="flex shrink-0 items-center">
      {reassurance.map((item) => (
        <li key={item} className="flex items-center">
          <span className="kicker whitespace-nowrap px-8 md:px-12">{item}</span>
          <span aria-hidden className="size-1 rounded-full bg-rouge" />
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label="Nos engagements" className={`overflow-hidden border-y py-5 ${styles}`}>
      <div className="flex w-max animate-[marquee_40s_linear_infinite] motion-reduce:animate-none">
        {row()}
        {row(true)}
      </div>
    </section>
  );
}
