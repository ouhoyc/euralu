---
name: euralu-design
description: Charte et direction artistique du site EURALU (zinguerie, étanchéité, sous-faces, tuiles). À lire AVANT toute création ou modification visuelle du site : pages, sections, composants, animations, images, textes affichés. Contient les couleurs, polices, grille d'espacement, échelle typographique, principes de mouvement, la technique des « scènes en couches » animées au scroll, les règles d'images et de contenu, et les règles d'usage de Higgsfield et 21st.dev.
---

# EURALU — charte et direction artistique

Objectif : un site vitrine **ultra premium, architectural, cinématique**, au niveau des pages produits
d'Apple ou des sites de marques de matériaux haut de gamme. Sobre, beaucoup d'espace, grande typographie.
Jamais « gadget », jamais « site généré par IA ».

Utiliser aussi le skill `ui-ux-pro-max` pour les règles générales (accessibilité, interaction, performance).
En cas de conflit, **ce fichier prime** pour tout ce qui est propre à EURALU.

---

## 1. Couleurs (tokens)

Définies une seule fois dans `app/globals.css` (bloc `@theme`). **Aucun code hexadécimal en dur dans les composants** :
toujours passer par les classes Tailwind générées (`bg-graphite`, `text-rouge`, `border-alu`…).

| Token | Valeur | Usage |
|---|---|---|
| `rouge` | `#C22C34` | Rouge du logo. **Actions principales uniquement** (bouton devis, accents rares). Jamais en aplat de grande surface. |
| `rouge-fonce` | `#A4232A` | Survol des boutons rouges |
| `rouge-clair` | `#E0555C` | Accents sur fond sombre (contraste AA) |
| `graphite` | `#16181B` | Fonds sombres, scènes cinématiques |
| `graphite-2` | `#2B2E33` | Texte courant sur fond clair, cartes sombres |
| `zinc` | `#646B72` | Texte secondaire sur fond clair |
| `zinc-clair` | `#A3AAB1` | Texte secondaire sur fond sombre |
| `alu` / `alu-clair` | `#C8CCD1` / `#E3E5E8` | Filets, bordures, séparateurs |
| `creme` | `#F4F2EE` | Fond principal des pages claires |
| `blanc` | `#FBFAF8` | Cartes sur fond crème |

Règles :
- Proportion visée : ~60 % graphite/crème, ~35 % zinc/alu, **≤ 5 % rouge**.
- Contraste texte ≥ 4.5:1 (déjà vérifié pour les paires ci-dessus ; revérifier toute nouvelle paire).
- Les ambiances colorées des scènes (bleu acier, terre cuite…) sont des **lumières** (dégradés, halos flous),
  pas de nouvelles couleurs d'interface.

## 2. Typographie

- **Une seule famille : Montserrat** (choix du client, inspiré de sbe-etancheite.fr). Sobre, droite, jamais d'italique ni d'écriture « attachée ».
- **Titres** : `.h-display`, graisse 600, interlignage 1,08, approche -0,02em. Le titre du héro d'accueil est en capitales (approche +0,02em).
  Accent éventuel : une nuance de couleur sur un groupe de mots, jamais d'italique.
- **Texte** : Montserrat 400 (`font-sans`), 500 pour les boutons.
- **Surtitres** : classe `.kicker` (0,75 rem, capitales, espacement 0,22 em).

