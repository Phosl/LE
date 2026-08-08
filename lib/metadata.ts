import type { Metadata } from "next";
import type { Locale } from "@/lib/types";

export function createLocalizedMetadata(
  locale: Locale,
  title: string,
  description: string,
  path = "",
): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: { en: `/en${path}`, it: `/it${path}` },
    },
    robots: { index: false, follow: false },
  };
}
