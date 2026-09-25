// Copie le « worker » de MapLibre (calculs de la carte en arrière-plan) dans public/,
// car Next ne l'empaquette pas correctement. Lancé automatiquement avant dev et build.
import { cpSync, mkdirSync } from "node:fs";

const src = "node_modules/maplibre-gl/dist";
const dest = "public/maplibre";
mkdirSync(dest, { recursive: true });
for (const f of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) cpSync(`${src}/${f}`, `${dest}/${f}`);
