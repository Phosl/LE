import Link from "next/link";
import { Logo } from "@/components/logo";
import type { Locale, SiteCopy } from "@/lib/types";
import styles from "./site-chrome.module.css";

export function SiteFooter({ locale, copy }: { locale: Locale; copy: SiteCopy }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerLead}>
        <Logo locale={locale} />
        <p>{copy.footer.promise}</p>
      </div>
      <div className={styles.footerGrid}>
        <div>
          <span className={styles.footerLabel}>Explore</span>
          <Link href={`/${locale}/plans`}>{copy.nav.plans}</Link>
          <Link href={`/${locale}/how-it-works`}>{copy.nav.how}</Link>
          <Link href={`/${locale}/about`}>{copy.nav.about}</Link>
        </div>
        <div>
          <span className={styles.footerLabel}>Client services</span>
          <Link href={`/${locale}/faq`}>{copy.nav.faq}</Link>
          <Link href={`/${locale}/enroll`}>{copy.nav.enroll}</Link>
        </div>
        <div className={styles.footerLegal}>
          <span className={styles.footerLabel}>Specimen site</span>
          <p>{copy.footer.disclaimer}</p>
          <p>{copy.footer.privacy}</p>
        </div>
      </div>
      <div className={styles.footerBottom}>
        <span>© 2001—∞ Life Extension Corporation</span>
        <span>OASIS MIGRATION: PENDING</span>
      </div>
    </footer>
  );
}
