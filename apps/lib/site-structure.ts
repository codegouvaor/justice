/**
 * URL structure of the public portal of the Banque centrale d'Astoria (BCA).
 *
 * Hrefs are locale-agnostic pathnames: the next-intl Link (registered as the
 * ADS link renderer) prefixes the active locale automatically. Labels are
 * never stored here — they come from the message catalogs through the key
 * provided by each entry (see `apps/messages/{fr,en}.json`).
 *
 * Architecture of the navigation:
 *
 *   primaryNavigation  → the seven entries of the portal. Each entry opens a
 *                        mega-menu panel structured in four themes of four
 *                        links:
 *                            7 entrées × 4 thèmes × 4 liens
 *
 * The information architecture reflects the institutional perimeter of a
 * central bank — not that of a ministry. Six entries cover the public policy
 * fields of the BCA (monnaie, politique monétaire, banques, marchés
 * financiers, paiements, système financier); a seventh, distinct entry,
 * “La Banque centrale”, presents the institution itself.
 *
 *   Monnaie              → comprendre : la monnaie astorienne, billets, pièces, circulation
 *   Politique monétaire  → décider   : décisions, taux directeurs, instruments, publications
 *   Banques              → encadrer  : établissements, agréments, réglementation, supervision
 *   Marchés financiers   → suivre    : marchés, stabilité, régulation, données
 *   Paiements            → régler    : systèmes de paiement, interbancaire, règlement, innovation
 *   Système financier    → stabiliser : liquidité, réserves, infrastructures, stabilité systémique
 *   La Banque centrale   → incarner  : présentation, gouvernance, organisation, carrières
 *
 * `Rechercher` and `Se connecter` are transversal functions of the platform
 * (search, MyGouv identity), not categories of the catalogue: they live in
 * the header, outside the primary navigation.
 *
 * The operational banking dimension of the BCA (banque de l'État,
 * établissements financiers, système de paiement, services bancaires
 * autorisés) is deliberately kept out of the seven editorial entries: it is an
 * operational interface, prepared in `platformNav` below, that can ship later
 * as a distinct “Services / Plateforme BCA” space without reshaping the header
 * architecture.
 *
 * Everything is configuration-driven: the header and the footer derive their
 * markup from this array, so adding a domain/theme/link later never requires
 * rewriting a component.
 */
export const PORTAL_HOME = "/";

/** The seven entries of the portal — both `nav.primary` and `footer.columns` keys. */
export type PrimaryNavKey =
  | "monnaie"
  | "politiqueMonetaire"
  | "banques"
  | "marchesFinanciers"
  | "paiements"
  | "systemeFinancier"
  | "banqueCentrale";

/** A destination inside a mega-menu panel; its label is a `nav.panel` message key. */
export type NavigationLink = {
  labelKey: string;
  href: string;
};

/**
 * A theme of a navigation section. In the mega-menu panel it heads one of the
 * four columns (`labelKey` → `nav.panel.<section>.<theme>.title`); in the
 * footer it becomes a destination of the domain column. It carries the four
 * destinations of the theme.
 */
export type NavigationItem = NavigationLink & {
  /** Related destinations nested under this theme. */
  links: ReadonlyArray<NavigationLink>;
};

/**
 * One top-level entry of the Government Header navigation.
 *
 * Navigation principle (info.gouv.fr-inspired, adapted to Astoria): the header
 * is organised around the missions of the central bank and the understanding
 * of the monetary and financial system — not around a ministry's internal
 * structure. Each entry opens a mega-menu panel composed of
 *  - a leader band: the entry name, a one-line description and the main
 *    action of the section (“Tout sur la monnaie”, …),
 *  - four themes, each headed by its title and followed by its four
 *    destinations.
 *
 * Top-level labels resolve under `nav.primary` (`labelKey`), panel content
 * under `nav.panel` (`titleKey`, `paragraphKey`, nested `labelKey`s).
 */
