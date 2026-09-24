"""
Prépare les photos de chantier pour le web.

Source  : public/photos-chantier/<metier>/*.jpg  (originaux, jamais modifiés)
Sortie  : public/images/realisations/<metier>/<slug>.jpg
          lib/realisations.generated.json (dimensions, pour next/image)

- retire les bandes noires des captures d'écran
- supprime les métadonnées EXIF (dont la géolocalisation GPS)
- redimensionne à 1600 px maximum et compresse (qualité 82)

Usage : pip install pillow && python3 scripts/prepare-photos.py
Ajouter une photo = l'ajouter dans PHOTOS ci-dessous puis relancer le script.
"""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "public/photos-chantier"
OUT = ROOT / "public/images/realisations"

# (métier, fichier original, slug, texte alternatif)
PHOTOS = [
    ("etancheite", "couvertine blznche.jpg", "toiture-terrasse-couvertine-alu-blanche",
     "Toiture terrasse étanchée, relevé contre façade et couvertine en aluminium blanc, camionnette EURALU sur le chantier"),
    ("etancheite", "vegetalisation.jpg", "toiture-terrasse-vegetalisee",
     "Toiture terrasse végétalisée avec bande de gravillons en périphérie et relevés d'étanchéité"),
    ("zinguerie", "naissance zing.jpg", "naissance-gouttiere-zinc",
     "Gros plan sur une naissance soudée dans une gouttière en zinc"),
    ("zinguerie", "zinguerie zinc.jpg", "gouttiere-descente-zinc-construction-neuve",
     "Gouttière et descente pluviale en zinc sur une maison neuve en construction"),
    ("zinguerie", "zinguerie alu 1.jpg", "gouttiere-descente-alu-anthracite",
     "Gouttière et descente en aluminium anthracite en angle de façade"),
    ("zinguerie", "zinguerie alu 2.jpg", "descente-pluviale-alu-anthracite",
     "Descente pluviale en aluminium anthracite le long d'une façade enduite"),
    ("zinguerie", "zinguerie alu blanc.jpg", "gouttiere-alu-blanc-toiture-quatre-pans",
     "Gouttière en aluminium blanc sur une toiture à quatre pans"),
    ("zinguerie", "zinguerie alu blanc 2.jpg", "gouttieres-descente-alu-blanc",
     "Gouttières et descente pluviale en aluminium blanc sur une maison individuelle"),
    ("zinguerie", "zinguerie alu blanc 3.jpg", "angle-gouttiere-alu-blanc",
     "Angle de toiture équipé d'une gouttière et d'une descente en aluminium blanc"),
    ("sous-faces", "sous face pvc anthracite avant.jpg", "sous-face-avant-renovation",
     "Avant travaux : débord de toit aux chevrons en bois apparents"),
    ("sous-faces", "sous face pvc anthracite apres.jpg", "sous-face-pvc-anthracite-apres",
     "Après travaux : le même débord de toit habillé en PVC anthracite, gouttière assortie"),
    ("sous-faces", "sous face pvc en cours.jpg", "sous-face-pvc-pose-en-cours",
     "Pose en cours d'une sous-face en PVC anthracite sous un débord de toit en bois"),
    ("sous-faces", "reno frisette.jpg", "maison-sous-faces-bandeaux-pvc-anthracite",
     "Maison individuelle aux sous-faces et bandeaux rénovés en PVC anthracite"),
    ("sous-faces", "frisette reno 2.jpg", "renovation-rives-sous-faces-pvc-anthracite",
     "Rénovation des rives et sous-faces en PVC anthracite sur un pignon"),
    ("sous-faces", "reno frisette 3.jpg", "debords-toit-pvc-anthracite-entree",
     "Débords de toit habillés en PVC anthracite au-dessus d'une porte d'entrée"),
    ("sous-faces", "frisette imitation bois.jpg", "sous-face-frisette-pvc-aspect-bois",
     "Débord de toit habillé d'une frisette PVC aspect bois"),
]


def trim_black_bars(im: Image.Image) -> Image.Image:
    """Retire les bandes noires horizontales (haut / bas) des captures d'écran."""
    gray = im.convert("L")
    w, h = gray.size

    def is_black(y: int) -> bool:
        row = gray.crop((0, y, w, y + 1)).getextrema()
        return row[1] < 20

    top, bottom = 0, h - 1
    while top < h // 3 and is_black(top):
        top += 1
    while bottom > h * 2 // 3 and is_black(bottom):
        bottom -= 1
    return im.crop((0, top, w, bottom + 1))


def main() -> None:
    meta = []
    for metier, src, slug, alt in PHOTOS:
        im = ImageOps.exif_transpose(Image.open(SRC / metier / src)).convert("RGB")
        im = trim_black_bars(im)
        im.thumbnail((1600, 1600), Image.LANCZOS)
        dest = OUT / metier / f"{slug}.jpg"
        dest.parent.mkdir(parents=True, exist_ok=True)
        im.save(dest, "JPEG", quality=82, optimize=True, progressive=True)  # sans EXIF
        meta.append({"metier": metier, "src": f"/images/realisations/{metier}/{slug}.jpg",
                     "alt": alt, "width": im.width, "height": im.height})
        print(f"{dest.relative_to(ROOT)}  {im.width}x{im.height}")
    (ROOT / "lib/realisations.generated.json").write_text(
        json.dumps(meta, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
