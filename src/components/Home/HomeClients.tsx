// FILE: src/components/Home/HomeClients.tsx

import { buildHomepageWhatsAppLink } from "@/lib/whatsapp";
import styles from "./HomeClients.module.css";

export default function HomeClients() {
  const proofPoints = [
    "Built for retail brands, QSR outlets, and pharmacy networks",
    "A fit for e-commerce sellers and boutique retailers",
  ];

  return (
    <section className={styles.section} id="clients">
      <div className={styles.inner}>
        <header className={styles.header}>
          <p className={styles.kicker}>Credibility</p>
          <h2 className={styles.title}>Trusted by growing Indian brands</h2>
          <p className={styles.lede}>
            Credibility built through recurring bulk orders, repeat manufacturing
            schedules, and consistent, on-time dispatches across India.
          </p>
        </header>
        <div className={styles.panel}>
          <ul className={styles.list}>
            {proofPoints.map((point) => (
              <li className={styles.listItem} key={point}>
                {point}
              </li>
            ))}
          </ul>
          <div className={styles.callout}>
            <p className={styles.calloutTitle}>Want to see sample work?</p>
            <div className={styles.sampleCtaRow}>
              <p className={`${styles.calloutText} ${styles.sampleCtaText}`}>
                Request recent print proofs, dispatch photos, and finish options on
                WhatsApp.
              </p>
              <a
                href={buildHomepageWhatsAppLink("Client samples request")}
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.cta} ${styles.sampleCtaButton}`}
              >
                Request samples on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
