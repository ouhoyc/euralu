"use client";

import Link from "next/link";
import { useState, type FocusEvent, type FormEvent } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { metiers } from "@/lib/metiers";
import { company } from "@/lib/site";

type Status = "idle" | "sending" | "success" | "error";

const ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

type Errors = Partial<
  Record<"nom" | "telephone" | "email" | "message" | "consentement", string>
>;

/** Messages d'erreur en français : la cause et comment la corriger. */
function validateField(
  el: HTMLInputElement | HTMLTextAreaElement,
): string | undefined {
  const value = el.value.trim();
  switch (el.name) {
    case "nom":
      return value
        ? undefined
        : "Indiquez votre nom pour que nous sachions qui rappeler.";
    case "telephone":
      if (!value)
        return "Indiquez un numéro de téléphone pour que nous puissions vous rappeler.";
      return value.replace(/\D/g, "").length >= 10
        ? undefined
        : "Ce numéro semble incomplet : 10 chiffres attendus, par exemple 06 12 34 56 78.";
    case "email":
      if (!value)
        return "Indiquez votre adresse email pour recevoir notre réponse.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? undefined
        : "Cette adresse email semble incorrecte, par exemple nom@exemple.fr.";
    case "message":
      return value
        ? undefined
        : "Décrivez en quelques mots votre projet (type de travaux, surface, délai…).";
    case "consentement":
      return (el as HTMLInputElement).checked
        ? undefined
        : "Cochez cette case pour que nous puissions traiter votre demande.";
  }
}

const VALIDATED = [
  "nom",
  "telephone",
  "email",
  "message",
  "consentement",
] as const;

