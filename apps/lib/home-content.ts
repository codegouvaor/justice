import type { FrIconClassName } from "@codegouvaor/react-ads/fr";
import { sectionPaths } from "@/lib/site-structure";

/**
 * Homepage configuration of the Ministry of Justice of Astoria
 * (`justice.gouv.aor`).
 *
 * Hrefs are locale-agnostic pathnames: the next-intl Link (registered as the
 * ADS link renderer) prefixes the active locale automatically. Labels and
 * descriptions are never stored here — they come from the message catalogs
 * through the key provided by each entry (see `apps/messages/{fr,en}.json`,
 * namespace `home`).
 *
 * Every section of the homepage is driven by `ministryHome`, so the content
 * can evolve without rewriting the interface. Destinations deliberately reuse
 * the header vocabulary and the URL plan of `lib/site-structure.ts`: the
 * homepage answers “what can I do?”, the header answers “where can I go?”.
 */
const justice = sectionPaths.justice;
const droit = sectionPaths.droit;
const juridictions = sectionPaths.juridictions;
const procedures = sectionPaths.procedures;
const professionnels = sectionPaths.professionnels;
const donneesRessources = sectionPaths.donneesRessources;
const leMinistere = sectionPaths.leMinistere;

export type HomeLink = {
  key: string;
  href: string;
};

export type HomeIconLink = HomeLink & {
  iconId?: FrIconClassName;
};

export type HomeArticle = {
  titleKey: string;
  textKey?: string;
  tagKey: string;
  dateKey: string;
  href: string;
};

