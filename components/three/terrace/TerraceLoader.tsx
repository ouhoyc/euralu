"use client";

import dynamic from "next/dynamic";

/**
 * Charge l'animation 3D (et GSAP) uniquement sur les pages qui l'affichent :
 * le code n'est téléchargé que lorsque le composant est réellement rendu.
 * Le texte d'introduction reste rendu côté serveur (h1 visible pour Google).
 */
export const TerraceExperience = dynamic(() => {
  // La scène 3D (le plus lourd) est téléchargée en même temps, sans attendre
  void import("./TerraceScene");
  return import("./TerraceExperience").then((mod) => mod.TerraceExperience);
});
