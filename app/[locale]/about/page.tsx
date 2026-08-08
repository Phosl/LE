import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PageIntro } from "@/components/page-intro";
import { getCopy, isLocale } from "@/lib/i18n";
import { createLocalizedMetadata } from "@/lib/metadata";
import styles from "../pages.module.css";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const copy = getCopy(locale);
  return createLocalizedMetadata(locale, copy.nav.about, copy.about.intro, "/about");
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const copy = getCopy(locale);
  return (
    <>
      <PageIntro eyebrow={copy.about.eyebrow} title={copy.about.title} intro={copy.about.intro} />
      <section className={styles.aboutFeature}>
        <div className={styles.aboutImage}><Image src="/images/le-lounge.png" alt="A calm white corporate reception lounge with a cobalt artwork" fill sizes="100vw" /></div>
      </section>
      <section className={styles.contentSection}>
        <div className={styles.aboutStory}>
          <h2>{copy.about.storyTitle}</h2>
          <div className={styles.aboutStoryCopy}>{copy.about.storyBody.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
        </div>
      </section>
      <section className={styles.contentSection}>
        <h2 className={styles.sectionTitle}>{copy.about.principlesTitle}</h2>
        <div className={styles.principlesGrid}>
          {copy.about.principles.map((principle, index) => (
            <article className={styles.principle} key={principle.title}>
              <span>0{index + 1}</span><h3>{principle.title}</h3><p>{principle.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
