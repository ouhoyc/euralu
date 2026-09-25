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
  /** Comparateur avant / après affiché à côté de l'introduction (remplace la photo de couverture). */
  beforeAfter?: {
    before: { src: string; alt: string };
    after: { src: string; alt: string };
    width: number;
    height: number;
    caption: string;
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
      "Étanchéité de toitures terrasses neuves et en rénovation : membranes, relevés, couvertines aluminium, toitures végétalisées. EURALU, Lyon, Isère, Rhône. Devis gratuit.",
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
          "Sur un toit en pente, l’eau s’écoule d’elle-même. Sur une toiture terrasse, la pente est très faible : l’eau reste plus longtemps en contact avec la surface et s’infiltre à la moindre faiblesse. L’étanchéité doit donc former une peau continue, sans raccord approximatif, depuis le centre de la toiture jusqu’en haut des murs qui l’entourent.",
          "Une infiltration sur une toiture terrasse se remarque souvent tard, quand une tache apparaît au plafond. L’eau a alors parfois déjà mouillé l’isolant. C’est pourquoi nous soignons autant la pose initiale que le diagnostic en rénovation.",
        ],
      },
      {
        title: "Les couches d’une toiture terrasse, dans l’ordre de pose",
        paragraphs: [
          "Le support (dalle béton, bois ou bac acier) reçoit d’abord un pare-vapeur. Il empêche l’humidité intérieure de la maison de migrer vers l’isolant, et il remonte le long des acrotères, les murets qui bordent la terrasse.",
          "Vient ensuite l’isolant thermique, posé en panneaux à joints décalés pour éviter les ponts thermiques. Par-dessus, la membrane d’étanchéité est déroulée en lés qui se chevauchent. Il existe plusieurs familles de membranes (bitume élastomère, membranes synthétiques…) : le système retenu dépend du support, de l’usage de la toiture et de son accessibilité, et il est défini lors de la visite.",
          "Les relevés prolongent l’étanchéité verticalement contre les acrotères et les façades. Les couvertines en aluminium coiffent ensuite le haut des murs. Enfin, sur une toiture non accessible, une couche de gravillons protège la membrane des UV et des variations de température.",
        ],
      },
      {
        title: "Points singuliers : là où naissent la plupart des fuites",
        paragraphs: [
          "Angles rentrants et sortants, jonctions avec la façade, entrées d’eaux pluviales, trop-pleins, sorties de ventilation, seuils de portes-fenêtres : ce sont les endroits où la membrane doit changer de direction ou être traversée. Nous les traitons pièce par pièce, avec des renforts et des raccords adaptés, car c’est là que se joue la durabilité de l’ouvrage.",
        ],
      },
      {
        title: "Construction neuve ou rénovation",
        paragraphs: [
          "En construction neuve, nous intervenons pour des particuliers comme pour des constructeurs de maisons individuelles et des lotisseurs, en suivant le planning du chantier.",
          "En rénovation, la visite permet de déterminer si une réparation localisée suffit (un relevé décollé, une évacuation mal raccordée) ou si la réfection complète est préférable. Le devis détaille poste par poste ce qui est prévu : dépose éventuelle de l’ancienne étanchéité, reprise du support, système proposé, traitement des points singuliers et finitions.",
        ],
      },
      {
        title: "Toitures végétalisées",
        paragraphs: [
          "Une toiture terrasse peut aussi être végétalisée. L’étanchéité est alors adaptée pour résister aux racines, une bande stérile en gravillons est laissée en périphérie et autour des évacuations, et l’écoulement de l’eau est étudié avec soin.",
        ],
      },
      {
        title: "Entretenir sa toiture terrasse",
        paragraphs: [
          "Une toiture terrasse demande peu d’entretien, mais un contrôle régulier évite bien des dégâts : dégager les feuilles et débris qui bouchent les évacuations, vérifier que l’eau ne stagne pas après la pluie et surveiller l’état des relevés et des couvertines. Au moindre doute, une visite permet d’intervenir avant que l’eau n’atteigne l’isolant.",
        ],
      },
      {
        title: "Notre zone d’intervention",
        paragraphs: [
          "Basée à Saint-Clair-du-Rhône, EURALU intervient à Lyon et dans son agglomération, dans le Rhône, en Isère et dans le secteur de Vienne. La visite et le devis sont gratuits et sans engagement.",
        ],
      },
    ],
    savoirFaire: [
      {
        title: "Membranes adaptées au support",
        text: "Le choix du système d’étanchéité dépend du support (béton, bois, bac acier), de l’usage de la toiture et de son accessibilité. Il est défini lors de la visite technique.",
      },
      {
        title: "Relevés et points singuliers",
        text: "Relevés contre façade, angles, entrées d’eaux pluviales et trop-pleins sont traités avec soin : c’est là que se joue la durabilité de l’ouvrage.",
      },
      {
        title: "Couvertines aluminium",
        text: "Nous posons les couvertines qui coiffent les acrotères. Elles protègent le haut des murs et donnent une finition nette à la toiture.",
      },
      {
        title: "Toitures végétalisées",
        text: "Nous réalisons aussi des toitures terrasses végétalisées, avec étanchéité adaptée, bande stérile en gravillons et gestion des évacuations.",
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
        a: "Les signes les plus fréquents sont les traces d’humidité au plafond, les flaques qui stagnent longtemps après la pluie, des membranes fissurées, cloquées ou décollées au niveau des relevés. Une visite permet de dire s’il faut une réparation localisée ou une réfection complète.",
      },
      {
        q: "Intervenez-vous sur les maisons neuves ?",
        a: "Oui. Nous travaillons régulièrement pour des constructeurs de maisons individuelles et des lotisseurs, en respectant leur planning de chantier.",
      },
      {
        q: "Pouvez-vous refaire uniquement les couvertines ?",
        a: "Oui, nous posons ou remplaçons des couvertines aluminium seules, par exemple lorsque les anciennes sont abîmées ou mal fixées.",
      },
      {
        q: "Quelle différence entre une toiture terrasse accessible et non accessible ?",
        a: "Une toiture accessible est prévue pour qu’on y marche (terrasse d’agrément) : l’étanchéité reçoit une protection adaptée, dalles ou platelage par exemple. Une toiture non accessible n’est parcourue que pour l’entretien : la membrane est le plus souvent protégée par des gravillons.",
      },
      {
        q: "Faut-il entretenir une toiture terrasse ?",
        a: "Oui, légèrement : nettoyer les évacuations, vérifier que l’eau ne stagne pas et surveiller les relevés et les couvertines. Ces contrôles simples évitent qu’une petite faiblesse ne devienne une infiltration.",
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
    title: "Zinguerie zinc et aluminium",
    metaTitle: "Zingueur à Lyon : gouttières, descentes et couvertines zinc ou alu",
    metaDescription:
      "Pose de gouttières, descentes pluviales, couvertines et habillages en zinc ou en aluminium laqué. Zingueur à Lyon, Vienne et Saint-Clair-du-Rhône. Devis gratuit.",
    kicker: "Gouttières, descentes, couvertines, habillages",
    summary:
      "Gouttières, descentes pluviales, couvertines et habillages en zinc ou en aluminium laqué, posés au cordeau.",
    intro: [
      "La zinguerie collecte et évacue l’eau de pluie loin des façades et des fondations. Des gouttières mal dimensionnées, des pentes approximatives ou des raccords fuyards finissent par marquer les enduits et abîmer les bas de murs.",
      "Nous posons des gouttières, des descentes, des couvertines et des habillages en zinc ou en aluminium laqué, sur des maisons neuves comme en remplacement. Les coloris aluminium permettent de coordonner la zinguerie avec les menuiseries et les sous-faces.",
    ],
    savoirFaire: [
      {
        title: "Zinc",
        text: "Matériau traditionnel au vieillissement naturel. Assemblages et naissances soudés à l’étain, pour des raccords durables.",
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
        title: "Couvertines et habillages",
        text: "Couvertines d’acrotères, habillages de rives et de bandeaux, ajustés sur place pour une finition nette.",
      },
    ],
    steps: [
      {
        title: "Relevé sur place",
        text: "Métrés, surfaces de toiture, points de descente et contraintes de façade.",
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
        q: "Posez-vous aussi les couvertines de murets et d’acrotères ?",
        a: "Oui, nous posons des couvertines en aluminium pour les acrotères de toitures terrasses et les murets.",
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
    metaTitle: "Habillage de sous-face PVC et bandeaux de toit : Lyon, Isère, Rhône",
    metaDescription:
      "Habillage de sous-faces et bandeaux en PVC ou frisette, blanc, anthracite ou aspect bois. Fini l’entretien des débords de toit. EURALU, région lyonnaise. Devis gratuit.",
    kicker: "Débords de toit, rives, bandeaux",
    summary:
      "Des débords de toit habillés en PVC ou en frisette : plus de peinture à refaire, et des lignes nettes.",
    intro: [
      "Les sous-faces et bandeaux en bois demandent un entretien régulier : lasure, peinture, remplacement des planches abîmées. Leur habillage en PVC supprime cet entretien et redonne un aspect net à la maison.",
      "Nous habillons les débords de toit, rives et bandeaux en PVC, en construction neuve comme en rénovation. Le choix est large : blanc, gris anthracite ou aspect bois, lames lisses ou frisette. L’habillage peut être coordonné avec les gouttières.",
    ],
    savoirFaire: [
      {
        title: "PVC sans entretien",
        text: "Les lames PVC ne se peignent pas et ne pourrissent pas. Un simple nettoyage occasionnel suffit.",
      },
      {
        title: "Coloris et aspects",
        text: "Blanc, anthracite, aspect bois : nous vous présentons les échantillons pour choisir en accord avec la façade.",
      },
      {
        title: "Rénovation soignée",
        text: "Nous vérifions d’abord l’état des bois existants : les parties abîmées sont reprises avant la pose de l’habillage.",
      },
      {
        title: "Ventilation préservée",
        text: "La ventilation de la sous-toiture est conservée, afin d’éviter la condensation sous le toit.",
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
      "Nettoyage, démoussage et traitement de toitures en tuiles pour protéger votre couverture. EURALU intervient à Lyon, Vienne, en Isère et dans le Rhône. Devis gratuit.",
    kicker: "Nettoyage, démoussage, protection",
    summary:
      "Mousses et lichens retiennent l’humidité et abîment les tuiles. Un traitement adapté prolonge la vie de la couverture.",
    intro: [
      "Avec le temps, mousses, lichens et salissures s’installent sur les tuiles. Ils retiennent l’humidité, favorisent le gel et peuvent gêner l’écoulement de l’eau jusqu’aux gouttières.",
      "Nous nettoyons et traitons les toitures en tuiles de maisons individuelles. L’intervention commence par une inspection de la couverture : les tuiles cassées ou déplacées sont signalées avant tout traitement.",
    ],
    savoirFaire: [
      {
        title: "Inspection préalable",
        text: "Avant tout nettoyage, nous vérifions l’état des tuiles, des faîtages et des rives.",
      },
      {
        title: "Nettoyage adapté",
        text: "La méthode de nettoyage est choisie selon le type de tuile et son état, pour ne pas fragiliser la couverture.",
      },
      {
        title: "Traitement anti-mousse",
        text: "Application d’un produit qui élimine les mousses et lichens et ralentit leur retour.",
      },
      {
        title: "Protection",
        text: "Sur demande, application d’un traitement de protection qui limite l’absorption d’eau par les tuiles.",
      },
    ],
    steps: [
      {
        title: "Inspection",
        text: "État général de la couverture, tuiles abîmées, faîtages, gouttières.",
      },
      {
        title: "Devis",
        text: "Un devis gratuit, qui précise les produits proposés et les éventuelles réparations.",
      },
      {
        title: "Nettoyage",
        text: "Retrait des mousses et salissures, protection des abords et des gouttières.",
      },
      {
        title: "Traitement",
        text: "Application du traitement anti-mousse, puis de la protection si elle est prévue.",
      },
      {
        title: "Contrôle",
        text: "Vérification de la couverture et des gouttières, nettoyage du chantier.",
      },
    ],
    faq: [
      {
        q: "À quelle fréquence faut-il traiter une toiture ?",
        a: "Cela dépend de l’exposition (orientation, arbres à proximité, humidité). Une inspection permet de juger du bon moment ; il n’est pas utile de traiter une toiture saine.",
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
      caption: "Photo « avant » réelle. Image « après » : simulation du résultat après traitement.",
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
