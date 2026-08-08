import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { getCopy, isLocale } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/metadata";
import styles from "../pages.module.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getCopy(locale);
  return createLocalizedMetadata(locale, copy.nav.faq, copy.faq.intro, "/faq");
}

export default async function FaqPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);
  return (
    <>
      <PageIntro eyebrow={copy.faq.eyebrow} title={copy.faq.title} intro={copy.faq.intro} />
      <section className={styles.contentSection}>
        <div className={styles.faqList}>
          {copy.faq.items.map((item) => (
            <details className={styles.faqItem} key={item.question}>
              <summary>{item.question}</summary><p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>
    </>
  );
}
