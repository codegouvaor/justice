import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localizedAlternates, resolveLocaleParam } from "@/lib/localized-metadata";
import { ministryHome } from "@/lib/home-content";
import { getDomainUrl } from "@/lib/domains";
import { sectionPaths } from "@/lib/site-structure";
import { PortalSearchBar } from "@/components/public/search/portal-search-bar";
import {
  ArticleCard,
  CtaButtonsGroup,
  LinkTile,
  SearchSuggestionTag,
} from "@/components/public/content/ads-fragments";
import {
  heroContainerStyle,
  iconBlockStyle,
  linkListStyle,
  teaserCardStyle,
  teaserDescStyle,
  teaserTagStyle,
  teaserTitleStyle,
  ThemeSection,
} from "@/components/public/content/theme-page";

const HOME_PATH = "/";

type PageProps = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);

  const tHome = await getTranslations({ locale, namespace: "home" });
  const tMeta = await getTranslations({ locale, namespace: "meta" });

  return {
    title: { absolute: tHome("metaTitle") },
    description: tMeta("description"),
    ...localizedAlternates(locale, HOME_PATH),
  };
}

/* Layout helpers below use the ADS design tokens through `var(--ads-*)` (the
 * single source of tokens — main.css) so light/dark switching and theming stay
 * owned by the Design System. Only the ministry-specific arrangement of these
 * blocks is expressed here, inline, without any local stylesheet. */

const searchBlockStyle: CSSProperties = {
  maxWidth: "42rem",
  margin: "2.25rem auto 0",
  textAlign: "left",
};

const searchTitleStyle: CSSProperties = {
  margin: "0 0 0.75rem",
  fontSize: "1.25rem",
  lineHeight: 1.3,
  fontWeight: 700,
};

const popularLabelStyle: CSSProperties = {
  margin: "0 0 0.5rem",
  fontSize: "0.875rem",
  color: "var(--ads-color-text-muted)",
};

const popularListStyle: CSSProperties = {
  listStyle: "none",
  margin: "0",
  padding: "0",
  display: "flex",
  flexWrap: "wrap",
  gap: "0.5rem",
};

/** Vertical stack of the secondary news cards. */
const cardListStyle: CSSProperties = {
  listStyle: "none",
  margin: "0",
  padding: "0",
  display: "grid",
  gap: "1.5rem",
};

/** Whole-card link block used by the Droit, Juridictions and Professionnels sections. */
const teaserArrowStyle: CSSProperties = {
  marginTop: "auto",
  alignSelf: "flex-end",
  fontSize: "1rem",
  color: "var(--ads-color-primary)",
};

const teaserTextStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.375rem",
};

/** MyGouv panel of the Services numériques section. */
const myGouvPanelStyle: CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1.25rem",
  marginTop: "1.5rem",
  maxWidth: "72rem",
  padding: "1.5rem",
  background: "var(--ads-color-background)",
  border: "1px solid var(--ads-color-border)",
};

const myGouvTitleStyle: CSSProperties = {
  margin: "0 0 0.375rem",
  fontSize: "1.0625rem",
  lineHeight: 1.35,
  fontWeight: 700,
};

const myGouvTextStyle: CSSProperties = {
  margin: "0",
  fontSize: "0.9375rem",
  lineHeight: 1.6,
  color: "var(--ads-color-text-muted)",
};

const resourceLinkStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "1rem",
  padding: "1rem 1.25rem",
  fontWeight: 600,
  textDecoration: "none",
  color: "var(--ads-color-text)",
  border: "1px solid var(--ads-color-border)",
  borderTop: "none",
  background: "var(--ads-color-background)",
};

const ministryLeadStyle: CSSProperties = {
  margin: "0 auto 1.5rem",
  maxWidth: "42rem",
  fontSize: "0.9375rem",
  lineHeight: 1.7,
  color: "var(--ads-color-text-muted)",
};

