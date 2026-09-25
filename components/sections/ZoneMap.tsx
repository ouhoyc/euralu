"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

/**
 * Carte moderne (MapLibre + fonds OpenFreeMap « Positron » : gratuits, sans compte, sans cookies).
 * Point EURALU à Saint-Clair-du-Rhône ; les villes (Lyon, Vienne…) sont nommées par le fond de carte.
 * Chargée seulement quand elle arrive à l'écran. Zoom à la molette uniquement avec Ctrl (ou deux
 * doigts sur mobile) pour ne jamais bloquer le défilement de la page.
 */
const EURALU: [number, number] = [4.7715, 45.4405];
export function ZoneMap() {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let map: import("maplibre-gl").Map | undefined;
    let cancelled = false;

    const init = async () => {
      const maplibregl = await import("maplibre-gl");
      if (cancelled) return;
      // Worker servi depuis public/ (copié par scripts/copy-maplibre-worker.mjs)
      maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
      const m = new maplibregl.Map({
        container: el,
        style: "https://tiles.openfreemap.org/styles/positron",
        bounds: [
          [4.7, 45.34],
          [4.92, 45.78],
        ],
        // Sur ordinateur, marge à gauche pour la carte d'accès posée sur la carte
        fitBoundsOptions: {
          padding: el.clientWidth >= 768 ? { top: 48, bottom: 48, left: 380, right: 48 } : 32,
        },
        cooperativeGestures: true,
        attributionControl: { compact: true },
        locale: {
          "CooperativeGesturesHandler.WindowsHelpText": "Ctrl + molette pour zoomer sur la carte",
          "CooperativeGesturesHandler.MacHelpText": "⌘ + molette pour zoomer sur la carte",
          "CooperativeGesturesHandler.MobileHelpText": "Utilisez deux doigts pour déplacer la carte",
          "NavigationControl.ZoomIn": "Zoomer",
          "NavigationControl.ZoomOut": "Dézoomer",
        },
      });
      map = m;
      m.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");

      m.on("load", () => {
        // Couleurs du fond accordées à la charte (crème, eau gris-bleu)
        if (m.getLayer("background")) m.setPaintProperty("background", "background-color", "#f4f2ee");
        if (m.getLayer("water")) m.setPaintProperty("water", "fill-color", "#cdd6de");
        // Parcs et forêts très discrets : la carte reste claire et sobre
        for (const layer of m.getStyle().layers) {
          if (layer.type === "fill" && /park|landcover|wood|forest/.test(layer.id)) {
            m.setPaintProperty(layer.id, "fill-opacity", 0.25);
          }
        }
        // Crédits OpenStreetMap repliés en petit « i » (toujours accessibles d'un clic)
        el.querySelector(".maplibregl-compact-show")?.classList.remove("maplibregl-compact-show");
        setReady(true);
      });

      // EURALU : point rouge qui pulse + étiquette
      const pin = document.createElement("div");
      pin.className = "flex items-center gap-2 font-sans";
      pin.innerHTML = `<span class="map-pulse relative block size-4 rounded-full border-2 border-white bg-rouge shadow"></span><span class="rounded-full bg-graphite px-3 py-1 text-xs font-semibold tracking-wide text-white shadow-lg">EURALU</span>`;
      new maplibregl.Marker({ element: pin, anchor: "left", offset: [-8, 0] }).setLngLat(EURALU).addTo(m);
    };

    // Chargement différé : seulement quand la carte approche de l'écran
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          init();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);

    return () => {
      cancelled = true;
      io.disconnect();
      map?.remove();
    };
  }, []);

  return (
    <div className="relative h-full w-full bg-alu-clair">
      <div ref={ref} className="h-full w-full" aria-label="Carte : EURALU à Saint-Clair-du-Rhône, au sud de Lyon et de Vienne" role="img" />
      {!ready && (
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-sm text-zinc">Chargement de la carte…</div>
      )}
    </div>
  );
}
