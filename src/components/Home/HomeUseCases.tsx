// FILE: src/components/Home/HomeUseCases.tsx

import items from "@/data/items.json";
import styles from "./HomeUseCases.module.css";

const CATEGORY_ORDER = ["Paper Bags", "Paper Covers", "Paper Boxes"];
const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  "Paper Bags": "Commonly used for takeaway, carry-out, and in-store packaging.",
  "Paper Covers": "Used where lightweight, hygienic outer protection is required.",
  "Paper Boxes": "Suitable for structured food and retail packaging formats.",
};
const formatLabel = (value: string) =>
  value
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const useCases = Object.values(
  items.reduce(
    (
      acc: Record<string, { category: string; industries: Set<string> }>,
      item: any
    ) => {
      const category =
        typeof item.category === "string" ? item.category : "Packaging";

      if (!acc[category]) {
        acc[category] = {
          category,
          industries: new Set<string>(),
        };
      }

      const industries = item.taxonomy?.industries;
      if (Array.isArray(industries)) {
        industries
          .map((entry: string) => entry.trim())
          .filter(Boolean)
          .forEach((industry: string) => {
            acc[category].industries.add(industry);
          });
      }

      return acc;
    },
    {}
  )
)
  .map((group) => {
    const industries = Array.from(group.industries).sort();
    return {
      category: group.category,
      industries: industries.map((industry) => formatLabel(industry)),
    };
  })
  .sort((a, b) => {
    const aIndex = CATEGORY_ORDER.indexOf(a.category);
    const bIndex = CATEGORY_ORDER.indexOf(b.category);
    const safeA = aIndex === -1 ? CATEGORY_ORDER.length : aIndex;
    const safeB = bIndex === -1 ? CATEGORY_ORDER.length : bIndex;
    return safeA - safeB;
  });

export default function HomeUseCases() {
  return (
    <section className={styles.section} id="use-cases">
      <div className={styles.inner}>
        <div className={styles.header}>
          <p className={styles.kicker}>Industries</p>
          <h2 className={styles.title}>Industries by product category</h2>
          <p className={styles.lede}>See where each packaging format is commonly used.</p>
        </div>

        <div className={styles.grid}>
          {useCases
            .filter((useCase) => useCase.industries.length > 0)
            .map((useCase) => (
              <article key={useCase.category} className={styles.card}>
                <h3 className={styles.category}>{useCase.category}</h3>
                {CATEGORY_DESCRIPTIONS[useCase.category] ? (
                  <p className={styles.description}>{CATEGORY_DESCRIPTIONS[useCase.category]}</p>
                ) : null}
                <ul className={`${styles.list} ${styles.usecaseList}`}>
                  {useCase.industries.map((industry) => (
                    <li key={industry} className={styles.listItem}>
                      {industry}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
        </div>
      </div>
    </section>
  );
}