/**
 * Homepage of the Ministry of Justice of Astoria — the functional front door
 * of the justice platform.
 *
 * The header allows exploring the portal (seven themes, unchanged); this page
 * allows acting. It answers “what can I do?”, section after section:
 *
 *   01 Hero / Recherche      — who we are, and search first
 *   02 Accès rapides         — frequent actions, each a real parcours
 *   03 Actualités            — ministry news, kept deliberately light
 *   04 Le droit              — the central access to the legal reference corpus
 *   05 Les juridictions      — the court system and how to find a court
 *   06 Vos démarches         — the great families of user procedures
 *   07 Services numériques   — digital services, access to personal services via MyGouv
 *   08 Professionnels        — judges, legal professionals, careers and training
 *   09 Données & ressources  — decisions, statistics, publications, open data
 *   10 Le Ministère          — discreet institutional closing
 *
 * Every section is driven by the `ministryHome` configuration
 * (lib/home-content.ts) and the message catalogs, so the content can evolve
 * without rewriting the interface. Destinations deliberately reuse the header
 * vocabulary and the URL plan of `lib/site-structure.ts`: the page does not
 * reproduce the header navigation, it selects the actions that matter to the
 * visitor. MyGouv stays the transversal identity layer of the Republic — the
 * homepage only provides access to it when a personal service requires it.
 */
