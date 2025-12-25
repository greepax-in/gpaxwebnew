// FILE: src/components/Home/HomeUseCases.tsx

import items from "@/data/items.json";

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
    <section className="section section-usecases" id="use-cases">
      <div className="container">
        <div className="section-header fade-up">
          <p className="section-kicker">Industries</p>
          <h2>Industries by product category</h2>
          <p className="section-lede">
            See where each packaging format is commonly used.
          </p>
        </div>

        <div className="usecase-grid">
          {useCases
            .filter((useCase) => useCase.industries.length > 0)
            .map((useCase) => (
              <div key={useCase.category} className="usecase-card card">
                <h3>{useCase.category}</h3>
                {CATEGORY_DESCRIPTIONS[useCase.category] && (
                  <p className="usecase-desc">{CATEGORY_DESCRIPTIONS[useCase.category]}</p>
                )}
                <ul className="usecase-list">
                  {useCase.industries.map((industry) => (
                    <li key={industry}>{industry}</li>
                  ))}
                </ul>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