Échelle (ne pas inventer d'autres tailles) :

| Rôle | Mobile | ≥ md | ≥ xl |
|---|---|---|---|
| Display héro | `text-[3.4rem]` | `text-7xl` | `text-[7.5rem]` |
| Titre de page (H1) | `text-5xl` | `text-7xl` | `text-8xl` |
| Titre de section (H2) | `text-5xl` | `text-6xl` | — |
| Titre de carte (H3) | `text-3xl` | `text-4xl` | — |
| Chapeau | `text-lg` | `text-xl` | — |
| Texte courant | `text-base` / `text-lg` | — | — |
| Légende | `text-sm` / `text-xs` | — | — |

- Longueur de ligne du texte courant : 60 à 75 caractères (`max-w-xl` à `max-w-3xl`).
- Typographie française : apostrophe typographique `’`, espace avant `: ; ? !`, guillemets « ».

## 3. Espacements et mise en page

- **Grille de base 8 px** : n'utiliser que des multiples de 8 px (`2, 4, 6, 8, 10, 12, 16, 20, 24, 32…` en unités Tailwind).
  Exception autorisée : 4 px (`1`) pour les micro-ajustements.
- Conteneur : classe `.container-page` (88 rem max, marges 20 / 40 / 64 px).
- Respiration verticale des sections : `py-24 md:py-32` (ou `md:py-36` pour les sections majeures).
- Rayons : `rounded-2xl` pour cartes et images, `rounded-full` pour boutons et pastilles. Rien d'autre.
- Toujours **un seul point focal par écran**. Si deux éléments se disputent l'attention, en supprimer un.

## 4. Mouvement

Bibliothèques : **Motion** (`motion/react`, ex-Framer Motion) pour les apparitions, survols et transitions de page ;
**GSAP + ScrollTrigger** pour tout ce qui est piloté par le scroll (scènes, épinglage, scrub).

Principes :
- Animer **uniquement `transform` et `opacity`** (60 images/s visées). Jamais `width`, `height`, `top`, `left`.
- Courbe par défaut : `cubic-bezier(0.22, 1, 0.36, 1)` (`ease-premium`). Durées : 0,3 s (micro-interactions),
  0,6 à 0,9 s (apparitions), 1,2 à 1,4 s (zooms d'image au survol).
- Apparitions en cascade : décalage de 0,06 à 0,1 s entre éléments.
- Le mouvement doit **expliquer** quelque chose (arrivée d'un chapitre, lien entre deux éléments), jamais décorer gratuitement.
- `prefers-reduced-motion` : toujours prévoir une version statique lisible (`MotionConfig reducedMotion="user"`
  déjà en place ; pour GSAP, tester `matchMedia` et ne rien lancer).
- Le premier affichage d'une page ne doit pas masquer le titre principal (pas d'`opacity: 0` sur le H1 au chargement).

## 5. Technique signature : les « scènes en couches » pilotées par le scroll

C'est l'effet recherché (références : pages produits type Nike, canettes de boisson sur décor lunaire,
restaurant aux éléments détourés). **Ce n'est pas une vidéo qui défile** : c'est une superposition d'images
détourées animées indépendamment par le scroll.

Couches, de l'arrière vers l'avant :
1. **Décor commun** : une seule image d'ambiance partagée par tous les chapitres (le « sol » : ici par exemple
   une toiture terrasse sombre en lumière rasante). Il ne bouge presque pas.
2. **Lumière d'ambiance** : halos et brumes colorés (dégradés flous) qui changent de teinte **en fondu** d'un chapitre à l'autre.
3. **Mot géant** en arrière-plan (ZINC, ÉTANCHÉITÉ…), ton sur ton, partiellement masqué par l'objet.
4. **Objet héros** détouré, éclairé comme un produit de studio, grand et centré.
5. **Éléments flottants** détourés (gouttes d'eau, gravillons, brins de mousse…) qui dérivent doucement en continu
   et à une vitesse différente de l'objet (parallaxe).
6. **Texte** en vrai HTML (surtitre, titre, une phrase, bouton).

Transitions entre chapitres (section épinglée, `ScrollTrigger` avec `pin` + `scrub`) :
- l'objet courant **glisse et sort** (ex. vers la droite), le suivant **entre** par le côté opposé, en même temps ;
- la lumière d'ambiance change de teinte en fondu ; le décor commun reste ;
- les éléments flottants sont remplacés par ceux du chapitre suivant ;
- le mot géant change en fondu.

Chapitres prévus : Zinguerie (gouttière zinc, bleu acier, gouttes) → Étanchéité (couvertine alu, anthracite froid,
gravillons) → Sous-faces (lame PVC anthracite, lumière chaude de fin de journée) → Tuiles (tuile, terre cuite, brins de mousse).

Hors scènes, le reste des pages défile **en couches** : textes, photos et petits éléments décoratifs montent à des
vitesses différentes, les décorations entrent par les bords, les cartes arrivent en cascade.

Le composant `components/cinematic/ScrollSequence.tsx` (vidéo découpée en images dans un canvas) reste disponible
pour **un seul** moment fort éventuel (ex. rotation à 360° d'une pièce), pas comme technique principale.

## 5 bis. Exactitude technique des scènes (non négociable)

Un professionnel du bâtiment doit pouvoir regarder chaque scène sans y trouver d'erreur. Règles validées par EURALU :
- **Pare-vapeur** : membrane bitumineuse **noire**, posée sur toute la dalle **et remontée sur les acrotères**
  (premier relevé, **jusqu'en haut de l'acrotère**).
- **Isolant** : panneaux posés **à joints décalés (en quinconce)** : une rangée sur deux commence par un
  demi-panneau, les joints ne sont jamais alignés d'une rangée à l'autre (sinon pont thermique). Panneaux de rive recoupés.
- **Couvertines** : longueurs coupées d'onglet, **angles parfaitement carrés et fermés**, sans trou ni jour ;
  débord et retombées des deux côtés de l'acrotère.
- **Menuiseries** : de vraies ouvertures dans le mur (tableaux visibles), menuiserie en retrait dans l'épaisseur
  du mur, profilés fins, vitrage réfléchissant, appui aluminium sous les fenêtres.
- Ordre de pose : support → pare-vapeur (+ relevé) → isolant → membrane (lés qui se recouvrent) → relevés
  d'étanchéité → couvertines → protection gravillons.
- En cas de doute sur un détail de mise en œuvre : **demander à l'utilisateur** plutôt que d'inventer.

## 6. Images

- **Réalisations et galeries : uniquement de vraies photos de chantier EURALU. Jamais d'image IA.**
  Préparation via `scripts/prepare-photos.py` (recadrage, suppression EXIF/GPS, compression).
- **Visuels d'ambiance et objets des scènes** : générés avec Higgsfield (voir §8), détourés, cohérents entre eux
  (même lumière, même rendu « studio produit »). Jamais présentés comme des chantiers réels.
- Ne jamais afficher une photo de téléphone en plein écran pour porter l'ambiance premium : les photos réelles
  servent la **crédibilité** (galeries, pages métiers), les visuels studio servent l'**émotion** (héros, scènes).
- Formats : `next/image` (AVIF/WebP automatiques), `sizes` renseigné, attribut `alt` descriptif en français.

## 7. Contenus

- Textes professionnels, concrets, crédibles. **Aucun superlatif creux, aucune promesse inventée**
  (pas de durée de garantie, délai, prix, chiffre ou avis inventé).
- Tout élément inconnu reste **[À COMPLÉTER]** (numéros de certificats, témoignages, équipe…).
- Données de l'entreprise : uniquement depuis `lib/site.ts`. Contenus métiers : `lib/metiers.ts`.
- RGE : toujours formulé « pour les travaux éligibles, sous conditions ».
- SEO local naturel : zingueur Lyon, étanchéité toiture terrasse Lyon / Isère / Rhône, habillage sous-face PVC,
  couvreur Vienne, Saint-Clair-du-Rhône.

## 8. Outils externes

**Higgsfield** (chaque génération coûte des crédits) :
- vérifier le solde et annoncer le coût estimé **avant** toute génération ;
- montrer le prompt exact et **attendre l'accord** de l'utilisateur ;
- ne jamais relancer une génération sans demander ;
- générer en meilleure qualité, puis upscale ; détourage avec l'outil de suppression de fond.

**21st.dev** (offre gratuite : 2 récupérations de composants par jour, pas de génération IA) :
- l'utilisateur choisit les composants sur 21st.dev et envoie les liens ; les récupérer un par un ;
- toujours adapter le composant à cette charte (tokens, typographie, mouvement) : ne jamais coller tel quel.

## 9. Anti-« style IA générique » — à éviter absolument

- Dégradés violet/bleu, néons, glassmorphism décoratif, ombres portées lourdes, emojis comme icônes.
- Grilles de 3 cartes identiques avec icône + titre + texte en guise de design.
- Textes marketing vides (« solutions innovantes », « excellence », « passion »).
- Tailles de police ou espacements arbitraires hors des échelles ci-dessus.
- Plusieurs couleurs d'accent ; rouge utilisé partout.
- Animations systématiques identiques sur chaque élément.
- Photos plates en plein écran avec un texte posé dessus comme seul « effet cinématique ».

## 10. Méthode de travail avec l'utilisateur

- L'utilisateur est débutant : expliquer brièvement chaque grande étape en français, donner les commandes exactes,
  **attendre sa validation avant les étapes importantes** et ne pas aller plus vite que demandé.
- Présenter un test technique comme un test, pas comme un résultat.
- `npm run lint` et `npm run build` doivent passer avant chaque envoi sur GitHub.
