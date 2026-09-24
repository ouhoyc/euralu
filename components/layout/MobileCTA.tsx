"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Phone } from "lucide-react";
import { useState } from "react";
import { company } from "@/lib/site";

/**
 * Barre d'action flottante sur mobile (appel + devis), visible après un léger défilement.
 * Masquée sur la page contact, où le formulaire est déjà là.
 */
export function MobileCTA() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setVisible(y > 480));

  if (pathname === "/contact") return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 96, opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-3 bottom-3 z-40 flex gap-2 rounded-full border border-white/10 bg-graphite/85 p-1.5 shadow-2xl backdrop-blur-xl sm:hidden"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <a
            href={company.phoneHref}
            aria-label={`Appeler EURALU au ${company.phone}`}
            className="grid size-12 shrink-0 place-items-center rounded-full bg-white/10 text-white"
          >
            <Phone aria-hidden className="size-5" />
          </a>
          <Link
            href="/contact#devis"
            className="flex flex-1 items-center justify-center rounded-full bg-rouge text-sm font-medium text-white active:scale-[0.98]"
          >
            Demander un devis
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
