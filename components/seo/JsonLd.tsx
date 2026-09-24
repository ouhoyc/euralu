/**
 * Insère des données structurées schema.org (JSON-LD).
 * Les "<" sont échappés pour empêcher toute injection de balise.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
