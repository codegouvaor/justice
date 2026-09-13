import { setRequestLocale } from "next-intl/server";
import { resolveLocaleParam } from "@/lib/localized-metadata";

type PageProps = { params: Promise<{ locale: string }> };

export default async function Page({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocaleParam(rawLocale);
  setRequestLocale(locale);

  return null;
}
