import Image from "next/image";
import styles from "./HomeHero.module.css";

export default function HomeHeroServer({ children }: { children?: React.ReactNode }) {
  return (
    <section className={`home-hero hero-fold-safe ${styles.heroContainer}`}>
      <div className={`hero-content ${styles.heroContent}`}>
        <h1 className={styles.heroTitle}>Eco-Friendly Paper Packaging Manufacturer</h1>

        {/* Primary CTA placed immediately after heading to ensure above-fold placement on mobile */}
        <div className={styles.heroCTAContainer}>
          {children}
        </div>

        <p className={styles.heroLead}>
          Bulk paper bags, covers, and boxes manufactured in India with
          MOQ-based production.
        </p>

        <figure className={styles.heroVisual}>
          <picture>
            <source
              srcSet="/images/home/hero/gpax-hero-final-400x500.webp"
              type="image/webp"
            />
            <Image
              src="/images/home/hero/gpax-hero-final-400x500.webp"
              alt="Eco-friendly paper packaging manufacturer in India"
              width={400}
              height={500}
              priority
              fetchPriority="high"
              sizes="(max-width: 480px) 320px, 400px"
              className={styles.heroImage}
              data-hero="true"
            />
          </picture>
        </figure>
      </div>
      {/* CTA is now rendered inside `.hero-content` */}
    </section>
  );
}
