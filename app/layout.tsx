import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { Providers } from "@/components/motion/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";
import { SITE_URL, company } from "@/lib/site";
import "./globals.css";

// Une seule famille, droite et sobre (comme la signalétique du bâtiment) :
// Montserrat pour les titres (graisse 600) et pour le texte courant.
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "EURALU — Zinguerie, étanchéité et sous-faces à Lyon et en Rhône-Alpes",
    template: "%s | EURALU",
  },
  description:
    "Depuis 2005, EURALU pose gouttières zinc et alu, étanchéité de toitures terrasses et habillages de sous-faces PVC à Lyon, en Isère et dans le Rhône. Décennale, RGE, Qualibat.",
  applicationName: company.name,
  formatDetection: { telephone: true },
  openGraph: { locale: "fr_FR", siteName: company.name, type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#16181b",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${montserrat.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd data={localBusinessJsonLd()} />
        <Providers>
          <Header />
          <main id="contenu" className="flex-1">
            {children}
          </main>
          <Footer />
          <MobileCTA />
        </Providers>
      </body>
    </html>
  );
}
