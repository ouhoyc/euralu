import data from "./realisations.generated.json";
import type { GalleryCategory } from "./metiers";

/**
 * Photos de chantier (vraies photos uniquement, jamais d'images IA).
 * Le fichier JSON est généré par `python3 scripts/prepare-photos.py`.
 */
export type Realisation = {
  metier: GalleryCategory;
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const realisations = data as Realisation[];

export function realisationsFor(category: GalleryCategory) {
  return realisations.filter((r) => r.metier === category);
}
