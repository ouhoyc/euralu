import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

type Variant = "primary" | "outline-light" | "outline-dark" | "ghost-light";

const variants: Record<Variant, string> = {
  primary: "bg-rouge text-white hover:bg-rouge-fonce",
  "outline-light": "border border-white/35 text-white hover:border-white hover:bg-white/10",
  "outline-dark": "border border-graphite/25 text-graphite hover:border-graphite hover:bg-graphite hover:text-white",
  "ghost-light": "text-white/85 hover:text-white",
};

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  /** Affiche une flèche qui glisse au survol. */
  arrow?: boolean;
  className?: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">;

/**
 * Bouton-lien du site. Micro-interaction : léger enfoncement au clic
 * et flèche qui glisse au survol (transform uniquement).
 */
export function Button({ href, children, variant = "primary", arrow = true, className = "", ...rest }: Props) {
  const external = href.startsWith("tel:") || href.startsWith("mailto:") || href.startsWith("http");
  const classes = `group inline-flex min-h-12 items-center justify-center gap-3 rounded-full px-6 text-sm font-medium tracking-wide transition-[background-color,border-color,color,transform] duration-300 ease-premium active:scale-[0.97] ${variants[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <ArrowRight
          aria-hidden
          className="size-4 transition-transform duration-300 ease-premium group-hover:translate-x-1"
        />
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={classes} {...rest}>
      {content}
    </Link>
  );
}
