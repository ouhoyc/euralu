"use client";

import { EffectComposer, N8AO, SMAA, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";

/**
 * Post-traitement (ordinateur uniquement, chargé à part) : occlusion ambiante
 * (ombres douces dans les angles), anti-crénelage, rendu cinéma, vignettage.
 */
export default function Effects() {
  return (
    <EffectComposer multisampling={0} enableNormalPass={false}>
      <N8AO aoRadius={1.1} distanceFalloff={1} intensity={2.4} quality="medium" halfRes />
      <SMAA />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.3} darkness={0.35} />
    </EffectComposer>
  );
}
