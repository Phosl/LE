import styles from "./editorial.module.css";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  intro: string;
}

export function PageIntro({ eyebrow, title, intro }: PageIntroProps) {
  return (
    <section className={styles.pageIntro}>
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className={styles.pageIntroCopy}>{intro}</p>
    </section>
  );
}
