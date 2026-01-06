import Image from "next/image";
import styles from "./HomeHero.module.css";

export default function HomeHeroServer({ children }: { children?: React.ReactNode }) {
  return (
    <section className={`home-hero hero-fold-safe ${styles.heroContainer}`}>
      <div className={styles.heroContent}>
        <h1 className={styles.heroTitle}>Eco-Friendly Paper Packaging Manufacturer</h1>

        <div className={styles.heroCTAContainer}>
          {children}
        </div>

        <p className={styles.heroLead}>
          <span className={styles.heroLeadLine}>
            Bulk paper bags, covers, and boxes.
          </span>
          <span className={styles.heroLeadLine}>
            Manufactured in India with MOQ-based production.
          </span>
        </p>
      </div>

      {/* Desktop-only visual (separate column) */}
      <figure className={styles.heroVisualDesktop} data-hero-surface>
        <Image
          src="/images/home/hero/printed-kraft-square-bottom-paper-bags.avif"
          alt="Eco-friendly paper packaging manufacturer in India"
          width={400}
          height={500}
          priority
          fetchPriority="high"
          sizes="(min-width: 900px) 400px"
          className={styles.heroImage}
          data-hero="true"
        />
      </figure>
    </section>
  );
}
