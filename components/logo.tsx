import Link from "next/link";
import type { Locale } from "@/lib/types";
import styles from "./site-chrome.module.css";

interface LogoProps {
  locale: Locale;
  compact?: boolean;
}

export function Logo({ locale, compact = false }: LogoProps) {
  return (
    <Link className={styles.logo} href={`/${locale}`} aria-label="Life Extension Corporation home">
      <span className={styles.logoMark} aria-hidden="true">
        LE
      </span>
      {!compact && (
        <span className={styles.logoType}>
          <strong>Life Extension</strong>
          <span>Corporation</span>
        </span>
      )}
    </Link>
  );
}