export type NavigationSection = {
  type: "megaMenu";
  /** Message key (`nav.primary`) of the top-level tab. */
  labelKey: PrimaryNavKey;
  /** Landing page of the section, used by the leader action and active-state detection. */
  href: string;
  /** Leader band shown on top of the panel. */
  leader: {
    titleKey: string;
    paragraphKey: string;
    link: NavigationLink;
  };
  /** The four themes of the section, each with its four links. */
  primaryItems: ReadonlyArray<NavigationItem>;
};

export type FooterColumn = {
  /** Message key (`footer.columns`) of the column heading. */
  columnKey: string;
  links: ReadonlyArray<NavigationLink>;
};

export const sectionPaths = {
  monnaie: "/monnaie",
  politiqueMonetaire: "/politique-monetaire",
  banques: "/banques",
  marchesFinanciers: "/marches-financiers",
  paiements: "/paiements",
  systemeFinancier: "/systeme-financier",
  banqueCentrale: "/la-banque-centrale",
} as const;

export const legalPaths = {
  accessibility: "/legal/accessibility",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  cookies: "/legal/cookies",
  sitemap: "/sitemap",
} as const;

export const searchPath = "/search";

/** Root of the future operational “Services / Plateforme BCA” space. */
export const platformPath = "/services";

/** DOM ids used as skip-link targets. */
export const pageAnchors = {
  content: "main-content",
  footer: "main-footer",
} as const;

/**
 * Operational interface of the BCA, distinct from the seven editorial entries
 * of the portal. A central bank is also a bank: the State's banker, the
 * operator of the payment and settlement infrastructures and the supervisor
 * of the banking system. These services are *not* a public-policy subject of
 * the header — they are an operational platform for a restricted audience
 * (the State, credit institutions, payment operators).
 *
 * `platformNav` is the extension point: when the platform ships, promote one
 * of the spaces below to a dedicated entry or build a separate “Services /
 * Plateforme BCA” area on `platformPath` — without reshaping the six subjects
 * and the “La Banque centrale” entry above.
 */
export const platformNav: ReadonlyArray<NavigationItem> = [
  {
    labelKey: "platform.banqueEtat.title",
    href: `${platformPath}/banque-de-l-etat`,
    links: [
      { labelKey: "platform.banqueEtat.compteEtat", href: `${platformPath}/banque-de-l-etat/compte-de-l-etat` },
      { labelKey: "platform.banqueEtat.tresorerieEtat", href: `${platformPath}/banque-de-l-etat/tresorerie-de-l-etat` },
      { labelKey: "platform.banqueEtat.emissionsDette", href: `${platformPath}/banque-de-l-etat/emissions-de-dette` },
      { labelKey: "platform.banqueEtat.gestionReserves", href: `${platformPath}/banque-de-l-etat/gestion-des-reserves` },
    ],
  },
  {
    labelKey: "platform.etablissementsFinanciers.title",
    href: `${platformPath}/etablissements-financiers`,
    links: [
      { labelKey: "platform.etablissementsFinanciers.acces", href: `${platformPath}/etablissements-financiers/acces` },
      { labelKey: "platform.etablissementsFinanciers.comptes", href: `${platformPath}/etablissements-financiers/comptes` },
      { labelKey: "platform.etablissementsFinanciers.reserveObligatoire", href: `${platformPath}/etablissements-financiers/reserve-obligatoire` },
      { labelKey: "platform.etablissementsFinanciers.refinancement", href: `${platformPath}/etablissements-financiers/refinancement` },
    ],
  },
  {
    labelKey: "platform.systemePaiement.title",
    href: `${platformPath}/systeme-de-paiement`,
    links: [
      { labelKey: "platform.systemePaiement.participants", href: `${platformPath}/systeme-de-paiement/participants` },
      { labelKey: "platform.systemePaiement.reglements", href: `${platformPath}/systeme-de-paiement/reglements` },
      { labelKey: "platform.systemePaiement.standards", href: `${platformPath}/systeme-de-paiement/standards` },
      { labelKey: "platform.systemePaiement.surveillance", href: `${platformPath}/systeme-de-paiement/surveillance` },
    ],
  },
  {
    labelKey: "platform.servicesAutorises.title",
    href: `${platformPath}/services-bancaires-autorises`,
    links: [
      { labelKey: "platform.servicesAutorises.liste", href: `${platformPath}/services-bancaires-autorises/liste` },
      { labelKey: "platform.servicesAutorises.demande", href: `${platformPath}/services-bancaires-autorises/demande` },
      { labelKey: "platform.servicesAutorises.suivi", href: `${platformPath}/services-bancaires-autorises/suivi` },
      { labelKey: "platform.servicesAutorises.documentation", href: `${platformPath}/services-bancaires-autorises/documentation` },
    ],
  },
];

