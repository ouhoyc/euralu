"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { metiers } from "@/lib/metiers";
import { company } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "error";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

/**
 * Formulaire de demande de devis, envoyé par Web3Forms (https://web3forms.com)
 * vers l'adresse email associée à la clé NEXT_PUBLIC_WEB3FORMS_KEY.
 * Consentement RGPD obligatoire, champ anti-robot invisible (botcheck).
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (!ACCESS_KEY) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: `Demande de devis — ${data.nom} (${data.profil})`,
          from_name: "Site EURALU",
          ...data,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div role="status" className="flex flex-col items-start gap-6 rounded-2xl bg-graphite p-10 text-white">
        <span className="grid size-14 place-items-center rounded-full bg-rouge">
          <Check className="size-7" aria-hidden />
        </span>
        <h3 className="h-display text-4xl">Merci, votre demande est bien envoyée.</h3>
        <p className="text-white/70">
          Nous revenons vers vous rapidement. Pour une question urgente : {" "}
          <a href={company.phoneHref} className="underline underline-offset-4">
            {company.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  const field =
    "peer w-full rounded-xl border border-graphite/15 bg-blanc px-4 pb-3 pt-6 text-graphite outline-none transition-colors placeholder:text-transparent focus:border-graphite";
  const label =
    "pointer-events-none absolute left-4 top-2 text-xs text-zinc transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs";

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2" noValidate={false}>
      {/* Anti-robot : champ invisible que seuls les robots remplissent */}
      <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" />

      <fieldset className="md:col-span-2">
        <legend className="mb-3 text-sm text-zinc">Vous êtes</legend>
        <div className="flex flex-wrap gap-3">
          {["Particulier", "Professionnel (constructeur, lotisseur…)"].map((p, i) => (
            <label
              key={p}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-graphite/15 px-5 text-sm has-[:checked]:border-graphite has-[:checked]:bg-graphite has-[:checked]:text-white"
            >
              <input type="radio" name="profil" value={p} defaultChecked={i === 0} className="sr-only" />
              {p}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="relative">
        <input id="nom" name="nom" required autoComplete="name" placeholder="Nom" className={field} />
        <label htmlFor="nom" className={label}>
          Nom et prénom *
        </label>
      </div>
      <div className="relative">
        <input id="tel" name="telephone" type="tel" required autoComplete="tel" placeholder="Téléphone" className={field} />
        <label htmlFor="tel" className={label}>
          Téléphone *
        </label>
      </div>
      <div className="relative">
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="Email" className={field} />
        <label htmlFor="email" className={label}>
          Email *
        </label>
      </div>
      <div className="relative">
        <input id="commune" name="commune" autoComplete="address-level2" placeholder="Commune" className={field} />
        <label htmlFor="commune" className={label}>
          Commune du chantier
        </label>
      </div>

      <div className="relative md:col-span-2">
        <select id="metier" name="metier" defaultValue="" className={`${field} appearance-none`}>
          <option value="">Je ne sais pas encore / plusieurs</option>
          {metiers.map((m) => (
            <option key={m.slug} value={m.title}>
              {m.title}
            </option>
          ))}
        </select>
        <label htmlFor="metier" className="pointer-events-none absolute left-4 top-2 text-xs text-zinc">
          Type de travaux
        </label>
      </div>

      <div className="relative md:col-span-2">
        <textarea id="message" name="message" required rows={5} placeholder="Votre projet" className={`${field} resize-y`} />
        <label htmlFor="message" className={label}>
          Votre projet *
        </label>
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-zinc md:col-span-2">
        <input type="checkbox" name="consentement" value="oui" required className="mt-1 size-4 shrink-0 accent-rouge" />
        <span>
          J’accepte que mes données soient utilisées par EURALU pour traiter ma demande de devis et me recontacter.
          Elles ne sont jamais cédées à des tiers. Voir notre{" "}
          <Link href="/confidentialite" className="text-graphite underline underline-offset-4">
            politique de confidentialité
          </Link>
          . *
        </span>
      </label>

      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-zinc">* Champs obligatoires</p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-rouge px-8 text-sm font-medium text-white transition-[background-color,transform] duration-300 hover:bg-rouge-fonce active:scale-[0.97] disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Envoi en cours…
            </>
          ) : (
            <>
              Envoyer ma demande
              <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <p role="alert" className="rounded-xl bg-rouge/10 p-4 text-sm text-rouge-fonce md:col-span-2">
          L’envoi n’a pas fonctionné. Vous pouvez nous appeler au{" "}
          <a href={company.phoneHref} className="underline">
            {company.phone}
          </a>{" "}
          ou écrire à{" "}
          <a href={`mailto:${company.email}`} className="underline">
            {company.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
