import Image from "next/image";
import Link from "next/link";
import type { CatalogueItem } from "@/lib/catalogue";
import type { Locale, SiteCopy } from "@/lib/types";
import styles from "./editorial.module.css";

interface ProductCardProps {
  item: CatalogueItem;
  locale: Locale;
  copy: SiteCopy;
  featured?: boolean;
}

export function ProductCard({ item, locale, copy, featured = false }: ProductCardProps) {
  const content = copy.catalogue[item.id];
  return (
    <article className={`${styles.productCard} ${featured ? styles.productFeatured : ""}`}>
      {item.image && (
        <div className={styles.productImage}>
          <Image src={item.image} alt="" fill sizes={featured ? "(max-width: 800px) 100vw, 50vw" : "50vw"} />
        </div>
      )}
      <div className={styles.productBody}>
        <div className={styles.productMeta}>
          <span>{content.eyebrow}</span>
          <span>{item.classification === "canon" ? copy.common.canon : copy.common.expanded}</span>
        </div>
        <h3>{content.name}</h3>
        <p className={styles.productSummary}>{content.summary}</p>
        <p className={styles.productDetail}>{content.detail}</p>
        <Link className="text-link" href={`/${locale}/enroll`}>
          {copy.common.begin} <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
