import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { getCopy, isLocale } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/metadata";
import styles from "../pages.module.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getCopy(locale);
  return createLocalizedMetadata(locale, copy.nav.how, copy.how.intro, "/how-it-works");
}

export default async function HowPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);
  return (
    <>
      <PageIntro eyebrow={copy.how.eyebrow} title={copy.how.title} intro={copy.how.intro} />
      <div className={styles.imageFeature}>
        <Image src="/images/cryo-suite.png" alt="A sealed cryogenic vessel in a quiet clinical suite" fill sizes="100vw" />
        <span className={styles.imageCaption}>VESSEL ARRAY / CONTROLLED ENVIRONMENT</span>
      </div>
      <section className={styles.contentSection}>
        <div className={styles.stepsList}>
          {copy.how.steps.map((step) => (
            <article className={styles.stepRow} key={step.number}>
              <span>{step.number}</span><h3>{step.title}</h3><p>{step.body}</p>
            </article>
          ))}
        </div>
        <div className={styles.specGrid}>
          {copy.how.specs.map((spec) => <div className={styles.spec} key={spec.label}><strong>{spec.value}</strong><span>{spec.label}</span></div>)}
        </div>
        <div className={styles.lucidFeature}>
          <div className={styles.lucidImage}><Image src="/images/lucid-horizon.png" alt="An empty white chair facing a luminous ocean above the clouds" fill sizes="(max-width: 900px) 100vw, 55vw" /></div>
          <div className={styles.lucidCopy}>
            <p className="eyebrow">{copy.how.lucidEyebrow}</p><h2>{copy.how.lucidTitle}</h2><p>{copy.how.lucidBody}</p>
            <Link className="text-link" href={`/${locale}/enroll`}>{copy.common.begin} <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </section>
    </>
  );
}
