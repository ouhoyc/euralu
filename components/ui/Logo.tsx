import Image from "next/image";

/** Logo EURALU vectoriel. `tone` choisit la version (rouge sur fond clair, blanche sur fond sombre). */
export function Logo({ tone = "blanc", className = "" }: { tone?: "blanc" | "rouge"; className?: string }) {
  return (
    <Image
      src={`/logo/euralu-${tone}.svg`}
      alt="EURALU zinguerie"
      width={2332}
      height={1336}
      unoptimized
      className={`h-auto ${className}`}
    />
  );
}
