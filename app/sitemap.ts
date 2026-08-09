import type { MetadataRoute } from "next";
import { localizedUrl } from "@/lib/metadata";
import { locales } from "@/lib/types";

const publicRoutes = [
  { path: "", changeFrequency: "monthly" as const, priority: 1 },
  { path: "/plans", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/how-it-works", changeFrequency: "monthly" as const, priority: 0.8 },
  { path: "/about", changeFrequency: "yearly" as const, priority: 0.6 },
  { path: "/faq", changeFrequency: "monthly" as const, priority: 0.7 },
] as const;

function alternateLanguages(path: string): Record<string, string> {
  return {
    en: localizedUrl("en", path),
    it: localizedUrl("it", path),
    "x-default": localizedUrl("en", path),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    publicRoutes.map(({ path, changeFrequency, priority }) => ({
      url: localizedUrl(locale, path),
      changeFrequency,
      priority,
      alternates: { languages: alternateLanguages(path) },
    })),
  );
}
