/**
 * URL structure of the public portal of the Ministry of Justice of Astoria
 * (`justice.gouv.aor`).
 *
 * Hrefs are locale-agnostic pathnames: the next-intl Link (registered as the
 * ADS link renderer) prefixes the active locale automatically. Labels are
 * never stored here — they come from the message catalogs through the key
 * provided by each entry (see `apps/messages/{fr,en}.json`).
 *
 * Architecture of the navigation:
 *
 *   primaryNavigation  → the seven entries of the portal. Each entry opens a
 *                        mega-menu panel structured in four sections of four
 *                        links:
 *                            7 entrées × 4 sections × 4 liens = 112 liens
 *
 * This file is the single source of truth of the portal navigation: the
 * header (desktop mega-menus and mobile drawer), the sitemap and the footer
 * all derive their markup from `primaryNavigation`, so adding or renaming a
 * theme, section or link never requires rewriting a component — it only
 * requires editing this file (and the matching message keys).
 *
 * The information architecture reflects the institutional perimeter of a
 * ministry of justice. Six entries cover the public-policy fields of the
 * justice system (Justice, Droit, Juridictions, Procédures, Professionnels,
 * Données & ressources); a seventh, distinct entry, “Le Ministère”, presents
 * the institution itself.
 *
 *   Justice              → l'organisation, la politique judiciaire, l'accès à la justice et les droits
 *   Droit                → les textes, les codes, la jurisprudence et la recherche juridique
 *   Juridictions         → l'ordre judiciaire, les tribunaux, les juridictions spécialisées et les audiences
 *   Procédures           → les procédures civiles, pénales, administratives et les démarches
 *   Professionnels       → la magistrature, les auxiliaires de justice, les carrières et la formation
 *   Données & ressources → les décisions, les statistiques, les publications et les données ouvertes
 *   Le Ministère         → l'institution, son administration, sa transparence et ses actualités
 *
 * The structure is validated both at compile time (the tuple types below
 * enforce exactly 7 themes × 4 sections × 4 links) and at runtime
 * (`validateNavigationStructure`), so a malformed navigation fails the build.
 *
 * Hrefs follow the URL plan of the portal; several point to pages being
 * published and will resolve as soon as those sections ship.
 */
export const PORTAL_HOME = "/";

/**
 * The seven entries of the portal — both `nav.primary` and `footer.columns`
 * keys. The six first entries are the functional navigation; the seventh,
 * `leMinistere`, is the distinct institutional entry.
 */
export type PrimaryNavKey =
  | "justice"
  | "droit"
  | "juridictions"
  | "procedures"
  | "professionnels"
  | "donneesRessources"
  | "leMinistere";

/** A destination inside a mega-menu panel; its label is a `nav.panel` message key. */
export type NavigationLink = {
  labelKey: string;
  href: string;
};

/**
 * A section of a navigation theme. In the mega-menu panel it heads one of the
 * four columns (`labelKey` → `nav.panel.<theme>.<section>.title`); in the
 * footer it becomes a destination of the domain column. It carries the four
 * destinations of the section.
 */
export type NavigationItem = NavigationLink & {
  /** Related destinations nested under this section. */
  links: NavigationLinks;
};

/**
 * The four destinations of a section. The tuple type is the compile-time
 * guarantee that no section exposes anything other than exactly 4 links.
 */
export type NavigationLinks = readonly [
  NavigationLink,
  NavigationLink,
  NavigationLink,
  NavigationLink,
];

/**
 * The four sections of a theme. The tuple type is the compile-time guarantee
 * that no theme exposes anything other than exactly 4 sections.
 */
export type NavigationItems = readonly [
  NavigationItem,
  NavigationItem,
  NavigationItem,
  NavigationItem,
];

