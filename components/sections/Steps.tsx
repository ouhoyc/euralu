import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

/** Étapes d'intervention numérotées, apparition en cascade. */
export function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <RevealGroup as="ol" className="grid gap-px overflow-hidden rounded-2xl bg-graphite/10 md:grid-cols-2 xl:grid-cols-5">
      {steps.map((s, i) => (
        <RevealItem as="li" key={s.title} className="flex flex-col gap-4 bg-creme p-8">
          <span className="h-display text-4xl text-rouge">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="text-lg font-medium text-graphite">{s.title}</h3>
          <p className="text-sm leading-relaxed text-zinc">{s.text}</p>
        </RevealItem>
      ))}
    </RevealGroup>
  );
}