/**
 * Main navigation of the Government Header of the Banque centrale d'Astoria —
 * the permanent information architecture of the portal, organised in seven
 * entries:
 *
 *   Monnaie              → comprendre : la monnaie astorienne, billets et pièces, circulation
 *   Politique monétaire  → décider   : décisions, taux directeurs, instruments, publications
 *   Banques              → encadrer  : établissements, agréments et licences, réglementation, supervision
 *   Marchés financiers   → suivre    : marchés, stabilité financière, régulation, données
 *   Paiements            → régler    : systèmes de paiement, interbancaire, règlement, innovation
 *   Système financier    → stabiliser : liquidité, réserves, infrastructures, stabilité systémique
 *   La Banque centrale   → incarner  : présentation, gouvernance, organisation, carrières
 *
 * The six first entries present the *public-policy* perimeter of the BCA; the
 * seventh, distinct, presents the institution itself — the counterpart of
 * “Le Ministère” on the ministry portals. The BCA is *not* the sole
 * supervisor of the financial system: where the Astorian institutional model
 * separates supervision between the BCA and the AMSF, the navigation reflects
 * that split rather than claiming an exclusive mandate.
 *
 * Each entry opens a mega-menu panel with a leader band and four themes — each
 * theme headed by its title and followed by its four destinations. The panel
 * is not the sitemap of the portal; it exposes the destinations that matter to
 * the visitor journey. The structure is configuration-driven: adding a section
 * only means adding an entry here (and the matching messages).
 *
 * The operational banking interface is kept out of this editorial structure:
 * see `platformNav` for the future “Services / Plateforme BCA” space.
 *
 * Hrefs follow the URL plan of the portal; several point to pages being
 * published and will resolve as soon as those sections ship.
 */
