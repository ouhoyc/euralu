/**
 * Scénario de l'animation « toiture terrasse » : chaque étape du chantier occupe
 * une plage de la progression du scroll (0 = début de la section, 1 = fin).
 *
 * Les textes sont volontairement génériques : à faire valider par EURALU
 * (notamment la pose de l'isolant).
 */
export type TerraceStep = {
  id: string;
  title: string;
  text: string;
  /** Plage de progression pendant laquelle l'étape s'anime. */
  from: number;
  to: number;
};

export const INTRO_END = 0.07;
export const OUTRO_START = 0.9;

export const steps: TerraceStep[] = [
  {
    id: "support",
    title: "Le support",
    text: "La dalle béton est contrôlée et nettoyée : tout commence par un support sain.",
    from: 0.07,
    to: 0.13,
  },
  {
    id: "pare-vapeur",
    title: "Le pare-vapeur",
    text: "Posé sur toute la dalle et remonté sur les acrotères, il empêche l’humidité intérieure de gagner l’isolant.",
    from: 0.13,
    to: 0.22,
  },
  {
    id: "isolant",
    title: "L’isolant",
    text: "Panneaux posés à joints serrés et décalés d’une rangée à l’autre : aucun pont thermique continu.",
    from: 0.22,
    to: 0.36,
  },
  {
    id: "membrane",
    title: "La membrane",
    text: "Les lés se déroulent et se recouvrent : l’étanchéité est continue, sans point faible.",
    from: 0.36,
    to: 0.55,
  },
  {
    id: "releves",
    title: "Les relevés",
    text: "La membrane remonte sur les acrotères : c’est aux points singuliers que tout se joue.",
    from: 0.55,
    to: 0.65,
  },
  {
    id: "couvertines",
    title: "Les couvertines",
    text: "Les couvertines en aluminium coiffent les murs et protègent le haut des relevés.",
    from: 0.65,
    to: 0.77,
  },
  {
    id: "gravillons",
    title: "La protection",
    text: "Une couche de gravillons protège la membrane des UV et des chocs.",
    from: 0.77,
    to: 0.9,
  },
];

/** Étape affichée pour une progression donnée (-1 = intro, steps.length = fin). */
export function stepIndexAt(p: number) {
  if (p < INTRO_END) return -1;
  if (p >= OUTRO_START) return steps.length;
  const i = steps.findIndex((s) => p < s.to);
  return i === -1 ? steps.length - 1 : i;
}

export const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

/** Avancement local (0 → 1) d'une plage [a, b] de la progression globale. */
export const phase = (p: number, a: number, b: number) => clamp01((p - a) / (b - a));

export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
export const easeOut = (t: number) => 1 - (1 - t) ** 3;
export const easeIn = (t: number) => t * t * t;
/** Léger dépassement puis retour : effet « clipsé en place ». */
export const easeOutBack = (t: number) => {
  const c1 = 1.4;
  const c3 = c1 + 1;
  return 1 + c3 * (t - 1) ** 3 + c1 * (t - 1) ** 2;
};

export const range = (id: string) => {
  const s = steps.find((x) => x.id === id)!;
  return [s.from, s.to] as const;
};
