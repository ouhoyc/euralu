@AGENTS.md

# Projet EURALU — mémoire pour les sessions Claude

Site vitrine d'**EURALU**, SARL fondée en 2005 à Saint-Clair-du-Rhône (38) :
zinguerie, étanchéité de toitures terrasses, sous-faces et bandeaux, traitement de tuiles.

## Consignes permanentes de l'utilisateur (à respecter sans exception)

- **Parler uniquement en français**, avec des explications courtes et simples : l'utilisateur débute.
- **Ne jamais inventer** de numéro de certificat, d'assurance, de label (RGE, Qualibat…) ou d'avis client :
  laisser `[À COMPLÉTER]`.
- Textes professionnels, **sans promesse inventée** (délais, garanties, prix…).
- Réalisations : **uniquement de vraies photos de chantier**, jamais d'images générées par IA.
  (Les images d'illustration IA ailleurs sur le site sont signalées comme telles dans leur texte alternatif.)
- **Higgsfield** : vérifier le solde de crédits et annoncer le coût estimé **avant** toute génération ;
  ne jamais relancer une génération sans demander.
- **Ne rien modifier dans le dépôt `mon-site`** : on le laisse intact.
- Demander avant toute action importante ou irréversible.

## Technique

- Next.js 16 (App Router), TypeScript, Tailwind v4, Motion (`motion/react`, LazyMotion strict : composants `m.*`),
  GSAP ScrollTrigger, three.js / React Three Fiber, MapLibre (fond OpenFreeMap), formulaire Web3Forms.
- Hébergement **Vercel** : un `git push` sur `main` met le site en ligne automatiquement.
- Commandes : `npm run dev`, `npm run build`, `npm run lint`.
- Contenus des métiers : `lib/metiers.ts` ; infos de l'entreprise : `lib/site.ts`.
- Animation 3D de la toiture terrasse : `components/three/terrace/` (étapes et minutage dans `timeline.ts`).
- Page de test non référencée : `/labo/terrasse` (version « page produit » de l'animation).
- Vidéos et projets vidéo (non publiés sur le site) : dossier `video/`, voir `video/LISEZMOI.md`.
- Session cloud : un script de démarrage (`.claude/hooks/session-start.sh`) installe le CLI HyperFrames.

## Reste à faire

Voir `docs/a-faire.md`.