export default async function HomePage({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const tNavPanel = await getTranslations({ locale, namespace: "nav.panel" });
  const myGouvHref = getDomainUrl("sso", "/login");

  return (
    <>
      {/* 01 — Hero / Recherche: institutional statement and the main search,
          visually the most important element of the page. */}
      <section className="gov-section" aria-labelledby="home-hero-title">
        <div className="gov-section__container" style={heroContainerStyle}>
          <p className="gov-kicker">{t("hero.kicker")}</p>
          <h1 id="home-hero-title">{t("hero.title")}</h1>
          <p className="gov-lead">{t("hero.lead")}</p>
          <div style={searchBlockStyle}>
            <h2 id="home-search-title" style={searchTitleStyle}>
              {t("search.title")}
            </h2>
            <PortalSearchBar label={t("search.label")} placeholder={t("search.placeholder")} />
            <div style={{ marginTop: "1.25rem" }}>
              <p style={popularLabelStyle} id="popular-searches-label">
                {t("search.popularLabel")}
              </p>
              <ul style={popularListStyle} aria-labelledby="popular-searches-label">
                {ministryHome.popularSearches.map((search) => (
                  <li key={search.key}>
                    <SearchSuggestionTag
                      label={t(`search.popular.${search.key}`)}
                      href={search.href}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 02 — Accès rapides: the functional heart of the page, concrete
          frequent actions each mapped to a real destination. */}
      <ThemeSection
        id="actions-title"
        kicker={t("actions.kicker")}
        title={t("actions.title")}
        lead={t("actions.lead")}
        subtle
      >
        <div className="fr-grid-row fr-grid-row--gutters">
          {ministryHome.actions.map((item) => (
            <div key={item.key} className="fr-col-12 fr-col-md-6 fr-col-lg-4">
              <LinkTile
                title={t(`actions.items.${item.key}.title`)}
                desc={t(`actions.items.${item.key}.desc`)}
                href={item.href}
                iconId={item.iconId}
              />
            </div>
          ))}
        </div>
      </ThemeSection>

      {/* 03 — Actualités de la Justice: one featured article, several
          secondary ones. News stays light — the homepage is not a news portal. */}
      <ThemeSection
        id="news-title"
        kicker={t("news.kicker")}
        title={t("news.title")}
        lead={t("news.lead")}
        action={
          <CtaButtonsGroup
            buttons={[
              {
                children: t("news.allLink"),
                href: `${sectionPaths.leMinistere}/actualites-et-contact/actualites`,
                priority: "secondary",
                iconId: "fr-icon-arrow-right-line",
              },
            ]}
          />
        }
      >
        <div className="fr-grid-row fr-grid-row--gutters">
          <div className="fr-col-12 fr-col-lg-7">
            <ArticleCard
              title={t(ministryHome.news.featured.titleKey)}
              desc={
                ministryHome.news.featured.textKey
                  ? t(ministryHome.news.featured.textKey)
                  : undefined
              }
              tag={t(ministryHome.news.featured.tagKey)}
              date={t(ministryHome.news.featured.dateKey)}
              href={ministryHome.news.featured.href}
              size="large"
            />
          </div>
          <div className="fr-col-12 fr-col-lg-5">
            <ul style={cardListStyle}>
              {ministryHome.news.secondary.map((article) => (
                <li key={article.href}>
                  <ArticleCard
                    title={t(article.titleKey)}
                    tag={t(article.tagKey)}
                    date={t(article.dateKey)}
                    href={article.href}
                    size="small"
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ThemeSection>

      {/* 04 — Le droit: central access to the Astorian legal reference corpus.
          Given a strong visual presence since it is a core function of the portal. */}
      <ThemeSection
        id="droit-title"
        kicker={t("droit.kicker")}
        title={t("droit.title")}
        lead={t("droit.lead")}
        subtle
        action={
          <CtaButtonsGroup
            buttons={[
              {
                children: t("droit.cta"),
                href: sectionPaths.droit,
                priority: "secondary",
                iconId: "fr-icon-arrow-right-line",
              },
            ]}
          />
        }
      >
        <ul className="fr-grid-row fr-grid-row--gutters" role="list">
          {ministryHome.droit.map((item) => (
            <li key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-3">
              <a href={item.href} style={teaserCardStyle}>
                <span className={item.iconId} aria-hidden="true" style={iconBlockStyle} />
                <span style={teaserTextStyle}>
                  <span style={teaserTagStyle}>{t(`droit.items.${item.key}.tag`)}</span>
                  <span style={teaserTitleStyle}>{t(`droit.items.${item.key}.title`)}</span>
                  <span style={teaserDescStyle}>{t(`droit.items.${item.key}.desc`)}</span>
                </span>
                <span className="fr-icon-arrow-right-line" aria-hidden="true" style={teaserArrowStyle} />
              </a>
            </li>
          ))}
        </ul>
      </ThemeSection>

      {/* 05 — Les juridictions: the court system, from the Supreme Court to the
          courts of first instance, with an entry point to find a court. */}
      <ThemeSection
        id="juridictions-title"
        kicker={t("juridictions.kicker")}
        title={t("juridictions.title")}
        lead={t("juridictions.lead")}
        action={
          <CtaButtonsGroup
            buttons={[
              {
                children: t("juridictions.findLink"),
                href: `${sectionPaths.juridictions}/tribunaux/annuaire-des-tribunaux`,
                priority: "secondary",
                iconId: "fr-icon-map-pin-2-line",
              },
            ]}
          />
        }
      >
        <ul className="fr-grid-row fr-grid-row--gutters" role="list">
          {ministryHome.juridictions.map((item) => (
            <li key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-3">
              <a href={item.href} style={teaserCardStyle}>
                <span className={item.iconId} aria-hidden="true" style={iconBlockStyle} />
                <span style={teaserTextStyle}>
                  <span style={teaserTitleStyle}>{t(`juridictions.items.${item.key}.title`)}</span>
                  <span style={teaserDescStyle}>{t(`juridictions.items.${item.key}.desc`)}</span>
                </span>
                <span className="fr-icon-arrow-right-line" aria-hidden="true" style={teaserArrowStyle} />
              </a>
            </li>
          ))}
        </ul>
      </ThemeSection>

      {/* 06 — Vos démarches: strongly user-oriented, the great families of
          procedures — the visitor understands immediately where to start. */}
      <ThemeSection
        id="procedures-title"
        kicker={t("procedures.kicker")}
        title={t("procedures.title")}
        lead={t("procedures.lead")}
        subtle
        action={
          <CtaButtonsGroup
            buttons={[
              {
                children: t("procedures.allLink"),
                href: sectionPaths.procedures,
                priority: "secondary",
                iconId: "fr-icon-arrow-right-line",
              },
            ]}
          />
        }
      >
        <div className="fr-grid-row fr-grid-row--gutters">
          {ministryHome.procedures.map((item) => (
            <div key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-3">
              <LinkTile
                title={t(`procedures.items.${item.key}.title`)}
                desc={t(`procedures.items.${item.key}.desc`)}
                href={item.href}
                iconId={item.iconId}
              />
            </div>
          ))}
        </div>
      </ThemeSection>

      {/* 07 — Services numériques: the digital services of the ministry. MyGouv
          stays the transversal identity layer of the Republic — no second
          personal space is created here, only access to it. */}
      <ThemeSection
        id="services-title"
        kicker={t("services.kicker")}
        title={t("services.title")}
        lead={t("services.lead")}
      >
        <div className="fr-grid-row fr-grid-row--gutters">
          {ministryHome.services.map((item) => (
            <div key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-3">
              <LinkTile
                title={t(`services.items.${item.key}.title`)}
                desc={t(`services.items.${item.key}.desc`)}
                href={item.href}
                iconId={item.iconId}
              />
            </div>
          ))}
        </div>
        <div style={myGouvPanelStyle}>
          <span className="fr-icon-lock-line" aria-hidden="true" style={iconBlockStyle} />
          <div style={{ flex: "1 1 24rem" }}>
            <h3 style={myGouvTitleStyle}>{t("services.mygouv.title")}</h3>
            <p style={myGouvTextStyle}>{t("services.mygouv.text")}</p>
          </div>
          <CtaButtonsGroup
            buttons={[
              {
                children: t("services.mygouv.cta"),
                href: myGouvHref,
                iconId: "fr-icon-lock-line",
              },
            ]}
          />
        </div>
      </ThemeSection>

      {/* 08 — Professionnels de la Justice: a distinct section for judges,
          legal professionals, careers and training. */}
      <ThemeSection
        id="professionnels-title"
        kicker={t("professionnels.kicker")}
        title={t("professionnels.title")}
        lead={t("professionnels.lead")}
        subtle
        action={
          <CtaButtonsGroup
            buttons={[
              {
                children: t("professionnels.cta"),
                href: sectionPaths.professionnels,
                priority: "secondary",
                iconId: "fr-icon-arrow-right-line",
              },
            ]}
          />
        }
      >
        <ul className="fr-grid-row fr-grid-row--gutters" role="list">
          {ministryHome.professionnels.map((item) => (
            <li key={item.key} className="fr-col-12 fr-col-sm-6 fr-col-lg-3">
              <a href={item.href} style={teaserCardStyle}>
                <span className={item.iconId} aria-hidden="true" style={iconBlockStyle} />
                <span style={teaserTextStyle}>
                  <span style={teaserTitleStyle}>{t(`professionnels.items.${item.key}.title`)}</span>
                  <span style={teaserDescStyle}>{t(`professionnels.items.${item.key}.desc`)}</span>
                </span>
                <span className="fr-icon-arrow-right-line" aria-hidden="true" style={teaserArrowStyle} />
              </a>
            </li>
          ))}
        </ul>
      </ThemeSection>

      {/* 09 — Données, décisions & ressources: transparency and public
          resources. Labels reuse the header vocabulary — not a second
          navigation. */}
      <ThemeSection
        id="donnees-title"
        kicker={t("donnees.kicker")}
        title={t("donnees.title")}
        lead={t("donnees.lead")}
        action={
          <CtaButtonsGroup
            buttons={[
              {
                children: t("donnees.allLink"),
                href: sectionPaths.donneesRessources,
                priority: "secondary",
                iconId: "fr-icon-arrow-right-line",
              },
            ]}
          />
        }
      >
        <ul role="list" style={linkListStyle}>
          {ministryHome.resources.map((item) => (
            <li key={item.key}>
              <a href={item.href} style={resourceLinkStyle}>
                {tNavPanel(item.key)}
                <span className="fr-icon-arrow-right-line" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </ThemeSection>

      {/* 10 — Le Ministère: discreet institutional closing. The user first
          does, then understands, then discovers the institution. */}
      <section className="gov-section gov-section--subtle" aria-labelledby="ministry-title">
        <div className="gov-section__container" style={heroContainerStyle}>
          <p className="gov-kicker">{t("ministry.kicker")}</p>
          <h2 id="ministry-title" className="gov-section__title">
            {t("ministry.title")}
          </h2>
          <p style={ministryLeadStyle}>{t("ministry.lead")}</p>
          <ul
            role="list"
            style={{
              ...popularListStyle,
              justifyContent: "center",
              marginTop: "1.5rem",
              gap: "0.625rem 1.75rem",
            }}
          >
            {ministryHome.ministry.map((link) => (
              <li key={link.key}>
                <a href={link.href} style={{ fontWeight: 600, textUnderlineOffset: "0.2em" }}>
                  {tNavPanel(link.key)}
                  <span className="fr-icon-arrow-right-line" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}