export const primaryNavigation: ReadonlyArray<NavigationSection> = [
  {
    type: "megaMenu",
    labelKey: "monnaie",
    href: sectionPaths.monnaie,
    leader: {
      titleKey: "monnaie.title",
      paragraphKey: "monnaie.text",
      link: { labelKey: "monnaie.allLink", href: sectionPaths.monnaie },
    },
    primaryItems: [
      {
        labelKey: "monnaie.laMonnaieAstorienne.title",
        href: "/monnaie/la-monnaie-astorienne",
        links: [
          { labelKey: "monnaie.laMonnaieAstorienne.monnaieOfficielle", href: "/monnaie/la-monnaie-astorienne/monnaie-officielle" },
          { labelKey: "monnaie.laMonnaieAstorienne.uniteMonetaire", href: "/monnaie/la-monnaie-astorienne/unite-monetaire" },
          { labelKey: "monnaie.laMonnaieAstorienne.emisParLaBca", href: "/monnaie/la-monnaie-astorienne/emise-par-la-bca" },
          { labelKey: "monnaie.laMonnaieAstorienne.pouvoirLiberalatoire", href: "/monnaie/la-monnaie-astorienne/pouvoir-liberatoire" },
        ],
      },
      {
        labelKey: "monnaie.billetsEtPieces.title",
        href: "/monnaie/billets-et-pieces",
        links: [
          { labelKey: "monnaie.billetsEtPieces.billets", href: "/monnaie/billets-et-pieces/billets" },
          { labelKey: "monnaie.billetsEtPieces.pieces", href: "/monnaie/billets-et-pieces/pieces" },
          { labelKey: "monnaie.billetsEtPieces.caracteristiques", href: "/monnaie/billets-et-pieces/caracteristiques-et-securite" },
          { labelKey: "monnaie.billetsEtPieces.authentification", href: "/monnaie/billets-et-pieces/authentifier-un-billet" },
        ],
      },
      {
        labelKey: "monnaie.circulationMonetaire.title",
        href: "/monnaie/circulation-monetaire",
        links: [
          { labelKey: "monnaie.circulationMonetaire.emissions", href: "/monnaie/circulation-monetaire/emissions-monetaires" },
          { labelKey: "monnaie.circulationMonetaire.circulation", href: "/monnaie/circulation-monetaire/circulation-de-la-monnaie" },
          { labelKey: "monnaie.circulationMonetaire.retrait", href: "/monnaie/circulation-monetaire/retrait-des-billets" },
          { labelKey: "monnaie.circulationMonetaire.fauxBillets", href: "/monnaie/circulation-monetaire/lutte-contre-la-fausse-monnaie" },
        ],
      },
      {
        labelKey: "monnaie.donneesMonetaires.title",
        href: "/monnaie/donnees-monetaires",
        links: [
          { labelKey: "monnaie.donneesMonetaires.statistiques", href: "/monnaie/donnees-monetaires/statistiques-monetaires" },
          { labelKey: "monnaie.donneesMonetaires.agregats", href: "/monnaie/donnees-monetaires/agregats-monetaires" },
          { labelKey: "monnaie.donneesMonetaires.encours", href: "/monnaie/donnees-monetaires/encours-monetaires" },
          { labelKey: "monnaie.donneesMonetaires.publications", href: "/monnaie/donnees-monetaires/publications" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "politiqueMonetaire",
    href: sectionPaths.politiqueMonetaire,
    leader: {
      titleKey: "politiqueMonetaire.title",
      paragraphKey: "politiqueMonetaire.text",
      link: { labelKey: "politiqueMonetaire.allLink", href: sectionPaths.politiqueMonetaire },
    },
    primaryItems: [
      {
        labelKey: "politiqueMonetaire.decisions.title",
        href: "/politique-monetaire/decisions",
        links: [
          { labelKey: "politiqueMonetaire.decisions.dernieresDecisions", href: "/politique-monetaire/decisions/dernieres-decisions" },
          { labelKey: "politiqueMonetaire.decisions.calendrier", href: "/politique-monetaire/decisions/calendrier-des-decisions" },
          { labelKey: "politiqueMonetaire.decisions.communiques", href: "/politique-monetaire/decisions/communiques" },
          { labelKey: "politiqueMonetaire.decisions.objectifs", href: "/politique-monetaire/decisions/objectifs-monetaires" },
        ],
      },
      {
        labelKey: "politiqueMonetaire.tauxDirecteurs.title",
        href: "/politique-monetaire/taux-directeurs",
        links: [
          { labelKey: "politiqueMonetaire.tauxDirecteurs.tauxDirecteur", href: "/politique-monetaire/taux-directeurs/taux-directeur" },
          { labelKey: "politiqueMonetaire.tauxDirecteurs.facilites", href: "/politique-monetaire/taux-directeurs/facilites" },
          { labelKey: "politiqueMonetaire.tauxDirecteurs.evolution", href: "/politique-monetaire/taux-directeurs/evolution-des-taux" },
          { labelKey: "politiqueMonetaire.tauxDirecteurs.repercussion", href: "/politique-monetaire/taux-directeurs/repercussion-sur-le-credit" },
        ],
      },
      {
        labelKey: "politiqueMonetaire.instrumentsMonetaires.title",
        href: "/politique-monetaire/instruments-monetaires",
        links: [
          { labelKey: "politiqueMonetaire.instrumentsMonetaires.operations", href: "/politique-monetaire/instruments-monetaires/operations-de-marche" },
          { labelKey: "politiqueMonetaire.instrumentsMonetaires.reserveObligatoire", href: "/politique-monetaire/instruments-monetaires/reserve-obligatoire" },
          { labelKey: "politiqueMonetaire.instrumentsMonetaires.refinancement", href: "/politique-monetaire/instruments-monetaires/refinancement" },
          { labelKey: "politiqueMonetaire.instrumentsMonetaires.transmission", href: "/politique-monetaire/instruments-monetaires/transmission-de-la-politique-monetaire" },
        ],
      },
      {
        labelKey: "politiqueMonetaire.publications.title",
        href: "/politique-monetaire/publications",
        links: [
          { labelKey: "politiqueMonetaire.publications.rapports", href: "/politique-monetaire/publications/rapports" },
          { labelKey: "politiqueMonetaire.publications.analyses", href: "/politique-monetaire/publications/analyses-economiques" },
          { labelKey: "politiqueMonetaire.publications.projections", href: "/politique-monetaire/publications/projections" },
          { labelKey: "politiqueMonetaire.publications.discours", href: "/politique-monetaire/publications/discours" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "banques",
    href: sectionPaths.banques,
    leader: {
      titleKey: "banques.title",
      paragraphKey: "banques.text",
      link: { labelKey: "banques.allLink", href: sectionPaths.banques },
    },
    primaryItems: [
      {
        labelKey: "banques.etablissementsBancaires.title",
        href: "/banques/etablissements-bancaires",
        links: [
          { labelKey: "banques.etablissementsBancaires.registre", href: "/banques/etablissements-bancaires/registre-des-etablissements-agrees" },
          { labelKey: "banques.etablissementsBancaires.categories", href: "/banques/etablissements-bancaires/categories-d-etablissements" },
          { labelKey: "banques.etablissementsBancaires.comptes", href: "/banques/etablissements-bancaires/comptes-des-etablissements" },
          { labelKey: "banques.etablissementsBancaires.reclamations", href: "/banques/etablissements-bancaires/reclamations" },
        ],
      },
      {
        labelKey: "banques.agrementsEtLicences.title",
        href: "/banques/agrements-et-licences",
        links: [
          { labelKey: "banques.agrementsEtLicences.conditions", href: "/banques/agrements-et-licences/conditions-d-agrement" },
          { labelKey: "banques.agrementsEtLicences.demande", href: "/banques/agrements-et-licences/demande-d-agrement" },
          { labelKey: "banques.agrementsEtLicences.licencesBancaires", href: "/banques/agrements-et-licences/licences-bancaires" },
          { labelKey: "banques.agrementsEtLicences.retrait", href: "/banques/agrements-et-licences/retrait-d-agrement" },
        ],
      },
      {
        labelKey: "banques.reglementationBancaire.title",
        href: "/banques/reglementation-bancaire",
        links: [
          { labelKey: "banques.reglementationBancaire.textes", href: "/banques/reglementation-bancaire/textes-applicables" },
          { labelKey: "banques.reglementationBancaire.prudentielles", href: "/banques/reglementation-bancaire/normes-prudentielles" },
          { labelKey: "banques.reglementationBancaire.destineeAuxEtablissements", href: "/banques/reglementation-bancaire/informations-pour-les-etablissements" },
          { labelKey: "banques.reglementationBancaire.amsf", href: "/banques/reglementation-bancaire/competences-de-l-amsf" },
        ],
      },
      {
        labelKey: "banques.supervision.title",
        href: "/banques/supervision",
        links: [
          { labelKey: "banques.supervision.roleBca", href: "/banques/supervision/role-de-la-bca" },
          { labelKey: "banques.supervision.roleAmsf", href: "/banques/supervision/role-de-l-amsf" },
          { labelKey: "banques.supervision.controles", href: "/banques/supervision/controles-et-inspections" },
          { labelKey: "banques.supervision.sanctions", href: "/banques/supervision/sanctions-et-mesures" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "marchesFinanciers",
    href: sectionPaths.marchesFinanciers,
    leader: {
      titleKey: "marchesFinanciers.title",
      paragraphKey: "marchesFinanciers.text",
      link: { labelKey: "marchesFinanciers.allLink", href: sectionPaths.marchesFinanciers },
    },
    primaryItems: [
      {
        labelKey: "marchesFinanciers.marches.title",
        href: "/marches-financiers/marches",
        links: [
          { labelKey: "marchesFinanciers.marches.fonctionnement", href: "/marches-financiers/marches/fonctionnement-des-marches" },
          { labelKey: "marchesFinanciers.marches.infrastructures", href: "/marches-financiers/marches/infrastructures-de-marche" },
          { labelKey: "marchesFinanciers.marches.surveillance", href: "/marches-financiers/marches/surveillance-des-marches" },
          { labelKey: "marchesFinanciers.marches.interactionsAmsf", href: "/marches-financiers/marches/interactions-avec-l-amsf" },
        ],
      },
      {
        labelKey: "marchesFinanciers.stabiliteFinanciere.title",
        href: "/marches-financiers/stabilite-financiere",
        links: [
          { labelKey: "marchesFinanciers.stabiliteFinanciere.rapport", href: "/marches-financiers/stabilite-financiere/rapport-de-stabilite-financiere" },
          { labelKey: "marchesFinanciers.stabiliteFinanciere.risques", href: "/marches-financiers/stabilite-financiere/risques-systemiques" },
          { labelKey: "marchesFinanciers.stabiliteFinanciere.vulnerabilites", href: "/marches-financiers/stabilite-financiere/vulnerabilites" },
          { labelKey: "marchesFinanciers.stabiliteFinanciere.indicateurs", href: "/marches-financiers/stabilite-financiere/indicateurs" },
        ],
      },
      {
        labelKey: "marchesFinanciers.regulation.title",
        href: "/marches-financiers/regulation",
        links: [
          { labelKey: "marchesFinanciers.regulation.reglementation", href: "/marches-financiers/regulation/reglementation-des-marches" },
          { labelKey: "marchesFinanciers.regulation.supervision", href: "/marches-financiers/regulation/supervision-des-marches" },
          { labelKey: "marchesFinanciers.regulation.amsf", href: "/marches-financiers/regulation/competences-de-l-amsf" },
          { labelKey: "marchesFinanciers.regulation.consommateurs", href: "/marches-financiers/regulation/protection-des-investisseurs" },
        ],
      },
      {
        labelKey: "marchesFinanciers.donneesStatistiques.title",
        href: "/marches-financiers/donnees-et-statistiques",
        links: [
          { labelKey: "marchesFinanciers.donneesStatistiques.statistiques", href: "/marches-financiers/donnees-et-statistiques/statistiques-financieres" },
          { labelKey: "marchesFinanciers.donneesStatistiques.indicateurs", href: "/marches-financiers/donnees-et-statistiques/indicateurs-financiers" },
          { labelKey: "marchesFinanciers.donneesStatistiques.publications", href: "/marches-financiers/donnees-et-statistiques/publications" },
          { labelKey: "marchesFinanciers.donneesStatistiques.donneesOuvertes", href: "/marches-financiers/donnees-et-statistiques/donnees-ouvertes" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "paiements",
    href: sectionPaths.paiements,
    leader: {
      titleKey: "paiements.title",
      paragraphKey: "paiements.text",
      link: { labelKey: "paiements.allLink", href: sectionPaths.paiements },
    },
    primaryItems: [
      {
        labelKey: "paiements.systemesDePaiement.title",
        href: "/paiements/systemes-de-paiement",
        links: [
          { labelKey: "paiements.systemesDePaiement.nationaux", href: "/paiements/systemes-de-paiement/systemes-nationaux" },
          { labelKey: "paiements.systemesDePaiement.fonctionnement", href: "/paiements/systemes-de-paiement/fonctionnement" },
          { labelKey: "paiements.systemesDePaiement.infrastructuresCritiques", href: "/paiements/systemes-de-paiement/infrastructures-critiques" },
          { labelKey: "paiements.systemesDePaiement.surveillance", href: "/paiements/systemes-de-paiement/surveillance" },
        ],
      },
      {
        labelKey: "paiements.paiementsInterbancaires.title",
        href: "/paiements/paiements-interbancaires",
        links: [
          { labelKey: "paiements.paiementsInterbancaires.systeme", href: "/paiements/paiements-interbancaires/systeme-interbancaire" },
          { labelKey: "paiements.paiementsInterbancaires.participants", href: "/paiements/paiements-interbancaires/participants" },
          { labelKey: "paiements.paiementsInterbancaires.transactions", href: "/paiements/paiements-interbancaires/transactions" },
          { labelKey: "paiements.paiementsInterbancaires.deroulement", href: "/paiements/paiements-interbancaires/deroulement-d-un-paiement" },
        ],
      },
      {
        labelKey: "paiements.reglement.title",
        href: "/paiements/reglement",
        links: [
          { labelKey: "paiements.reglement.reglementDesTransactions", href: "/paiements/reglement/reglement-des-transactions" },
          { labelKey: "paiements.reglement.compensation", href: "/paiements/reglement/compensation" },
          { labelKey: "paiements.reglement.monnaieCentrale", href: "/paiements/reglement/reglement-en-monnaie-centrale" },
          { labelKey: "paiements.reglement.finalite", href: "/paiements/reglement/finalite-du-reglement" },
        ],
      },
      {
        labelKey: "paiements.innovationFinanciere.title",
        href: "/paiements/innovation-financiere",
        links: [
          { labelKey: "paiements.innovationFinanciere.standards", href: "/paiements/innovation-financiere/standards-de-paiement" },
          { labelKey: "paiements.innovationFinanciere.innovation", href: "/paiements/innovation-financiere/innovation-financiere" },
          { labelKey: "paiements.innovationFinanciere.monnaieNumerique", href: "/paiements/innovation-financiere/monnaie-numerique-de-banque-centrale" },
          { labelKey: "paiements.innovationFinanciere.moyens", href: "/paiements/innovation-financiere/moyens-de-paiement" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "systemeFinancier",
    href: sectionPaths.systemeFinancier,
    leader: {
      titleKey: "systemeFinancier.title",
      paragraphKey: "systemeFinancier.text",
      link: { labelKey: "systemeFinancier.allLink", href: sectionPaths.systemeFinancier },
    },
    primaryItems: [
      {
        labelKey: "systemeFinancier.liquidite.title",
        href: "/systeme-financier/liquidite",
        links: [
          { labelKey: "systemeFinancier.liquidite.liquiditeDuSysteme", href: "/systeme-financier/liquidite/liquidite-du-systeme-bancaire" },
          { labelKey: "systemeFinancier.liquidite.operations", href: "/systeme-financier/liquidite/operations-de-liquidite" },
          { labelKey: "systemeFinancier.liquidite.facilites", href: "/systeme-financier/liquidite/facilites-permanentes" },
          { labelKey: "systemeFinancier.liquidite.prisesEnPension", href: "/systeme-financier/liquidite/prises-en-pension" },
        ],
      },
      {
        labelKey: "systemeFinancier.reserves.title",
        href: "/systeme-financier/reserves",
        links: [
          { labelKey: "systemeFinancier.reserves.reservesObligatoires", href: "/systeme-financier/reserves/reserves-obligatoires" },
          { labelKey: "systemeFinancier.reserves.reservesDeChange", href: "/systeme-financier/reserves/reserves-de-change" },
          { labelKey: "systemeFinancier.reserves.gestion", href: "/systeme-financier/reserves/gestion-des-reserves" },
          { labelKey: "systemeFinancier.reserves.comptes", href: "/systeme-financier/reserves/comptes-de-reserves" },
        ],
      },
      {
        labelKey: "systemeFinancier.infrastructureFinanciere.title",
        href: "/systeme-financier/infrastructure-financiere",
        links: [
          { labelKey: "systemeFinancier.infrastructureFinanciere.infrastructures", href: "/systeme-financier/infrastructure-financiere/infrastructures-financieres" },
          { labelKey: "systemeFinancier.infrastructureFinanciere.continuite", href: "/systeme-financier/infrastructure-financiere/continuite-des-services" },
          { labelKey: "systemeFinancier.infrastructureFinanciere.resilience", href: "/systeme-financier/infrastructure-financiere/resilience" },
          { labelKey: "systemeFinancier.infrastructureFinanciere.securite", href: "/systeme-financier/infrastructure-financiere/securite-des-infrastructures" },
        ],
      },
      {
        labelKey: "systemeFinancier.stabiliteSystemique.title",
        href: "/systeme-financier/stabilite-systemique",
        links: [
          { labelKey: "systemeFinancier.stabiliteSystemique.risquesSystemiques", href: "/systeme-financier/stabilite-systemique/risques-systemiques" },
          { labelKey: "systemeFinancier.stabiliteSystemique.mecanismes", href: "/systeme-financier/stabilite-systemique/mecanismes-de-crise" },
          { labelKey: "systemeFinancier.stabiliteSystemique.prevention", href: "/systeme-financier/stabilite-systemique/prevention-des-risques" },
          { labelKey: "systemeFinancier.stabiliteSystemique.coordination", href: "/systeme-financier/stabilite-systemique/coordination" },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "banqueCentrale",
    href: sectionPaths.banqueCentrale,
    leader: {
      titleKey: "banqueCentrale.title",
      paragraphKey: "banqueCentrale.text",
      link: { labelKey: "banqueCentrale.allLink", href: sectionPaths.banqueCentrale },
    },
    primaryItems: [
      {
        labelKey: "banqueCentrale.presentation.title",
        href: "/la-banque-centrale/presentation",
        links: [
          { labelKey: "banqueCentrale.presentation.missions", href: "/la-banque-centrale/presentation/missions" },
          { labelKey: "banqueCentrale.presentation.independance", href: "/la-banque-centrale/presentation/independance" },
          { labelKey: "banqueCentrale.presentation.historique", href: "/la-banque-centrale/presentation/historique" },
          { labelKey: "banqueCentrale.presentation.roleDansLaRepublique", href: "/la-banque-centrale/presentation/role-dans-la-republique" },
        ],
      },
      {
        labelKey: "banqueCentrale.gouvernance.title",
        href: "/la-banque-centrale/gouvernance",
        links: [
          { labelKey: "banqueCentrale.gouvernance.gouverneur", href: "/la-banque-centrale/gouvernance/gouverneur" },
          { labelKey: "banqueCentrale.gouvernance.conseil", href: "/la-banque-centrale/gouvernance/conseil-de-la-bca" },
          { labelKey: "banqueCentrale.gouvernance.politiqueDeGouvernance", href: "/la-banque-centrale/gouvernance/politique-de-gouvernance" },
          { labelKey: "banqueCentrale.gouvernance.transparence", href: "/la-banque-centrale/gouvernance/transparence" },
        ],
      },
      {
        labelKey: "banqueCentrale.organisation.title",
        href: "/la-banque-centrale/organisation",
        links: [
          { labelKey: "banqueCentrale.organisation.organigramme", href: "/la-banque-centrale/organisation/organigramme" },
          { labelKey: "banqueCentrale.organisation.directions", href: "/la-banque-centrale/organisation/directions" },
          { labelKey: "banqueCentrale.organisation.implantations", href: "/la-banque-centrale/organisation/implantations" },
          { labelKey: "banqueCentrale.organisation.relationsInstitutionnelles", href: "/la-banque-centrale/organisation/relations-institutionnelles" },
        ],
      },
      {
        labelKey: "banqueCentrale.carrieres.title",
        href: "/la-banque-centrale/carrieres",
        links: [
          { labelKey: "banqueCentrale.carrieres.travailler", href: "/la-banque-centrale/carrieres/travailler-a-la-bca" },
          { labelKey: "banqueCentrale.carrieres.metiers", href: "/la-banque-centrale/carrieres/metiers" },
          { labelKey: "banqueCentrale.carrieres.recrutement", href: "/la-banque-centrale/carrieres/recrutement" },
          { labelKey: "banqueCentrale.carrieres.concours", href: "/la-banque-centrale/carrieres/concours-et-candidatures" },
        ],
      },
    ],
  },
];

/**
 * Secondary navigation zone of the site footer, distinct from the main
 * navigation of the header. It mirrors the seven entries of the header
 * navigation and derives its links from the themes of each section — so the
 * footer and the header can never drift apart.
 *
 * Column titles resolve under `footer.columns`, links under `nav.panel`.
 */
export const footerNavigation: ReadonlyArray<FooterColumn> = primaryNavigation.map(
  (section) => ({
    columnKey: section.labelKey,
    links: section.primaryItems,
  })
);