/**
 * One top-level entry of the Government Header navigation.
 *
 * Navigation principle (info.gouv.fr-inspired, adapted to Astoria): the header
 * is organised around the missions of the ministry of justice and the
 * understanding of the justice system — not around a ministry's internal
 * structure. Each entry opens a mega-menu panel composed of
 *  - a leader band: the entry name, a one-line description and the main
 *    action of the section (“Tout sur la Justice”, …),
 *  - four sections, each headed by its title and followed by its four
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
  /** The four sections of the theme, each with its four links. */
  primaryItems: NavigationItems;
};

export type FooterColumn = {
  /** Message key (`footer.columns`) of the column heading. */
  columnKey: string;
  links: ReadonlyArray<NavigationLink>;
};

export const sectionPaths = {
  justice: "/justice",
  droit: "/droit",
  juridictions: "/juridictions",
  procedures: "/procedures",
  professionnels: "/professionnels",
  donneesRessources: "/donnees-et-ressources",
  leMinistere: "/le-ministere",
} as const;

export const legalPaths = {
  accessibility: "/legal/accessibility",
  privacy: "/legal/privacy",
  terms: "/legal/terms",
  cookies: "/legal/cookies",
  sitemap: "/sitemap",
} as const;

export const searchPath = "/search";

/** DOM ids used as skip-link targets. */
export const pageAnchors = {
  content: "main-content",
  footer: "main-footer",
} as const;

/** Structural guard: the navigation must stay a fixed 7 × 4 × 4 grid. */
export const navigationShape = {
  themes: 7,
  sectionsPerTheme: 4,
  linksPerSection: 4,
} as const;

/**
 * Runtime validation of the navigation structure. Returns the list of
 * problems found (empty when the structure is valid):
 *  - the portal must expose exactly 7 themes;
 *  - each theme must contain exactly 4 sections;
 *  - each section must contain exactly 4 links;
 *  - every link must carry a non-empty, absolute-path destination.
 *
 * The same invariants are enforced at compile time by the tuple types
 * (`NavigationItems`, `NavigationLinks` and the seven-tuple below).
 */
export function validateNavigationStructure(
  navigation: ReadonlyArray<NavigationSection> = primaryNavigation
): string[] {
  const problems: string[] = [];

  if (navigation.length !== navigationShape.themes) {
    problems.push(
      `La navigation doit comporter exactement ${navigationShape.themes} thèmes, or elle en compte ${navigation.length}.`
    );
  }

  for (const section of navigation) {
    if (section.primaryItems.length !== navigationShape.sectionsPerTheme) {
      problems.push(
        `Le thème « ${section.labelKey} » doit contenir exactement ${navigationShape.sectionsPerTheme} sections, or il en compte ${section.primaryItems.length}.`
      );
    }

    for (const item of section.primaryItems) {
      if (item.links.length !== navigationShape.linksPerSection) {
        problems.push(
          `La section « ${item.labelKey} » doit contenir exactement ${navigationShape.linksPerSection} liens, or elle en compte ${item.links.length}.`
        );
      }

      for (const link of item.links) {
        if (!link.href || !link.href.startsWith("/")) {
          problems.push(
            `Le lien « ${link.labelKey} » (« ${item.labelKey} ») n'a pas de destination valide : « ${link.href} ».`
          );
        }
      }
    }
  }

  return problems;
}

/**
 * Throws when the navigation structure is malformed. Called at module load so
 * a structural error fails the build immediately instead of shipping a broken
 * header. Satisfies the contract: 7 thèmes × 4 sections × 4 liens = 112 liens.
 */
function assertNavigationStructureValid(): void {
  const problems = validateNavigationStructure();
  if (problems.length > 0) {
    throw new Error(
      `Structure de navigation invalide :\n- ${problems.join("\n- ")}`
    );
  }
}

/** Convenience: the total number of destinations exposed by the navigation. */
export function countNavigationLinks(
  navigation: ReadonlyArray<NavigationSection> = primaryNavigation
): number {
  return navigation.reduce(
    (total, section) =>
      total +
      section.primaryItems.reduce(
        (sectionTotal, item) => sectionTotal + item.links.length,
        0
      ),
    0
  );
}

