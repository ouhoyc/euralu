# Vidéos EURALU (hors site)

Ce dossier n'est **pas publié sur le site** : il contient les projets et les rendus vidéo.

## Contenu

| Dossier | Ce que c'est |
|---|---|
| `rendus/gouttiere-hyperframes.mp4` | Film de 14,5 s (1920×1080) : tracé laser du profil → extrusion → tour 360° → pluie → logo. |
| `rendus/gouttiere-360.mp4` | Tour à 360° de la gouttière sur fond clair (8 s, 1280×720). |
| `gouttiere-hyperframes/` | Projet [HyperFrames](https://hyperframes.heygen.com) qui produit le film ci-dessus. |
| `gouttiere-360/` | Visionneuse three.js du modèle 3D (tourne seule ; sert à filmer le tour à 360°). |

## Le modèle 3D

`gouttiere-hyperframes/assets/gouttiere.glb` (34 Mo) : généré par **Hunyuan3D v3** (Higgsfield, 15 crédits)
à partir d'une photo de gouttière. Il est partagé par les deux projets.
`gouttiere-hyperframes/assets/profil.js` : coupe exacte de la gouttière, extraite du modèle (sert au tracé laser).

## Refaire le film

```bash
cd video/gouttiere-hyperframes
npx hyperframes lint                       # vérifier
npx hyperframes snapshot --at 3,6,11       # quelques images de contrôle
npx hyperframes render -o ../rendus/gouttiere-hyperframes.mp4 -q high -w 4
```

Sans carte graphique (session cloud), le rendu complet prend environ 20 minutes.

- Textes, ordre et durées : dans `index.html` (habillage GSAP, en haut du script).
- Caméra : tableau `K` (images clés : temps, cible, azimut, élévation, distance).
- Pluie : constantes `DROPS`, `FALL`, et la fonction `renderAt`.

## Revoir le tour à 360°

Servir le dossier `video/` (par ex. `python3 -m http.server` depuis `video/`)
puis ouvrir `gouttiere-360/index.html`.
