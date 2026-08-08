import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { ProductCard } from "@/components/product-card";
import { corePrograms, modules } from "@/lib/catalogue";
import { getCopy, isLocale } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/metadata";
import styles from "../pages.module.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getCopy(locale);
  return createLocalizedMetadata(locale, copy.nav.plans, copy.plans.intro, "/plans");
}

export default async function PlansPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);
  return (
    <>
      <PageIntro eyebrow={copy.plans.eyebrow} title={copy.plans.title} intro={copy.plans.intro} />
      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>{copy.plans.coreTitle}</h2>
        <div className={styles.plansGrid}>
          {corePrograms.map((item) => <ProductCard key={item.id} item={item} locale={locale} copy={copy} featured />)}
        </div>
      </section>
      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>{copy.plans.modulesTitle}</h2>
        <div className={styles.moduleGrid}>
          {modules.map((item) => <ProductCard key={item.id} item={item} locale={locale} copy={copy} />)}
        </div>
      </section>
      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>{copy.plans.includedTitle}</h2>
        <div className={styles.includedGrid}>
          {copy.plans.includedItems.map((item) => (
            <article className={styles.includedCard} key={item.title}>
              <span className={styles.includedIcon} aria-hidden="true">✓</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
        <p className={styles.plansNote}>{copy.plans.note}</p>
      </section>
    </>
  );
}