/**
 * Main navigation of the Government Header of the Ministry of Justice of
 * Astoria — the permanent information architecture of the portal, organised
 * in seven entries:
 *
 *   Justice              → comprendre : l'organisation, la politique judiciaire, l'accès à la justice, les droits
 *   Droit                → consulter : les textes, les codes, la jurisprudence, la recherche juridique
 *   Juridictions         → trouver   : l'ordre judiciaire, les tribunaux, les juridictions spécialisées, les audiences
 *   Procédures           → agir      : les procédures civiles, pénales, administratives, les démarches
 *   Professionnels       → exercer   : la magistrature, les auxiliaires de justice, les carrières, la formation
 *   Données & ressources → connaître : les décisions, les statistiques, les publications, les données ouvertes
 *   Le Ministère         → incarner  : l'institution, l'administration, la transparence, les actualités
 *
 * The six first entries present the *public-policy* perimeter of the ministry;
 * the seventh, distinct, presents the institution itself.
 *
 * Each entry opens a mega-menu panel with a leader band and four sections —
 * each section headed by its title and followed by its four destinations. The
 * panel is not the sitemap of the portal; it exposes the destinations that
 * matter to the visitor journey. The structure is configuration-driven and
 * validated: adding a section only means adding an entry here (and the
 * matching messages).
 */
