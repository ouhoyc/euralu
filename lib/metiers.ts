/**
 * Contenus des 4 pages métiers.
 * Les textes restent factuels : aucune durée de garantie, aucun délai ni prix inventé.
 */

export type MetierSlug = "etancheite-toiture-terrasse" | "zinguerie" | "sous-faces-bandeaux" | "traitement-tuiles";

/** Catégorie utilisée pour filtrer la galerie des réalisations. */
export type GalleryCategory = "etancheite" | "zinguerie" | "sous-faces" | "tuiles";

export type Metier = {
  slug: MetierSlug;
  category: GalleryCategory;
  index: string;
  shortTitle: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  kicker: string;
  summary: string;
  intro: string[];
  /** Texte détaillé (référencement) : sous-titres et paragraphes. */
  details?: { title: string; paragraphs: string[] }[];
  savoirFaire: { title: string; text: string }[];
  steps: { title: string; text: string }[];
  faq: { q: string; a: string }[];
  /** Photo de couverture (vraie photo de chantier) ; absente si aucune photo disponible. */
  cover?: { src: string; alt: string };
  /** Finitions possibles, avec photo réelle quand elle existe. */
  finitions?: { name: string; text: string; image?: { src: string; alt: string } }[];
  /** Coloris proposés (affichés en nuancier sur la page). */
  coloris?: {
    pvc: { name: string; hex: string; ral?: string; featured?: boolean }[];
    alu: string;
  };
  /** Comparateur avant / après affiché à côté de l'introduction (remplace la photo de couverture). */
  beforeAfter?: {
    before: { src: string; alt: string };
    after: { src: string; alt: string };
    width: number;
    height: number;
    caption?: string;
  };
};

