// FILE: src/components/Home/HomeWhyGreenPax.tsx

import styles from "./HomeWhyGreenPax.module.css";

export default function HomeWhyGreenPax() {
  const reasons = [
    {
      title: "Manufacturing-first Direct",
      detail: "Direct manufacturing with pan-India dispatch",
    },
    {
      title: "Quality & compliance",
      detail: "Food-safe inks and adhesives with batch-level quality checks",
    },
    {
      title: "Print-ready customisation",
      detail: "Custom printing, die-cuts, handles, and windowing options",
    },
    {
      title: "Reliable lead times",
      detail: "MOQ-based scheduling with clear dispatch windows for repeat orders",
    },
  ];

  return (
    <section className={styles.section} id="why-greenpax">
      <div className={styles.container}>
        <header className={styles.header}>
          <p className={styles.kicker}>Why GreenPax</p>
          <h2 className={styles.title}>
            Manufacturing partnership,
            <br />
            not a marketplace
          </h2>
          <p className={styles.lede}>
            Trust-first collaboration for MOQ-based packaging with clear production planning and
            consistent dispatch schedules.
          </p>
        </header>
        <ul className={`${styles.list} ${styles.whyGrid}`}>
          {reasons.map((reason) => (
            <li key={reason.title} className={styles.item}>
              <p className={styles.reasonTitle}>{reason.title}</p>
              <p className={styles.reasonDetail}>{reason.detail}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
