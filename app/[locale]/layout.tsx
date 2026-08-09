import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getCopy, isLocale } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/metadata";
import { JsonLd } from "@/components/json-ld";
import { createSiteJsonLd } from "@/lib/structured-data";
import { locales } from "@/lib/types";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getCopy(locale);
  return createLocalizedMetadata(locale, copy.home.title, copy.home.intro);
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);

  return (
    <div lang={locale}>
      <JsonLd data={createSiteJsonLd(locale, copy)} />
      <a className="skip-link" href="#main-content">
        {locale === "it" ? "Vai al contenuto" : "Skip to content"}
      </a>
      <SiteHeader locale={locale} copy={copy} />
      <main id="main-content">{children}</main>
      <SiteFooter locale={locale} copy={copy} />
    </div>
  );
}
