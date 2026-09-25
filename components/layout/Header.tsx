"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, Phone, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { Logo } from "@/components/ui/Logo";
import { company, mainNav } from "@/lib/site";

/**
 * En-tête fixe : transparent en haut de page, puis réduit et translucide (verre dépoli)
 * dès que l'on fait défiler. Toutes les pages commencent par un fond sombre,
 * le texte reste donc toujours blanc.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  // Le menu mobile mémorise la page où il a été ouvert : il se referme donc tout seul
  // dès que l'on navigue vers une autre page.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (value: boolean) => setOpenOn(value ? pathname : null);
  const headerRef = useRef<HTMLElement>(null);

  // Menu mobile ouvert : le clavier reste dans l'en-tête et arrive sur le premier lien du menu
  useFocusTrap(headerRef, open, { initialFocus: false });
  useEffect(() => {
    if (open) document.querySelector<HTMLElement>("#menu-mobile a")?.focus();
  }, [open]);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 24));

  // Bloque le défilement de la page quand le menu mobile est ouvert, Échap pour fermer
  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenOn(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header ref={headerRef} className="fixed inset-x-0 top-0 z-50">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-graphite"
      >
        Aller au contenu
      </a>
      <div
        className={`transition-[background-color,backdrop-filter,border-color] duration-500 ease-premium ${
          scrolled || open
            ? "border-b border-white/10 bg-graphite/75 backdrop-blur-xl backdrop-saturate-150"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <div
          className={`container-page flex items-center justify-between gap-6 transition-[height] duration-500 ease-premium ${
            scrolled ? "h-16" : "h-20 md:h-24"
          }`}
        >
          <Link href="/" aria-label="EURALU, retour à l’accueil" className="shrink-0">
            <Logo
              tone="blanc"
              className={`transition-[width] duration-500 ease-premium ${scrolled ? "w-[84px]" : "w-[104px] md:w-[120px]"}`}
            />
          </Link>

          <nav aria-label="Navigation principale" className="hidden lg:block">
            <ul className="flex items-center gap-6 xl:gap-8">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="group relative whitespace-nowrap py-2 text-sm text-white/80 transition-colors hover:text-white aria-[current=page]:text-white"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-rouge-clair transition-transform duration-500 ease-premium group-hover:scale-x-100 group-aria-[current=page]:scale-x-100"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 md:gap-4">
            <a
              href={company.phoneHref}
              className="hidden min-h-11 items-center gap-2 whitespace-nowrap text-sm text-white/80 transition-colors hover:text-white md:flex lg:hidden xl:flex"
            >
              <Phone aria-hidden className="size-4" />
              {company.phone}
            </a>
            <Link
              href="/contact#devis"
              className="hidden min-h-11 items-center whitespace-nowrap rounded-full bg-rouge px-5 text-sm font-medium text-white transition-[background-color,transform] duration-300 hover:bg-rouge-fonce active:scale-[0.97] sm:inline-flex"
            >
              Demander un devis
            </Link>
            <button
              type="button"
              onClick={() => setOpen(!open)}
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
              className="grid size-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10 lg:hidden"
            >
              {open ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="menu-mobile"
            aria-label="Menu mobile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-graphite lg:hidden"
          >
            <motion.ul
              className="container-page flex flex-col py-8"
              initial="hidden"
              animate="show"
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } } }}
            >
              {[{ href: "/", label: "Accueil" }, ...mainNav].map((item) => (
                <motion.li
                  key={item.href}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  className="border-b border-white/10"
                >
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="h-display block py-5 text-3xl text-white aria-[current=page]:text-rouge-clair"
                  >
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </motion.ul>
            <div className="container-page flex flex-col gap-3 pb-10">
              <Link
                href="/contact#devis"
                className="flex min-h-12 items-center justify-center rounded-full bg-rouge text-white"
              >
                Demander un devis
              </Link>
              <a
                href={company.phoneHref}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-white/25 text-white"
              >
                <Phone aria-hidden className="size-4" /> {company.phone}
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
