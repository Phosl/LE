import type { Metadata } from "next";
import type { Locale } from "@/lib/types";

export const siteUrl = "https://lifeextension.vercel.app";
export const siteName = "Life Extension Corporation";
export const socialImage = "/images/le-hero.png";

const localeTags: Record<Locale, string> = { en: "en_US", it: "it_IT" };

export function localizedUrl(locale: Locale, path = ""): string {
  return `${siteUrl}/${locale}${path}`;
}

export function createLocalizedMetadata(
  locale: Locale,
  title: string,
  description: string,
  path = "",
): Metadata {
  const url = localizedUrl(locale, path);
  const alternateLocale = locale === "en" ? "it" : "en";

  return {
    title: { absolute: `${title} — ${siteName}` },
    description,
    alternates: {
      canonical: url,
      languages: {
        en: localizedUrl("en", path),
        it: localizedUrl("it", path),
        "x-default": localizedUrl("en", path),
      },
    },
    openGraph: {
      type: "website",
      url,
      siteName,
      locale: localeTags[locale],
      alternateLocale: [localeTags[alternateLocale]],
      title,
      description,
      images: [{ url: socialImage, alt: "Life Extension Corporation" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [socialImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}
