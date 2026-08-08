"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { alternateLocale, localizePath } from "@/lib/i18n";
import type { Locale, SiteCopy } from "@/lib/types";
import styles from "./site-chrome.module.css";

interface SiteHeaderProps {
  locale: Locale;
  copy: SiteCopy;
}

export function SiteHeader({ locale, copy }: SiteHeaderProps) {
  const pathname = usePathname();
  const otherLocale = alternateLocale(locale);
  const alternatePath = localizePath(otherLocale, pathname);
  const links = [
    { href: `/${locale}/plans`, label: copy.nav.plans },
    { href: `/${locale}/how-it-works`, label: copy.nav.how },
    { href: `/${locale}/about`, label: copy.nav.about },
    { href: `/${locale}/faq`, label: copy.nav.faq },
  ];

  const rememberLocale = () => {
    document.cookie = `le-locale=${otherLocale}; path=/; max-age=31536000; samesite=lax`;
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerInner}>
        <Logo locale={locale} />
        <nav className={styles.desktopNav} aria-label="Primary navigation">
          {links.map((link) => (
            <Link key={link.href} href={link.href} data-active={pathname === link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
        <div className={styles.headerActions}>
          <span className={styles.systemStatus}>{copy.brand.system}</span>
          <Link className={styles.language} href={alternatePath} onClick={rememberLocale}>
            {copy.nav.language}
          </Link>
          <Link className={styles.headerCta} href={`/${locale}/enroll`}>
            {copy.nav.enroll}
          </Link>
          <details className={styles.mobileMenu}>
            <summary>{copy.nav.menu}</summary>
            <div className={styles.mobileMenuPanel}>
              {links.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
              <Link href={alternatePath} onClick={rememberLocale}>
                {copy.nav.language}
              </Link>
              <Link href={`/${locale}/enroll`}>{copy.nav.enroll}</Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
