import { en } from "@/lib/content/en";
import { it } from "@/lib/content/it";
import { locales, type Locale, type SiteCopy } from "@/lib/types";

const dictionaries: Record<Locale, SiteCopy> = { en, it };

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function getCopy(locale: Locale): SiteCopy {
  return dictionaries[locale];
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "en" ? "it" : "en";
}

export function localizePath(locale: Locale, path: string): string {
  const segments = path.split("/").filter(Boolean);
  if (segments.length && isLocale(segments[0])) segments[0] = locale;
  else segments.unshift(locale);
  return `/${segments.join("/")}`;
}