export const metiers: Metier[] = [
  {
    slug: "etancheite-toiture-terrasse",
    category: "etancheite",
    index: "01",
    shortTitle: "Étanchéité",
    title: "Étanchéité de toiture terrasse",
    metaTitle: "Étanchéité de toiture terrasse à Lyon, en Isère et dans le Rhône",
    metaDescription:
      "Étanchéité de toitures terrasses neuves et en rénovation : membranes, relevés, couvertines aluminium ou acier, finitions carrelage, dalles sur plots, végétal ou gravier. EURALU, Lyon, Isère, Rhône. Devis gratuit.",
    kicker: "Toitures plates et terrasses",
    summary:
      "Membranes, relevés et couvertines : une toiture terrasse étanche se joue dans les détails, surtout aux points singuliers.",
    intro: [
      "Une toiture terrasse n’a pas de pente pour évacuer l’eau rapidement : son étanchéité doit être continue, sans le moindre point faible. La plupart des infiltrations naissent aux mêmes endroits : relevés contre les murs, angles, évacuations, jonctions avec les acrotères.",
      "EURALU réalise l’étanchéité de toitures terrasses de maisons individuelles, en construction neuve comme en rénovation, dans la région lyonnaise, en Isère et dans le Rhône. Nous traitons l’ensemble, de la membrane jusqu’aux couvertines en aluminium qui protègent le haut des murs.",
    ],
    details: [
      {
        title: "Pourquoi l’étanchéité d’une toiture terrasse est si exigeante",
        paragraphs: [
          "Sur un toit en pente, l’eau s’écoule d’elle-même. Sur une toiture terrasse, la pente est très faible : l’eau reste plus longtemps en contact avec la surface et s’infiltre à la moindre faiblesse. L’étanchéité doit donc former un ensemble continu, avec des raccords à l’épreuve de l’eau, depuis le centre de la toiture jusqu’en haut des murs qui l’entourent.",
          "Une infiltration sur une toiture terrasse se remarque souvent tard, quand une tache apparaît au plafond. L’eau a alors parfois déjà mouillé l’isolant. C’est pourquoi nous soignons autant la pose initiale que le diagnostic en rénovation.",
        ],
      },
      {
        title: "Les couches d’une toiture terrasse, dans l’ordre de pose",
        paragraphs: [
          "Le support (dalle béton, bois ou bac acier) reçoit d’abord un pare-vapeur, déroulé en rouleaux. Il agit comme une dernière sécurité sous l’isolant, et il remonte le long des acrotères, les murets qui bordent la terrasse.",
          "Vient ensuite l’isolant thermique, posé en panneaux à joints décalés pour éviter les ponts thermiques. Par-dessus, la membrane d’étanchéité est déroulée en rouleaux qui se chevauchent. Il existe plusieurs types de membranes, qui dépendent de la finition prévue par le client : carrelage, dalles sur plots, végétalisation ou gravier.",
          "Les relevés prolongent l’étanchéité verticalement contre les acrotères et les façades, puis les couvertines en aluminium ou en acier coiffent le haut des murs. La finition choisie vient enfin recouvrir l’ensemble.",
        ],
      },
      {
        title: "Points singuliers : là où naissent la plupart des fuites",
        paragraphs: [
          "Angles rentrants et sortants, jonctions avec la façade, sorties d’eaux pluviales, trop-pleins, sorties de ventilation, seuils de portes-fenêtres : ce sont les endroits les plus sensibles de l’étanchéité. Nous les traitons pièce par pièce, avec des renforts et des raccords adaptés, car c’est là que se joue la durabilité de l’ouvrage.",
        ],
      },
      {
        title: "Construction neuve ou rénovation",
        paragraphs: [
          "En construction neuve, nous intervenons pour des particuliers comme pour des constructeurs de maisons individuelles, des lotisseurs et des promoteurs.",
          "En rénovation, la visite permet de déterminer si une réparation localisée suffit (un relevé décollé, une évacuation mal raccordée) ou si la réfection complète est préférable. Pour localiser précisément une fuite, nous réalisons si besoin un test fumigène : une fumée injectée sous l’étanchéité ressort à l’endroit des défauts. Le devis détaille poste par poste ce qui est prévu : dépose éventuelle de l’ancienne étanchéité, reprise du support, système proposé, traitement des points singuliers et finitions.",
        ],
      },
      {
        title: "Entretenir sa toiture terrasse",
        paragraphs: [
          "Une toiture terrasse demande peu d’entretien, mais un contrôle régulier évite bien des dégâts : dégager les feuilles et débris qui bouchent les évacuations et surveiller l’état des relevés et des couvertines. Au moindre doute, une visite permet d’intervenir avant que l’eau n’atteigne l’isolant.",
        ],
      },
      {
        title: "Notre zone d’intervention",
        paragraphs: [
          "Basée à Saint-Clair-du-Rhône, EURALU intervient à Lyon et dans son agglomération, dans le Rhône, en Isère et dans le secteur de Vienne. La visite et le devis sont gratuits et sans engagement.",
        ],
      },
    ],
    // Pas de bloc « Ce qui fait la différence » sur cette page (tout est déjà dit dans le détail)
    savoirFaire: [],
    finitions: [
      {
        name: "Carrelage",
        text: "Terrasse accessible, finition carrelée.",
        image: {
          src: "/images/finitions/carrelage.jpg",
          alt: "Toiture terrasse accessible finie en carrelage, bordée de couvertines blanches (image d’illustration)",
        },
      },
      {
        name: "Dalles sur plots",
        text: "Terrasse accessible : dalles posées sur plots, l’eau s’écoule dessous.",
        image: {
          src: "/images/finitions/dalles-sur-plots.jpg",
          alt: "Dalles posées sur plots réglables au-dessus de la membrane d’étanchéité (image d’illustration)",
        },
      },
      {
        name: "Végétalisation",
        text: "Toiture végétalisée, bordée d’une bande de gravier.",
        image: {
          src: "/images/realisations/etancheite/toiture-terrasse-vegetalisee.jpg",
          alt: "Toiture terrasse végétalisée bordée de galets, réalisée par EURALU",
        },
      },
      {
        name: "Gravier",
        text: "Toiture non accessible : le gravier protège la membrane.",
        image: {
          src: "/images/finitions/gravier.jpg",
          alt: "Toiture terrasse protégée par du gravier, relevé gris et couvertine blanche (image d’illustration)",
        },
      },
    ],
    steps: [
      {
        title: "Visite et diagnostic",
        text: "Nous examinons le support, les pentes, les évacuations et, en rénovation, l’état de l’étanchéité existante.",
      },
      {
        title: "Devis détaillé",
        text: "Un devis gratuit et poste par poste, avec le système d’étanchéité proposé et le traitement des points singuliers.",
      },
      {
        title: "Préparation du support",
        text: "Nettoyage, dépose de l’ancienne étanchéité si nécessaire, reprise des défauts du support.",
      },
      {
        title: "Pose de l’étanchéité",
        text: "Mise en œuvre de la membrane, des relevés et des raccords aux évacuations, selon les règles de l’art.",
      },
      {
        title: "Finitions et contrôle",
        text: "Pose des couvertines et des finitions, vérification de l’ensemble et nettoyage du chantier.",
      },
    ],
    faq: [
      {
        q: "Comment savoir si l’étanchéité de ma toiture terrasse est à refaire ?",
        a: "Les signes les plus fréquents sont les traces d’humidité au plafond, des membranes fissurées, cloquées ou décollées au niveau des relevés. Une visite permet de dire s’il faut une réparation localisée ou une réfection complète.",
      },
      {
        q: "Intervenez-vous sur les maisons neuves ?",
        a: "Oui. Nous travaillons régulièrement pour des constructeurs de maisons individuelles, des lotisseurs et des promoteurs.",
      },
      {
        q: "Pouvez-vous refaire uniquement les couvertines ?",
        a: "Oui, nous posons ou remplaçons des couvertines en aluminium ou en acier, par exemple lorsque les anciennes sont abîmées ou mal fixées.",
      },
      {
        q: "Quelle différence entre une toiture terrasse accessible et non accessible ?",
        a: "Une toiture accessible est prévue pour qu’on y marche (terrasse d’agrément) : l’étanchéité reçoit une protection adaptée, dalles ou terrasse en bois par exemple. Une toiture non accessible n’est parcourue que pour l’entretien : la membrane est le plus souvent protégée par des gravillons.",
      },
      {
        q: "Faut-il entretenir une toiture terrasse ?",
        a: "Oui, légèrement : nettoyer les évacuations et surveiller les relevés et les couvertines. Ces contrôles simples évitent qu’une petite faiblesse ne devienne une infiltration.",
      },
      {
        q: "Le devis est-il gratuit ?",
        a: "Oui, la visite et le devis sont gratuits et sans engagement.",
      },
    ],
    cover: {
      src: "/images/realisations/etancheite/toiture-terrasse-vegetalisee.jpg",
      alt: "Toiture terrasse végétalisée réalisée par EURALU",
    },
  },
  {
    slug: "zinguerie",
    category: "zinguerie",
    index: "02",
    shortTitle: "Zinguerie",
    title: "Zinguerie et aluminium",
    metaTitle: "Zingueur à Lyon : gouttières, descentes et joint debout, zinc ou alu",
    metaDescription:
      "Pose de gouttières, descentes pluviales et joint debout en zinc ou en aluminium laqué. Zingueur à Lyon, Vienne et Saint-Clair-du-Rhône. Devis gratuit.",
    kicker: "Gouttières, descentes, joint debout",
    summary:
      "Gouttières, descentes pluviales et joint debout, en zinc ou en aluminium laqué.",
    intro: [
      "La zinguerie collecte et évacue l’eau de pluie loin des façades et des fondations.",
      "Nous posons des gouttières, des descentes et du joint debout en zinc ou en aluminium laqué, sur des maisons neuves comme anciennes. Les coloris aluminium permettent de coordonner la zinguerie avec les menuiseries et les sous-faces.",
    ],
    savoirFaire: [
      {
        title: "Zinc",
        text: "Matériau traditionnel au vieillissement naturel. Assemblages soudés à l’étain, pour des raccords durables.",
      },
      {
        title: "Aluminium laqué",
        text: "Léger, sans entretien, disponible en plusieurs teintes (blanc, anthracite…) pour s’accorder à la façade et aux menuiseries.",
      },
      {
        title: "Pentes et dimensionnement",
        text: "Section des gouttières, nombre et position des descentes sont définis selon la surface de toiture à évacuer.",
      },
      {
        title: "Joint debout",
        text: "Bandes de zinc ou d’aluminium assemblées par des agrafures verticales : une technique pour couvrir ou habiller auvents, toitures et façades avec des lignes nettes et contemporaines.",
      },
    ],
    steps: [
      {
        title: "Relevé sur place",
        text: "Métrés, surfaces de toiture et points de descente.",
      },
      {
        title: "Choix du matériau et du coloris",
        text: "Zinc ou aluminium, profil de gouttière et teinte, selon le style de la maison et votre budget.",
      },
      {
        title: "Dépose de l’existant",
        text: "En rénovation, dépose et évacuation des anciennes gouttières et descentes.",
      },
      {
        title: "Pose",
        text: "Crochets, gouttières avec pente régulière, naissances, descentes et colliers, raccordement aux évacuations.",
      },
      {
        title: "Contrôle",
        text: "Vérification de l’écoulement et des raccords, nettoyage du chantier.",
      },
    ],
    faq: [
      {
        q: "Zinc ou aluminium : que choisir ?",
        a: "Le zinc convient bien aux maisons de caractère et vieillit en prenant une patine grise. L’aluminium laqué ne demande pas d’entretien et existe en plusieurs coloris, ce qui permet de l’assortir aux menuiseries. Nous vous conseillons lors de la visite.",
      },
      {
        q: "Pouvez-vous remplacer seulement une partie des gouttières ?",
        a: "Oui, si le reste de l’installation est en bon état. Nous vous dirons honnêtement si un remplacement partiel est pertinent.",
      },
      {
        q: "Qu’est-ce que le joint debout ?",
        a: "C’est une technique de couverture et d’habillage en bandes de zinc ou d’aluminium, assemblées entre elles par des agrafures verticales. Elle donne des lignes régulières et un aspect contemporain, par exemple sur un auvent, une petite toiture ou un habillage de façade.",
      },
      {
        q: "Travaillez-vous pour les constructeurs ?",
        a: "Oui, nous réalisons la zinguerie de maisons neuves pour des constructeurs et des lotisseurs de la région lyonnaise.",
      },
    ],
    cover: {
      src: "/images/realisations/zinguerie/naissance-gouttiere-zinc.jpg",
      alt: "Naissance soudée dans une gouttière en zinc",
    },
  },
  {
    slug: "sous-faces-bandeaux",
    category: "sous-faces",
    index: "03",
    shortTitle: "Sous-faces",
    title: "Habillage de sous-faces et bandeaux",
    metaTitle: "Habillage de sous-faces et bandeaux PVC ou aluminium : Lyon, Isère, Rhône",
    metaDescription:
      "Habillage de sous-faces et bandeaux en PVC (frisette) ou en aluminium : blanc, gris anthracite 7016, sable, noir, ou toute couleur sur demande en alu. EURALU, région lyonnaise. Devis gratuit.",
    kicker: "Débords de toit, rives, bandeaux",
    summary:
      "Des débords de toit habillés en PVC ou en aluminium : plus de peinture à refaire, et des lignes nettes.",
    intro: [
      "Les sous-faces et bandeaux en bois demandent un entretien régulier : lasure, peinture, remplacement des planches abîmées. Leur habillage supprime cet entretien et redonne un aspect net à la maison.",
      "Nous habillons les débords de toit, rives et bandeaux en PVC (lames de frisette) ou en aluminium, en construction neuve comme en rénovation. En PVC, quatre coloris : blanc, gris anthracite (RAL 7016), sable et noir. En aluminium, toute couleur est possible sur demande. L’habillage peut être coordonné avec les gouttières.",
    ],
    coloris: {
      pvc: [
        { name: "Blanc", hex: "#f4f4f1", featured: true },
        { name: "Gris anthracite", ral: "RAL 7016", hex: "#383e42", featured: true },
        { name: "Sable", hex: "#d6c7a4" },
        { name: "Noir", hex: "#1d1d1f" },
      ],
      alu: "En aluminium, toute couleur est possible sur demande, pour s’accorder exactement à vos menuiseries ou à votre façade.",
    },
    savoirFaire: [
      {
        title: "PVC sans entretien",
        text: "Les lames de frisette PVC ne se peignent pas et ne pourrissent pas. Un simple nettoyage occasionnel suffit.",
      },
      {
        title: "Aluminium, couleur au choix",
        text: "Nous posons aussi l’habillage en aluminium à la place du PVC, dans n’importe quelle couleur sur demande.",
      },
      {
        title: "Blanc et gris anthracite 7016",
        text: "Nos deux coloris phares, en PVC comme en aluminium. Le sable et le noir complètent la gamme PVC : nous vous présentons les échantillons pour choisir en accord avec la façade.",
      },
      {
        title: "Rénovation soignée",
        text: "Nous vérifions d’abord l’état des bois existants : les parties abîmées sont reprises avant la pose de l’habillage.",
      },
    ],
    steps: [
      {
        title: "Visite",
        text: "État des chevrons, voliges et bandeaux existants, métrés, choix du coloris.",
      },
      {
        title: "Devis",
        text: "Un devis gratuit et détaillé, avec les éventuelles reprises de bois à prévoir.",
      },
      {
        title: "Préparation",
        text: "Reprise ou remplacement des bois abîmés, pose de l’ossature support.",
      },
      {
        title: "Pose de l’habillage",
        text: "Pose des lames de sous-face, des bandeaux et des profils de finition, avec des lignes droites et des angles propres.",
      },
      {
        title: "Finitions",
        text: "Raccords avec la zinguerie, contrôle et nettoyage du chantier.",
      },
    ],
    faq: [
      {
        q: "Faut-il déposer les anciennes planches en bois ?",
        a: "Pas toujours. Si les bois sont sains, l’habillage peut être posé sans dépose complète. S’ils sont abîmés, nous les reprenons avant la pose. C’est vérifié lors de la visite.",
      },
      {
        q: "Quelle différence entre sous-face et bandeau ?",
        a: "La sous-face est la partie horizontale sous le débord de toit, visible quand on lève les yeux. Le bandeau (ou planche de rive) est la partie verticale en bout de chevrons, qui porte souvent la gouttière.",
      },
      {
        q: "Le PVC vieillit-il bien au soleil ?",
        a: "Les lames PVC destinées à l’extérieur sont traitées contre les UV. Nous utilisons des produits prévus pour cet usage.",
      },
      {
        q: "PVC ou aluminium : que choisir ?",
        a: "Le PVC (frisette) existe en blanc, gris anthracite 7016, sable et noir. L’aluminium permet n’importe quelle couleur sur demande, par exemple pour reprendre exactement la teinte de vos menuiseries. Nous vous conseillons lors de la visite.",
      },
      {
        q: "Peut-on assortir sous-faces et gouttières ?",
        a: "Oui, c’est même conseillé : un ensemble anthracite ou blanc, sous-faces et gouttières alu, donne une finition très homogène.",
      },
    ],
    cover: {
      src: "/images/realisations/sous-faces/sous-face-pvc-anthracite-apres.jpg",
      alt: "Débord de toit habillé en PVC anthracite par EURALU",
    },
  },
  {
    slug: "traitement-tuiles",
    category: "tuiles",
    index: "04",
    shortTitle: "Tuiles",
    title: "Traitement de tuiles",
    metaTitle: "Démoussage et traitement de toiture en tuiles : Lyon, Vienne, Isère",
    metaDescription:
      "Traitement de toiture en tuiles : grattage à la brosse métallique, anti-mousse pulvérisé et protection hydrofuge. EURALU intervient à Lyon, Vienne, en Isère et dans le Rhône. Devis gratuit.",
    kicker: "Nettoyage, démoussage, protection",
    summary:
      "Mousses et lichens retiennent l’humidité et abîment les tuiles. Un traitement adapté prolonge la vie de la couverture.",
    intro: [
      "Avec le temps, mousses, lichens et salissures s’installent sur les tuiles. Ils retiennent l’humidité, favorisent le gel et peuvent gêner l’écoulement de l’eau jusqu’aux gouttières.",
      "Nous nettoyons et traitons les toitures en tuiles de maisons individuelles, en trois temps : grattage des tuiles à la brosse métallique pour retirer le plus gros des mousses et lichens, pulvérisation d’un anti-mousse, puis application d’une protection hydrofuge. L’intervention commence toujours par une inspection de la couverture : les tuiles cassées ou déplacées sont signalées avant tout traitement.",
      "Le résultat n’est pas immédiat : l’anti-mousse agit progressivement, et les derniers dépôts s’en vont avec les pluies. Les effets sont visibles dans un délai de 3 à 9 mois.",
    ],
    savoirFaire: [
      {
        title: "Inspection préalable",
        text: "Avant tout nettoyage, nous vérifions l’état des tuiles, des faîtages et des rives.",
      },
      {
        title: "Grattage à la brosse métallique",
        text: "Les tuiles sont grattées une à une pour retirer le plus gros des mousses et des lichens, sans les abîmer.",
      },
      {
        title: "Anti-mousse pulvérisé",
        text: "Un anti-mousse est pulvérisé sur toute la couverture : il détruit les mousses et lichens restants et ralentit leur retour.",
      },
      {
        title: "Protection hydrofuge",
        text: "Une protection hydrofuge est appliquée pour finir : elle limite l’absorption d’eau par les tuiles et les protège plus longtemps.",
      },
    ],
    steps: [
      {
        title: "Inspection et devis",
        text: "État de la couverture, tuiles cassées ou déplacées, faîtages, gouttières. Un devis gratuit détaille le traitement et les éventuelles réparations.",
      },
      {
        title: "Grattage à la brosse métallique",
        text: "Un compagnon gratte les tuiles à la brosse métallique et retire le plus gros des mousses et des lichens. Les gouttières et les abords sont protégés.",
      },
      {
        title: "Pulvérisation de l’anti-mousse",
        text: "L’anti-mousse est pulvérisé sur l’ensemble de la toiture. Il élimine les mousses et lichens restants, jusque dans les recoins des tuiles.",
      },
      {
        title: "Protection hydrofuge",
        text: "Une protection hydrofuge est appliquée pour limiter l’absorption d’eau par les tuiles et retarder le retour des mousses.",
      },
      {
        title: "Résultat en 3 à 9 mois",
        text: "L’anti-mousse agit dans la durée : les derniers dépôts se détachent avec les pluies. Les effets sont visibles dans un délai de 3 à 9 mois.",
      },
    ],
    faq: [
      {
        q: "À quelle fréquence faut-il traiter une toiture ?",
        a: "Cela dépend de l’exposition (orientation, arbres à proximité, humidité). Une inspection permet de juger du bon moment ; il n’est pas utile de traiter une toiture saine.",
      },
      {
        q: "Quand le résultat est-il visible ?",
        a: "Le grattage retire tout de suite le plus gros des mousses. L’anti-mousse, lui, agit progressivement : les effets complets sont visibles dans un délai de 3 à 9 mois, le temps que les pluies emportent les derniers dépôts.",
      },
      {
        q: "Remplacez-vous les tuiles cassées ?",
        a: "Nous signalons les tuiles abîmées lors de l’inspection et pouvons prévoir leur remplacement dans le devis.",
      },
      {
        q: "Le traitement change-t-il la couleur des tuiles ?",
        a: "Le nettoyage leur rend leur teinte d’origine. Selon le produit de protection choisi, l’aspect peut rester naturel ou être ravivé ; nous vous montrons les options avant l’intervention.",
      },
      {
        q: "Intervenez-vous en même temps sur les gouttières ?",
        a: "Oui, nous pouvons prévoir le nettoyage des gouttières dans la même intervention, et les remplacer si elles sont en mauvais état.",
      },
    ],
    cover: {
      src: "/images/avant-apres/tuiles-avant.jpg",
      alt: "Toiture en tuiles couverte de lichens et de mousses, avant traitement",
    },
    beforeAfter: {
      before: {
        src: "/images/avant-apres/tuiles-avant.jpg",
        alt: "Toiture en tuiles couverte de lichens et de mousses, avant traitement",
      },
      after: {
        src: "/images/avant-apres/tuiles-apres.jpg",
        alt: "La même toiture, propre, après démoussage et traitement (simulation)",
      },
      width: 960,
      height: 1280,
    },
  },
];

export function getMetier(slug: string) {
  return metiers.find((m) => m.slug === slug);
}

export const categoryLabels: Record<GalleryCategory, string> = {
  etancheite: "Étanchéité",
  zinguerie: "Zinguerie",
  "sous-faces": "Sous-faces et bandeaux",
  tuiles: "Tuiles",
};