export const ministryHome = {
  /** Frequent searches proposed under the hero search field. */
  popularSearches: [
    { key: "aideJuridictionnelle", href: `${justice}/acces-a-la-justice/aide-juridictionnelle` },
    { key: "porterPlainte", href: `${procedures}/penal/plainte` },
    { key: "codeCivil", href: `${droit}/codes/code-civil` },
    { key: "courDAppel", href: `${juridictions}/ordre-judiciaire/cours-d-appel` },
  ] satisfies HomeLink[],

  /** Section 02 — Accès rapides: frequent actions, each a real destination. */
  actions: [
    { key: "trouverJuridiction", href: `${juridictions}/tribunaux/annuaire-des-tribunaux`, iconId: "fr-icon-map-pin-2-line" },
    { key: "comprendreProcedure", href: procedures, iconId: "fr-icon-book-2-line" },
    { key: "consulterDroit", href: droit, iconId: "fr-icon-scales-3-line" },
    { key: "rechercherDecision", href: `${donneesRessources}/decisions/recherche-de-decisions`, iconId: "fr-icon-search-line" },
    { key: "aideJuridique", href: `${justice}/acces-a-la-justice/aide-juridictionnelle`, iconId: "fr-icon-heart-line" },
    { key: "porterPlainte", href: `${procedures}/penal/plainte`, iconId: "fr-icon-user-search-line" },
  ] satisfies HomeIconLink[],

  /** Section 04 — Le droit: the central access to the legal reference corpus. */
  droit: [
    { key: "constitution", href: `${droit}/textes-juridiques/constitution`, iconId: "fr-icon-booklet-line" },
    { key: "codes", href: `${droit}/codes`, iconId: "fr-icon-scales-3-line" },
    { key: "loisReglements", href: `${droit}/textes-juridiques/lois`, iconId: "fr-icon-draft-line" },
    { key: "jurisprudence", href: `${droit}/jurisprudence`, iconId: "fr-icon-database-line" },
  ] satisfies HomeIconLink[],

  /** Section 05 — Les juridictions: the court system, first-instance to supreme. */
  juridictions: [
    { key: "courSupreme", href: `${juridictions}/ordre-judiciaire/cour-supreme`, iconId: "fr-icon-bank-line" },
    { key: "coursDAppel", href: `${juridictions}/ordre-judiciaire/cours-d-appel`, iconId: "fr-icon-building-4-line" },
    { key: "tribunaux", href: `${juridictions}/tribunaux`, iconId: "fr-icon-hammer-line" },
    { key: "specialisees", href: `${juridictions}/juridictions-specialisees`, iconId: "fr-icon-flag-line" },
  ] satisfies HomeIconLink[],

  /** Section 06 — Vos démarches: the great families of user procedures. */
  procedures: [
    { key: "civil", href: `${procedures}/civil`, iconId: "fr-icon-account-circle-line" },
    { key: "penal", href: `${procedures}/penal`, iconId: "fr-icon-shield-line" },
    { key: "administratif", href: `${procedures}/administratif`, iconId: "fr-icon-building-4-line" },
    { key: "demarches", href: `${procedures}/demarches`, iconId: "fr-icon-file-text-line" },
  ] satisfies HomeIconLink[],

  /** Section 07 — Services numériques: the digital services of the ministry. */
  services: [
    { key: "suivreProcedure", href: `${procedures}/demarches/suivre-une-procedure`, iconId: "fr-icon-timer-line" },
    { key: "consulterFormulaire", href: `${procedures}/demarches/consulter-un-formulaire`, iconId: "fr-icon-clipboard-line" },
    { key: "deposerDemande", href: `${procedures}/demarches/deposer-une-demande`, iconId: "fr-icon-send-plane-line" },
    { key: "obtenirDocument", href: `${procedures}/demarches/obtenir-un-document`, iconId: "fr-icon-file-download-line" },
  ] satisfies HomeIconLink[],

  /** Section 08 — Professionnels de la Justice. */
  professionnels: [
    { key: "magistrature", href: `${professionnels}/magistrature`, iconId: "fr-icon-briefcase-line" },
    { key: "auxiliaires", href: `${professionnels}/auxiliaires-de-justice`, iconId: "fr-icon-group-line" },
    { key: "carrieres", href: `${professionnels}/carrieres`, iconId: "fr-icon-user-add-line" },
    { key: "formation", href: `${professionnels}/formation`, iconId: "fr-icon-award-line" },
  ] satisfies HomeIconLink[],

  /** Section 03 — Actualités: one featured article, several secondary ones. */
  news: {
    featured: {
      titleKey: "news.featured.title",
      textKey: "news.featured.text",
      tagKey: "news.featured.tag",
      dateKey: "news.featured.date",
      href: `${leMinistere}/actualites-et-contact/actualites`,
    },
    secondary: [
      {
        titleKey: "news.secondary.s1.title",
        tagKey: "news.secondary.s1.tag",
        dateKey: "news.secondary.s1.date",
        href: `${procedures}/demarches/deposer-une-demande`,
      },
      {
        titleKey: "news.secondary.s2.title",
        tagKey: "news.secondary.s2.tag",
        dateKey: "news.secondary.s2.date",
        href: `${juridictions}/audiences/calendrier-des-audiences`,
      },
      {
        titleKey: "news.secondary.s3.title",
        tagKey: "news.secondary.s3.tag",
        dateKey: "news.secondary.s3.date",
        href: `${donneesRessources}/publications/rapports`,
      },
    ],
  },

  /** Section 09 — Données & ressources: labels reuse the header vocabulary. */
  resources: [
    { key: "donneesRessources.decisions.title", href: `${donneesRessources}/decisions` },
    { key: "donneesRessources.statistiques.title", href: `${donneesRessources}/statistiques` },
    { key: "donneesRessources.publications.title", href: `${donneesRessources}/publications` },
    { key: "donneesRessources.donneesOuvertes.title", href: `${donneesRessources}/donnees-ouvertes` },
  ] satisfies HomeLink[],

  /** Section 10 — Le Ministère: discreet institutional closing. */
  ministry: [
    { key: "leMinistere.institution.leMinistre", href: `${leMinistere}/institution/le-ministre` },
    { key: "leMinistere.institution.missions", href: `${leMinistere}/institution/missions` },
    { key: "leMinistere.institution.organisation", href: `${leMinistere}/institution/organisation` },
    { key: "leMinistere.administration.budget", href: `${leMinistere}/administration/budget` },
    { key: "leMinistere.transparence.title", href: `${leMinistere}/transparence` },
    { key: "leMinistere.actualitesEtContact.contact", href: `${leMinistere}/actualites-et-contact/contact` },
  ] satisfies HomeLink[],
};