/**
 * Formulaire de demande de devis, envoyé par Web3Forms (https://web3forms.com)
 * vers l'adresse email associée à la clé NEXT_PUBLIC_WEB3FORMS_KEY.
 * Consentement RGPD obligatoire, champ anti-robot invisible (botcheck).
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Errors>({});

  // Vérification d'un champ quand on le quitte (pas à chaque frappe)
  const onBlur = (e: FocusEvent<HTMLFormElement>) => {
    const el = e.target as unknown as HTMLInputElement;
    if (!VALIDATED.includes(el.name as (typeof VALIDATED)[number])) return;
    if (el.name === "consentement" && !errors.consentement) return;
    setErrors((prev) => ({ ...prev, [el.name]: validateField(el) }));
  };

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    // Vérification de tous les champs ; en cas d'erreur, le curseur va sur le premier champ à corriger
    const found: Errors = {};
    for (const name of VALIDATED) {
      const el = form.elements.namedItem(name) as HTMLInputElement | null;
      const msg = el ? validateField(el) : undefined;
      if (msg) found[name] = msg;
    }
    setErrors(found);
    const firstInvalid = VALIDATED.find((n) => found[n]);
    if (firstInvalid) {
      (form.elements.namedItem(firstInvalid) as HTMLElement | null)?.focus();
      return;
    }
    if (!ACCESS_KEY) {
      setStatus("error");
      return;
    }
    setStatus("sending");
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
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
      <div
        role="status"
        className="flex flex-col items-start gap-6 rounded-2xl bg-graphite p-10 text-white"
      >
        <span className="grid size-14 place-items-center rounded-full bg-rouge">
          <Check className="size-7" aria-hidden />
        </span>
        <h3 className="h-display text-4xl">
          Merci, votre demande est bien envoyée.
        </h3>
        <p className="text-white/70">
          Nous revenons vers vous rapidement. Pour une question urgente :{" "}
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
    <form
      onSubmit={onSubmit}
      onBlur={onBlur}
      className="grid gap-4 md:grid-cols-2"
      noValidate
    >
      {/* Anti-robot : champ invisible que seuls les robots remplissent */}
      <input
        type="checkbox"
        name="botcheck"
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
      />

      <fieldset className="md:col-span-2">
        <legend className="mb-3 text-sm text-zinc">Vous êtes</legend>
        <div className="flex flex-wrap gap-3">
          {["Particulier", "Professionnel (constructeur, lotisseur…)"].map(
            (p, i) => (
              <label
                key={p}
                className="flex min-h-11 cursor-pointer items-center gap-3 rounded-full border border-graphite/15 px-5 text-sm has-[:checked]:border-graphite has-[:checked]:bg-graphite has-[:checked]:text-white"
              >
                <input
                  type="radio"
                  name="profil"
                  value={p}
                  defaultChecked={i === 0}
                  className="sr-only"
                />
                {p}
              </label>
            ),
          )}
        </div>
      </fieldset>

      <div className="relative">
        <input
          id="nom"
          name="nom"
          required
          autoComplete="name"
          placeholder="Nom"
          aria-invalid={!!errors.nom}
          aria-describedby={errors.nom ? "err-nom" : undefined}
          className={`${field} ${errors.nom ? "border-rouge" : ""}`}
        />
        <label htmlFor="nom" className={label}>
          Nom et prénom *
        </label>
        <FieldError id="err-nom" message={errors.nom} />
      </div>
      <div className="relative">
        <input
          id="tel"
          name="telephone"
          type="tel"
          required
          autoComplete="tel"
          placeholder="Téléphone"
          aria-invalid={!!errors.telephone}
          aria-describedby={errors.telephone ? "err-telephone" : undefined}
          className={`${field} ${errors.telephone ? "border-rouge" : ""}`}
        />
        <label htmlFor="tel" className={label}>
          Téléphone *
        </label>
        <FieldError id="err-telephone" message={errors.telephone} />
      </div>
      <div className="relative">
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "err-email" : undefined}
          className={`${field} ${errors.email ? "border-rouge" : ""}`}
        />
        <label htmlFor="email" className={label}>
          Email *
        </label>
        <FieldError id="err-email" message={errors.email} />
      </div>
      <div className="relative">
        <input
          id="commune"
          name="commune"
          autoComplete="address-level2"
          placeholder="Commune"
          className={field}
        />
        <label htmlFor="commune" className={label}>
          Commune du chantier
        </label>
      </div>

      <div className="relative md:col-span-2">
        <select
          id="metier"
          name="metier"
          defaultValue=""
          className={`${field} appearance-none`}
        >
          <option value="">Je ne sais pas encore / plusieurs</option>
          {metiers.map((m) => (
            <option key={m.slug} value={m.title}>
              {m.title}
            </option>
          ))}
        </select>
        <label
          htmlFor="metier"
          className="pointer-events-none absolute left-4 top-2 text-xs text-zinc"
        >
          Type de travaux
        </label>
      </div>

      <div className="relative md:col-span-2">
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Votre projet"
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "err-message" : undefined}
          className={`${field} resize-y ${errors.message ? "border-rouge" : ""}`}
        />
        <label htmlFor="message" className={label}>
          Votre projet *
        </label>
        <FieldError id="err-message" message={errors.message} />
      </div>

      <div className="md:col-span-2">
        <label className="flex cursor-pointer items-start gap-3 py-1 text-sm leading-relaxed text-zinc">
          <input
            type="checkbox"
            name="consentement"
            value="oui"
            required
            aria-invalid={!!errors.consentement}
            aria-describedby={
              errors.consentement ? "err-consentement" : undefined
            }
            onChange={(e) =>
              e.target.checked &&
              setErrors((prev) => ({ ...prev, consentement: undefined }))
            }
            className="mt-0.5 size-6 shrink-0 cursor-pointer accent-rouge"
          />
          <span>
            J’accepte que mes données soient utilisées par EURALU pour traiter
            ma demande de devis et me recontacter. Elles ne sont jamais cédées à
            des tiers. Voir notre{" "}
            <Link
              href="/confidentialite"
              className="text-graphite underline underline-offset-4"
            >
              politique de confidentialité
            </Link>
            . *
          </span>
        </label>
        <FieldError id="err-consentement" message={errors.consentement} />
      </div>

      <div className="flex flex-col gap-4 md:col-span-2 md:flex-row md:items-center md:justify-between">
        <p className="text-xs text-zinc">* Champs obligatoires</p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-rouge px-8 text-sm font-medium text-white transition-[background-color,transform] duration-300 hover:bg-rouge-fonce active:scale-[0.97] disabled:opacity-60"
        >
          {status === "sending" ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden /> Envoi en
              cours…
            </>
          ) : (
            <>
              Envoyer ma demande
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform duration-300 group-hover:translate-x-1"
              />
            </>
          )}
        </button>
      </div>

      {status === "error" && (
        <p
          role="alert"
          className="rounded-xl bg-rouge/10 p-4 text-sm text-rouge-fonce md:col-span-2"
        >
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

/** Message d'erreur affiché sous le champ concerné et annoncé aux lecteurs d'écran. */
function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-sm text-rouge-fonce">
      {message}
    </p>
  );
}
