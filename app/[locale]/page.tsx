import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { corePrograms } from "@/lib/catalogue";
import { getCopy, isLocale } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/metadata";
import styles from "./pages.module.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getCopy(locale);
  return createLocalizedMetadata(locale, copy.home.title, copy.home.intro);
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);
  const metrics = locale === "it"
    ? [["−196 °C", "Preservazione"], ["24 / 7", "Monitoraggio"], ["∞", "Orizzonte"]]
    : [["−196 °C", "Preservation"], ["24 / 7", "Monitoring"], ["∞", "Horizon"]];

  return (
    <>
      <section className={styles.hero}>
        <Image
          className={styles.heroImage}
          src="/images/le-hero.png"
          alt="A glass research tower rising above a soft pastel cloud layer"
          fill
          priority
          sizes="100vw"
        />
        <div className={styles.heroVeil} />
        <div className={styles.heroContent}>
          <p className="eyebrow">{copy.home.eyebrow}</p>
          <h1>
            {locale === "it" ? "La tua vita non deve " : "Your life does not have to "}
            <span className={styles.glitchWord} data-text={locale === "it" ? "finire qui." : "end here."}>
              {locale === "it" ? "finire qui." : "end here."}
            </span>
          </h1>
          <p className={styles.heroIntro}>{copy.home.intro}</p>
          <div className={styles.heroActions}>
            <Link className="button-primary" href={`/${locale}/enroll`}>
              {copy.common.begin} <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button-secondary" href={`/${locale}/how-it-works`}>
              {copy.nav.how}
            </Link>
          </div>
          <p className={styles.heroAssurance}>{copy.home.assurance}</p>
          <div className={styles.heroMetrics} aria-label="Program highlights">
            {metrics.map(([value, label]) => (
              <div className={styles.heroMetric} key={label}>
                <strong>{value}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.futureSection}>
        <div className={styles.futureGrid}>
          <p className="eyebrow">{copy.home.futureEyebrow}</p>
          <div>
            <h2>{copy.home.futureTitle}</h2>
            <div className={styles.futureCopy}>
              <p>{copy.home.futureBody}</p>
              <Link className="text-link" href={`/${locale}/plans`}>
                {copy.common.explorePlans} <span aria-hidden="true">↗</span>
              </Link>
            </div>
          </div>
        </div>
        <div className={styles.featuredGrid}>
          {corePrograms.map((item) => (
            <ProductCard key={item.id} item={item} locale={locale} copy={copy} featured />
          ))}
        </div>
      </section>

      <section className={styles.processSection}>
        <div className={styles.processHeader}>
          <p className="eyebrow">{copy.home.processEyebrow}</p>
          <h2>{copy.home.processTitle}</h2>
        </div>
        <div className={styles.processGrid}>
          {copy.home.process.map((step) => (
            <article className={styles.processCard} key={step.number}>
              <span className={styles.processNumber}>{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.bennySection}>
        <div className={styles.bennySeal} aria-hidden="true">
          <div className={styles.bennySealInner}>
            <span>B</span>
            <span>Verified continuity</span>
          </div>
        </div>
        <div className={styles.bennyCopy}>
          <p className="eyebrow">{copy.home.bennyEyebrow}</p>
          <h2>{copy.home.bennyTitle}</h2>
          <p>{copy.home.bennyBody}</p>
          <Link className="text-link" href={`/${locale}/how-it-works`}>
            {copy.common.learnMore} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <section className={styles.finalCta}>
        <h2>{copy.home.finalTitle}</h2>
        <p>{copy.home.finalBody}</p>
        <Link className="button-primary" href={`/${locale}/enroll`}>
          {copy.common.begin} <span aria-hidden="true">↗</span>
        </Link>
      </section>
    </>
  );
}
