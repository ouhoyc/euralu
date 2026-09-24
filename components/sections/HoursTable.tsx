import { formatHour, openingHours } from "@/lib/site";

/** Tableau des horaires d'ouverture. `tone` adapte les couleurs au fond. */
export function HoursTable({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const muted = tone === "dark" ? "text-zinc-clair" : "text-zinc";
  const line = tone === "dark" ? "border-white/10" : "border-graphite/10";
  return (
    <table className="w-full text-sm">
      <caption className="sr-only">Horaires d’ouverture</caption>
      <tbody>
        {openingHours.map((d) => (
          <tr key={d.day} className={`border-b ${line} last:border-0`}>
            <th scope="row" className="py-2 pr-4 text-left font-normal">
              {d.day}
            </th>
            <td className={`py-2 text-right tabular-nums ${d.slots.length ? "" : muted}`}>
              {d.slots.length
                ? d.slots.map(([a, b]) => `${formatHour(a)} – ${formatHour(b)}`).join(" · ")
                : "Fermé"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
