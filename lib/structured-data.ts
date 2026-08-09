import { localizedUrl, siteName, siteUrl } from "@/lib/metadata";
import type { Locale, SiteCopy } from "@/lib/types";

const languageTags: Record<Locale, string> = { en: "en-US", it: "it-IT" };

export function createSiteJsonLd(locale: Locale, copy: SiteCopy): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: siteName,
        url: siteUrl,
        logo: `${siteUrl}/icon.svg`,
        description: copy.footer.disclaimer,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: siteName,
        url: localizedUrl(locale),
        inLanguage: languageTags[locale],
        description: copy.home.intro,
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
}

export function createFaqJsonLd(locale: Locale, copy: SiteCopy): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${localizedUrl(locale, "/faq")}#faq`,
    inLanguage: languageTags[locale],
    mainEntity: copy.faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
