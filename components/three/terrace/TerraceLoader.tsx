"use client";

import dynamic from "next/dynamic";

/**
 * Charge l'animation 3D (et GSAP) uniquement sur les pages qui l'affichent :
 * le code n'est téléchargé que lorsque le composant est réellement rendu.
 * Le texte d'introduction reste rendu côté serveur (h1 visible pour Google).
 */
export const TerraceExperience = dynamic(() => import("./TerraceExperience").then((mod) => mod.TerraceExperience));
