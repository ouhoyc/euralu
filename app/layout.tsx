import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { Providers } from "@/components/motion/Providers";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";
import { SITE_URL, company } from "@/lib/site";
import "./globals.css";

// Titres : serif display élégante. Texte : sans-serif très lisible.
const display = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});
const sans = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });

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
    <html lang="fr" className={`${display.variable} ${sans.variable} antialiased`}>
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
