# Site EURALU

Site vitrine d'EURALU (zinguerie, étanchéité, sous-faces, tuiles), construit avec Next.js, TypeScript, Tailwind CSS, Motion et GSAP.

## Lancer le site sur son ordinateur

Prérequis : [Node.js](https://nodejs.org) version 20 ou plus.

```bash
npm install        # une seule fois : installe les dépendances
npm run dev        # lance le site en local → http://localhost:3000
npm run build      # vérifie que le site se construit sans erreur (à faire avant chaque mise en ligne)
npm run lint       # vérifie la qualité du code
```

## Où modifier quoi

| Je veux changer…                                  | Fichier                                   |
|---------------------------------------------------|-------------------------------------------|
| Téléphone, adresse, horaires, certifications      | `lib/site.ts`                             |
| Textes des 4 métiers (intro, étapes, FAQ…)        | `lib/metiers.ts`                          |
| Couleurs et polices                               | `app/globals.css` (bloc `@theme`)         |
| Témoignages                                       | `components/sections/Testimonials.tsx`    |
| Logo                                              | `public/logo/`                            |

Les éléments à renseigner avant la mise en ligne sont marqués **[À COMPLÉTER]**
(recherche dans tout le projet : `grep -rn "À COMPLÉTER" app components lib`).

## Ajouter des photos de chantier

Règle : **uniquement de vraies photos**, jamais d'images générées par IA.

1. Déposer la photo dans `public/photos-chantier/<métier>/`.
2. L'ajouter à la liste `PHOTOS` de `scripts/prepare-photos.py` (avec un texte alternatif descriptif).
3. Lancer `python3 scripts/prepare-photos.py` : la photo est recadrée, allégée, débarrassée de ses
   données GPS et ajoutée automatiquement à la galerie.

Un métier sans photo (ex. tuiles) n'apparaît pas dans les filtres de la galerie : il apparaîtra dès la première photo.

## Variables d'environnement

Copier `.env.example` en `.env.local` et renseigner :

- `NEXT_PUBLIC_WEB3FORMS_KEY` : clé gratuite sur [web3forms.com](https://web3forms.com), liée à l'email qui reçoit les demandes de devis ;
- `NEXT_PUBLIC_SITE_URL` : l'adresse définitive du site.

Sur Vercel : *Project → Settings → Environment Variables*, mêmes noms.
