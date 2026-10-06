import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { TerraceApple } from "@/components/labo/TerraceApple";

/**
 * PAGE DE TEST, non référencée : la toiture terrasse dans un style « page produit » (épuré, très typographique).
 * Même savoir-faire technique que l'animation du site ; seul l'habillage change.
 */
export const metadata: Metadata = {
  title: "Labo : toiture terrasse, style produit",
  robots: { index: false, follow: false },
};

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap" });

const essentials = [
  {
    title: "Pare-vapeur remonté jusqu’en haut.",
    text: "Déroulé en rouleaux sur toute la dalle, il remonte sur les acrotères jusqu’à leur sommet : la dernière sécurité sous l’isolant.",
  },
  {
    title: "Isolant à joints décalés.",
    text: "Les panneaux sont posés en quinconce, d’une rangée à l’autre, pour qu’aucun joint ne forme de pont thermique continu.",
  },
  {
    title: "Couvertines en onglet.",
    text: "Coupes à 45° dans les angles, angles parfaitement carrés : les couvertines coiffent les murs et protègent le haut des relevés.",
  },
];

export default function LaboTerrassePage() {
  return (
    <div className={`${inter.className} bg-white text-[#1d1d1f] antialiased`}>
      {/* HÉRO : grand titre centré, beaucoup d'espace */}
      <section className="px-5 pb-20 pt-36 text-center md:pb-28 md:pt-44">
        <p className="text-[17px] font-semibold tracking-[-0.01em] text-[#c22c34]">EURALU · Étanchéité</p>
        <h1 className="mx-auto mt-3 max-w-5xl text-[48px] font-bold leading-[1.04] tracking-[-0.035em] md:text-[96px]">
          Toiture terrasse.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-[21px] leading-snug tracking-[0.01em] text-[#1d1d1f] md:text-[28px]">
          Étanche. Couche après couche.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link
            href="/contact#devis"
            className="inline-flex min-h-11 items-center rounded-full bg-[#c22c34] px-6 text-[17px] text-white transition-colors hover:bg-[#a4232a]"
          >
            Demander un devis
          </Link>
          <a href="#etapes" className="text-[17px] text-[#c22c34] hover:underline">
            Voir les étapes ›
          </a>
        </div>
      </section>

      <TerraceApple />

      {/* L'ESSENTIEL : cartes arrondies, sans ombre ni bordure */}
      <section className="px-5 py-24 md:py-32">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="text-[40px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[56px]">L’essentiel.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {essentials.map((e) => (
              <div key={e.title} className="rounded-[28px] bg-[#f5f5f7] p-8 md:p-10">
                <h3 className="text-[24px] font-semibold leading-[1.15] tracking-[0.007em] md:text-[28px]">{e.title}</h3>
                <p className="mt-4 text-[17px] leading-[1.47] tracking-[-0.022em] text-[#707070]">{e.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPEL À L'ACTION : bande gris clair */}
      <section className="bg-[#f5f5f7] px-5 py-24 text-center md:py-32">
        <h2 className="mx-auto max-w-3xl text-[40px] font-bold leading-[1.05] tracking-[-0.03em] md:text-[56px]">
          Parlons de votre toiture terrasse.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[17px] text-[#707070] md:text-[21px]">Visite et devis gratuits, sans engagement.</p>
        <div className="mt-8">
          <Link
            href="/contact#devis"
            className="inline-flex min-h-11 items-center rounded-full bg-[#c22c34] px-6 text-[17px] text-white transition-colors hover:bg-[#a4232a]"
          >
            Demander un devis
          </Link>
        </div>
      </section>
    </div>
  );
}