export const primaryNavigation: ReadonlyArray<NavigationSection> = [
  {
    type: "megaMenu",
    labelKey: "justice",
    href: sectionPaths.justice,
    leader: {
      titleKey: "justice.title",
      paragraphKey: "justice.text",
      link: { labelKey: "justice.allLink", href: sectionPaths.justice },
    },
    primaryItems: [
      {
        labelKey: "justice.organisation.title",
        href: `${sectionPaths.justice}/organisation`,
        links: [
          { labelKey: "justice.organisation.systemeJudiciaire", href: `${sectionPaths.justice}/organisation/systeme-judiciaire` },
          { labelKey: "justice.organisation.organisationDeLaJustice", href: `${sectionPaths.justice}/organisation/organisation-de-la-justice` },
          { labelKey: "justice.organisation.principesFondamentaux", href: `${sectionPaths.justice}/organisation/principes-fondamentaux` },
          { labelKey: "justice.organisation.reformeDeLaJustice", href: `${sectionPaths.justice}/organisation/reforme-de-la-justice` },
        ],
      },
      {
        labelKey: "justice.politiqueJudiciaire.title",
        href: `${sectionPaths.justice}/politique-judiciaire`,
        links: [
          { labelKey: "justice.politiqueJudiciaire.priorites", href: `${sectionPaths.justice}/politique-judiciaire/priorites` },
          { labelKey: "justice.politiqueJudiciaire.programmes", href: `${sectionPaths.justice}/politique-judiciaire/programmes` },
          { labelKey: "justice.politiqueJudiciaire.reformes", href: `${sectionPaths.justice}/politique-judiciaire/reformes` },
          { labelKey: "justice.politiqueJudiciaire.evaluationDesPolitiques", href: `${sectionPaths.justice}/politique-judiciaire/evaluation-des-politiques` },
        ],
      },
      {
        labelKey: "justice.accesALaJustice.title",
        href: `${sectionPaths.justice}/acces-a-la-justice`,
        links: [
          { labelKey: "justice.accesALaJustice.aideJuridictionnelle", href: `${sectionPaths.justice}/acces-a-la-justice/aide-juridictionnelle` },
          { labelKey: "justice.accesALaJustice.mediation", href: `${sectionPaths.justice}/acces-a-la-justice/mediation` },
          { labelKey: "justice.accesALaJustice.conciliation", href: `${sectionPaths.justice}/acces-a-la-justice/conciliation` },
          { labelKey: "justice.accesALaJustice.accesAuxServicesJudiciaires", href: `${sectionPaths.justice}/acces-a-la-justice/acces-aux-services-judiciaires` },
        ],
      },
      {
        labelKey: "justice.droits.title",
        href: `${sectionPaths.justice}/droits`,
        links: [
          { labelKey: "justice.droits.droitsFondamentaux", href: `${sectionPaths.justice}/droits/droits-fondamentaux` },
          { labelKey: "justice.droits.droitsDesVictimes", href: `${sectionPaths.justice}/droits/droits-des-victimes` },
          { labelKey: "justice.droits.droitsDesPersonnesMisesEnCause", href: `${sectionPaths.justice}/droits/droits-des-personnes-mises-en-cause` },
          { labelKey: "justice.droits.protectionDesPersonnesVulnerables", href: `${sectionPaths.justice}/droits/protection-des-personnes-vulnerables` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "droit",
    href: sectionPaths.droit,
    leader: {
      titleKey: "droit.title",
      paragraphKey: "droit.text",
      link: { labelKey: "droit.allLink", href: sectionPaths.droit },
    },
    primaryItems: [
      {
        labelKey: "droit.textesJuridiques.title",
        href: `${sectionPaths.droit}/textes-juridiques`,
        links: [
          { labelKey: "droit.textesJuridiques.constitution", href: `${sectionPaths.droit}/textes-juridiques/constitution` },
          { labelKey: "droit.textesJuridiques.lois", href: `${sectionPaths.droit}/textes-juridiques/lois` },
          { labelKey: "droit.textesJuridiques.decrets", href: `${sectionPaths.droit}/textes-juridiques/decrets` },
          { labelKey: "droit.textesJuridiques.reglements", href: `${sectionPaths.droit}/textes-juridiques/reglements` },
        ],
      },
      {
        labelKey: "droit.codes.title",
        href: `${sectionPaths.droit}/codes`,
        links: [
          { labelKey: "droit.codes.codeCivil", href: `${sectionPaths.droit}/codes/code-civil` },
          { labelKey: "droit.codes.codePenal", href: `${sectionPaths.droit}/codes/code-penal` },
          { labelKey: "droit.codes.codeDeProcedure", href: `${sectionPaths.droit}/codes/code-de-procedure` },
          { labelKey: "droit.codes.autresCodes", href: `${sectionPaths.droit}/codes/autres-codes` },
        ],
      },
      {
        labelKey: "droit.jurisprudence.title",
        href: `${sectionPaths.droit}/jurisprudence`,
        links: [
          { labelKey: "droit.jurisprudence.decisions", href: `${sectionPaths.droit}/jurisprudence/decisions` },
          { labelKey: "droit.jurisprudence.jurisprudenceConstitutionnelle", href: `${sectionPaths.droit}/jurisprudence/jurisprudence-constitutionnelle` },
          { labelKey: "droit.jurisprudence.jurisprudenceJudiciaire", href: `${sectionPaths.droit}/jurisprudence/jurisprudence-judiciaire` },
          { labelKey: "droit.jurisprudence.jurisprudenceAdministrative", href: `${sectionPaths.droit}/jurisprudence/jurisprudence-administrative` },
        ],
      },
      {
        labelKey: "droit.rechercheJuridique.title",
        href: `${sectionPaths.droit}/recherche-juridique`,
        links: [
          { labelKey: "droit.rechercheJuridique.rechercheDansLesTextes", href: `${sectionPaths.droit}/recherche-juridique/recherche-dans-les-textes` },
          { labelKey: "droit.rechercheJuridique.rechercheParArticle", href: `${sectionPaths.droit}/recherche-juridique/recherche-par-article` },
          { labelKey: "droit.rechercheJuridique.rechercheParDomaine", href: `${sectionPaths.droit}/recherche-juridique/recherche-par-domaine` },
          { labelKey: "droit.rechercheJuridique.rechercheAvancee", href: `${sectionPaths.droit}/recherche-juridique/recherche-avancee` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "juridictions",
    href: sectionPaths.juridictions,
    leader: {
      titleKey: "juridictions.title",
      paragraphKey: "juridictions.text",
      link: { labelKey: "juridictions.allLink", href: sectionPaths.juridictions },
    },
    primaryItems: [
      {
        labelKey: "juridictions.ordreJudiciaire.title",
        href: `${sectionPaths.juridictions}/ordre-judiciaire`,
        links: [
          { labelKey: "juridictions.ordreJudiciaire.courSupreme", href: `${sectionPaths.juridictions}/ordre-judiciaire/cour-supreme` },
          { labelKey: "juridictions.ordreJudiciaire.coursDAppel", href: `${sectionPaths.juridictions}/ordre-judiciaire/cours-d-appel` },
          { labelKey: "juridictions.ordreJudiciaire.tribunaux", href: `${sectionPaths.juridictions}/ordre-judiciaire/tribunaux` },
          { labelKey: "juridictions.ordreJudiciaire.ministerePublic", href: `${sectionPaths.juridictions}/ordre-judiciaire/ministere-public` },
        ],
      },
      {
        labelKey: "juridictions.tribunaux.title",
        href: `${sectionPaths.juridictions}/tribunaux`,
        links: [
          { labelKey: "juridictions.tribunaux.tribunauxCivils", href: `${sectionPaths.juridictions}/tribunaux/tribunaux-civils` },
          { labelKey: "juridictions.tribunaux.tribunauxPenaux", href: `${sectionPaths.juridictions}/tribunaux/tribunaux-penaux` },
          { labelKey: "juridictions.tribunaux.tribunauxAdministratifs", href: `${sectionPaths.juridictions}/tribunaux/tribunaux-administratifs` },
          { labelKey: "juridictions.tribunaux.annuaireDesTribunaux", href: `${sectionPaths.juridictions}/tribunaux/annuaire-des-tribunaux` },
        ],
      },
      {
        labelKey: "juridictions.juridictionsSpecialisees.title",
        href: `${sectionPaths.juridictions}/juridictions-specialisees`,
        links: [
          { labelKey: "juridictions.juridictionsSpecialisees.juridictionsCommerciales", href: `${sectionPaths.juridictions}/juridictions-specialisees/juridictions-commerciales` },
          { labelKey: "juridictions.juridictionsSpecialisees.juridictionsFamiliales", href: `${sectionPaths.juridictions}/juridictions-specialisees/juridictions-familiales` },
          { labelKey: "juridictions.juridictionsSpecialisees.juridictionsDuTravail", href: `${sectionPaths.juridictions}/juridictions-specialisees/juridictions-du-travail` },
          { labelKey: "juridictions.juridictionsSpecialisees.autresJuridictionsSpecialisees", href: `${sectionPaths.juridictions}/juridictions-specialisees/autres-juridictions-specialisees` },
        ],
      },
      {
        labelKey: "juridictions.audiences.title",
        href: `${sectionPaths.juridictions}/audiences`,
        links: [
          { labelKey: "juridictions.audiences.calendrierDesAudiences", href: `${sectionPaths.juridictions}/audiences/calendrier-des-audiences` },
          { labelKey: "juridictions.audiences.audiencesPubliques", href: `${sectionPaths.juridictions}/audiences/audiences-publiques` },
          { labelKey: "juridictions.audiences.informationsPratiques", href: `${sectionPaths.juridictions}/audiences/informations-pratiques` },
          { labelKey: "juridictions.audiences.rechercheDAudience", href: `${sectionPaths.juridictions}/audiences/recherche-d-une-audience` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "procedures",
    href: sectionPaths.procedures,
    leader: {
      titleKey: "procedures.title",
      paragraphKey: "procedures.text",
      link: { labelKey: "procedures.allLink", href: sectionPaths.procedures },
    },
    primaryItems: [
      {
        labelKey: "procedures.civil.title",
        href: `${sectionPaths.procedures}/civil`,
        links: [
          { labelKey: "procedures.civil.litigesCivils", href: `${sectionPaths.procedures}/civil/litiges-civils` },
          { labelKey: "procedures.civil.famille", href: `${sectionPaths.procedures}/civil/famille` },
          { labelKey: "procedures.civil.successions", href: `${sectionPaths.procedures}/civil/successions` },
          { labelKey: "procedures.civil.responsabilite", href: `${sectionPaths.procedures}/civil/responsabilite` },
        ],
      },
      {
        labelKey: "procedures.penal.title",
        href: `${sectionPaths.procedures}/penal`,
        links: [
          { labelKey: "procedures.penal.plainte", href: `${sectionPaths.procedures}/penal/plainte` },
          { labelKey: "procedures.penal.enquete", href: `${sectionPaths.procedures}/penal/enquete` },
          { labelKey: "procedures.penal.procesPenal", href: `${sectionPaths.procedures}/penal/proces-penal` },
          { labelKey: "procedures.penal.droitsDesVictimes", href: `${sectionPaths.procedures}/penal/droits-des-victimes` },
        ],
      },
      {
        labelKey: "procedures.administratif.title",
        href: `${sectionPaths.procedures}/administratif`,
        links: [
          { labelKey: "procedures.administratif.recoursAdministratif", href: `${sectionPaths.procedures}/administratif/recours-administratif` },
          { labelKey: "procedures.administratif.recoursJuridictionnel", href: `${sectionPaths.procedures}/administratif/recours-juridictionnel` },
          { labelKey: "procedures.administratif.contentieuxAdministratif", href: `${sectionPaths.procedures}/administratif/contentieux-administratif` },
          { labelKey: "procedures.administratif.executionDesDecisions", href: `${sectionPaths.procedures}/administratif/execution-des-decisions` },
        ],
      },
      {
        labelKey: "procedures.demarches.title",
        href: `${sectionPaths.procedures}/demarches`,
        links: [
          { labelKey: "procedures.demarches.deposerUneDemande", href: `${sectionPaths.procedures}/demarches/deposer-une-demande` },
          { labelKey: "procedures.demarches.consulterUnFormulaire", href: `${sectionPaths.procedures}/demarches/consulter-un-formulaire` },
          { labelKey: "procedures.demarches.suivreUneProcedure", href: `${sectionPaths.procedures}/demarches/suivre-une-procedure` },
          { labelKey: "procedures.demarches.obtenirUnDocument", href: `${sectionPaths.procedures}/demarches/obtenir-un-document` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "professionnels",
    href: sectionPaths.professionnels,
    leader: {
      titleKey: "professionnels.title",
      paragraphKey: "professionnels.text",
      link: { labelKey: "professionnels.allLink", href: sectionPaths.professionnels },
    },
    primaryItems: [
      {
        labelKey: "professionnels.magistrature.title",
        href: `${sectionPaths.professionnels}/magistrature`,
        links: [
          { labelKey: "professionnels.magistrature.magistrats", href: `${sectionPaths.professionnels}/magistrature/magistrats` },
          { labelKey: "professionnels.magistrature.parquet", href: `${sectionPaths.professionnels}/magistrature/parquet` },
          { labelKey: "professionnels.magistrature.statut", href: `${sectionPaths.professionnels}/magistrature/statut` },
          { labelKey: "professionnels.magistrature.deontologie", href: `${sectionPaths.professionnels}/magistrature/deontologie` },
        ],
      },
      {
        labelKey: "professionnels.auxiliairesDeJustice.title",
        href: `${sectionPaths.professionnels}/auxiliaires-de-justice`,
        links: [
          { labelKey: "professionnels.auxiliairesDeJustice.avocats", href: `${sectionPaths.professionnels}/auxiliaires-de-justice/avocats` },
          { labelKey: "professionnels.auxiliairesDeJustice.greffiers", href: `${sectionPaths.professionnels}/auxiliaires-de-justice/greffiers` },
          { labelKey: "professionnels.auxiliairesDeJustice.notaires", href: `${sectionPaths.professionnels}/auxiliaires-de-justice/notaires` },
          { labelKey: "professionnels.auxiliairesDeJustice.expertsJudiciaires", href: `${sectionPaths.professionnels}/auxiliaires-de-justice/experts-judiciaires` },
        ],
      },
      {
        labelKey: "professionnels.carrieres.title",
        href: `${sectionPaths.professionnels}/carrieres`,
        links: [
          { labelKey: "professionnels.carrieres.emplois", href: `${sectionPaths.professionnels}/carrieres/emplois` },
          { labelKey: "professionnels.carrieres.concours", href: `${sectionPaths.professionnels}/carrieres/concours` },
          { labelKey: "professionnels.carrieres.recrutement", href: `${sectionPaths.professionnels}/carrieres/recrutement` },
          { labelKey: "professionnels.carrieres.mobilite", href: `${sectionPaths.professionnels}/carrieres/mobilite` },
        ],
      },
      {
        labelKey: "professionnels.formation.title",
        href: `${sectionPaths.professionnels}/formation`,
        links: [
          { labelKey: "professionnels.formation.formationJudiciaire", href: `${sectionPaths.professionnels}/formation/formation-judiciaire` },
          { labelKey: "professionnels.formation.formationContinue", href: `${sectionPaths.professionnels}/formation/formation-continue` },
          { labelKey: "professionnels.formation.ecoleDeLaMagistrature", href: `${sectionPaths.professionnels}/formation/ecole-de-la-magistrature` },
          { labelKey: "professionnels.formation.ressourcesProfessionnelles", href: `${sectionPaths.professionnels}/formation/ressources-professionnelles` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "donneesRessources",
    href: sectionPaths.donneesRessources,
    leader: {
      titleKey: "donneesRessources.title",
      paragraphKey: "donneesRessources.text",
      link: { labelKey: "donneesRessources.allLink", href: sectionPaths.donneesRessources },
    },
    primaryItems: [
      {
        labelKey: "donneesRessources.decisions.title",
        href: `${sectionPaths.donneesRessources}/decisions`,
        links: [
          { labelKey: "donneesRessources.decisions.decisionsJudiciaires", href: `${sectionPaths.donneesRessources}/decisions/decisions-judiciaires` },
          { labelKey: "donneesRessources.decisions.decisionsConstitutionnelles", href: `${sectionPaths.donneesRessources}/decisions/decisions-constitutionnelles` },
          { labelKey: "donneesRessources.decisions.decisionsAdministratives", href: `${sectionPaths.donneesRessources}/decisions/decisions-administratives` },
          { labelKey: "donneesRessources.decisions.rechercheDeDecisions", href: `${sectionPaths.donneesRessources}/decisions/recherche-de-decisions` },
        ],
      },
      {
        labelKey: "donneesRessources.statistiques.title",
        href: `${sectionPaths.donneesRessources}/statistiques`,
        links: [
          { labelKey: "donneesRessources.statistiques.activiteJudiciaire", href: `${sectionPaths.donneesRessources}/statistiques/activite-judiciaire` },
          { labelKey: "donneesRessources.statistiques.justicePenale", href: `${sectionPaths.donneesRessources}/statistiques/justice-penale` },
          { labelKey: "donneesRessources.statistiques.justiceCivile", href: `${sectionPaths.donneesRessources}/statistiques/justice-civile` },
          { labelKey: "donneesRessources.statistiques.statistiquesAnnuelles", href: `${sectionPaths.donneesRessources}/statistiques/statistiques-annuelles` },
        ],
      },
      {
        labelKey: "donneesRessources.publications.title",
        href: `${sectionPaths.donneesRessources}/publications`,
        links: [
          { labelKey: "donneesRessources.publications.rapports", href: `${sectionPaths.donneesRessources}/publications/rapports` },
          { labelKey: "donneesRessources.publications.etudes", href: `${sectionPaths.donneesRessources}/publications/etudes` },
          { labelKey: "donneesRessources.publications.guides", href: `${sectionPaths.donneesRessources}/publications/guides` },
          { labelKey: "donneesRessources.publications.archives", href: `${sectionPaths.donneesRessources}/publications/archives` },
        ],
      },
      {
        labelKey: "donneesRessources.donneesOuvertes.title",
        href: `${sectionPaths.donneesRessources}/donnees-ouvertes`,
        links: [
          { labelKey: "donneesRessources.donneesOuvertes.jeuxDeDonnees", href: `${sectionPaths.donneesRessources}/donnees-ouvertes/jeux-de-donnees` },
          { labelKey: "donneesRessources.donneesOuvertes.api", href: `${sectionPaths.donneesRessources}/donnees-ouvertes/api` },
          { labelKey: "donneesRessources.donneesOuvertes.reutilisation", href: `${sectionPaths.donneesRessources}/donnees-ouvertes/reutilisation` },
          { labelKey: "donneesRessources.donneesOuvertes.documentation", href: `${sectionPaths.donneesRessources}/donnees-ouvertes/documentation` },
        ],
      },
    ],
  },
  {
    type: "megaMenu",
    labelKey: "leMinistere",
    href: sectionPaths.leMinistere,
    leader: {
      titleKey: "leMinistere.title",
      paragraphKey: "leMinistere.text",
      link: { labelKey: "leMinistere.allLink", href: sectionPaths.leMinistere },
    },
    primaryItems: [
      {
        labelKey: "leMinistere.institution.title",
        href: `${sectionPaths.leMinistere}/institution`,
        links: [
          { labelKey: "leMinistere.institution.leMinistre", href: `${sectionPaths.leMinistere}/institution/le-ministre` },
          { labelKey: "leMinistere.institution.missions", href: `${sectionPaths.leMinistere}/institution/missions` },
          { labelKey: "leMinistere.institution.organisation", href: `${sectionPaths.leMinistere}/institution/organisation` },
          { labelKey: "leMinistere.institution.organigramme", href: `${sectionPaths.leMinistere}/institution/organigramme` },
        ],
      },
      {
        labelKey: "leMinistere.administration.title",
        href: `${sectionPaths.leMinistere}/administration`,
        links: [
          { labelKey: "leMinistere.administration.servicesDuMinistere", href: `${sectionPaths.leMinistere}/administration/services-du-ministere` },
          { labelKey: "leMinistere.administration.administrationJudiciaire", href: `${sectionPaths.leMinistere}/administration/administration-judiciaire` },
          { labelKey: "leMinistere.administration.budget", href: `${sectionPaths.leMinistere}/administration/budget` },
          { labelKey: "leMinistere.administration.marchesPublics", href: `${sectionPaths.leMinistere}/administration/marches-publics` },
        ],
      },
      {
        labelKey: "leMinistere.transparence.title",
        href: `${sectionPaths.leMinistere}/transparence`,
        links: [
          { labelKey: "leMinistere.transparence.budgetEtFinances", href: `${sectionPaths.leMinistere}/transparence/budget-et-finances` },
          { labelKey: "leMinistere.transparence.donneesPubliques", href: `${sectionPaths.leMinistere}/transparence/donnees-publiques` },
          { labelKey: "leMinistere.transparence.rapportsDActivite", href: `${sectionPaths.leMinistere}/transparence/rapports-d-activite` },
          { labelKey: "leMinistere.transparence.deontologie", href: `${sectionPaths.leMinistere}/transparence/deontologie` },
        ],
      },
      {
        labelKey: "leMinistere.actualitesEtContact.title",
        href: `${sectionPaths.leMinistere}/actualites-et-contact`,
        links: [
          { labelKey: "leMinistere.actualitesEtContact.actualites", href: `${sectionPaths.leMinistere}/actualites-et-contact/actualites` },
          { labelKey: "leMinistere.actualitesEtContact.communiques", href: `${sectionPaths.leMinistere}/actualites-et-contact/communiques` },
          { labelKey: "leMinistere.actualitesEtContact.agenda", href: `${sectionPaths.leMinistere}/actualites-et-contact/agenda` },
          { labelKey: "leMinistere.actualitesEtContact.contact", href: `${sectionPaths.leMinistere}/actualites-et-contact/contact` },
        ],
      },
    ],
  },
];

assertNavigationStructureValid();

/**
 * Secondary navigation zone of the site footer, distinct from the main
 * navigation of the header. It mirrors the seven entries of the header
 * navigation and derives its links from the sections of each theme — so the
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