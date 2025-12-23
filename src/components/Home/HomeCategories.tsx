// FILE: src/components/Home/HomeCategories.tsx

import Image from "next/image";
import items from "@/data/items.json";
import { getHomepageWhatsAppLink } from "@/components/Common/WhatsAppCTA";

const CATEGORY_ORDER = ["Paper Bags", "Paper Covers", "Paper Boxes"];
const TAG_LABELS: Record<string, string> = {
  new: "High volume",
  hot: "Most requested",
  popular: "Bulk ready",
};

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");

const categories = Object.values(
  items.reduce((acc: Record<string, any>, item: any) => {
    const category = item.category ?? "Other";
    if (!acc[category]) {
      acc[category] = {
        category,
        slug: item.categorySlug ?? item["category-slug"] ?? "",
        items: [] as any[],
        productSlugs: new Set<string>(),
        subcategories: new Set<string>(),
        subcategorySlugs: new Map<string, string>(),
      };
    }

    acc[category].items.push(item);
    const productSlug =
      (typeof item.slug === "string" && item.slug) ||
      (typeof item.pageLink === "string" && item.pageLink) ||
      (typeof item.name === "string" && item.name) ||
      "";
    if (productSlug) {
      acc[category].productSlugs.add(productSlug);
    }

    const slug = item.categorySlug ?? item["category-slug"] ?? "";
    if (!acc[category].slug && slug) {
      acc[category].slug = slug;
    }

    if (item.subcategory) {
      acc[category].subcategories.add(item.subcategory);
      if (!acc[category].subcategorySlugs.has(item.subcategory)) {
        const subcategorySlug =
          item.subcategorySlug ??
          (typeof item.subcategory === "string"
            ? toSlug(item.subcategory)
            : "");
        if (subcategorySlug) {
          acc[category].subcategorySlugs.set(item.subcategory, subcategorySlug);
        }
      }
    }

    return acc;
  }, {} as Record<string, any>)
)
  .map((group: any) => {
    const featured =
      group.items.find((entry: any) => entry.featured === true) ??
      group.items[0];

    return {
      category: group.category,
      slug: group.slug,
      featured,
      productCount: group.productSlugs.size || group.items.length,
      subcategoryCount: group.subcategories.size,
      subcategories: Array.from(group.subcategories),
      subcategorySlugs: group.subcategorySlugs,
    };
  })
  .sort((a: any, b: any) => {
    const aIndex = CATEGORY_ORDER.indexOf(a.category);
    const bIndex = CATEGORY_ORDER.indexOf(b.category);
    const safeA = aIndex === -1 ? CATEGORY_ORDER.length : aIndex;
    const safeB = bIndex === -1 ? CATEGORY_ORDER.length : bIndex;
    return safeA - safeB;
  });

export default function HomeCategories() {
  return (
    <section className="section section-categories" id="categories">
      <div className="container">
        <div className="section-header fade-up">
          <p className="section-kicker">Capabilities</p>
          <h2>Packaging categories we manufacture</h2>
          <p className="section-lede">
            Pick your format, then share size, print specs, and delivery
            timeline.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((group: any) => {
            const featured = group.featured;
            const image = featured?.featuredImage ?? featured?.image;
            const resolvedImage =
              typeof image === "string"
                ? image.startsWith("/")
                  ? image
                  : `/${image}`
                : null;
            const tag =
              typeof featured?.tag === "string" ? featured.tag.trim() : "";
            const tagLabel = tag
              ? TAG_LABELS[tag.toLowerCase()] ?? tag
              : "";
            const summary =
              featured?.subTitle ??
              `Bulk-ready ${group.category.toLowerCase()} built to spec.`;
            const subcategories = group.subcategories.slice(0, 3);
            const categorySlug = group.slug || toSlug(group.category);

            return (
              <article key={group.category} className="category-card card">
                <div className="category-visual">
                  {resolvedImage ? (
                    <Image
                      src={resolvedImage}
                      alt={`${group.category} packaging by GreenPax`}
                      width={320}
                      height={220}
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="category-image"
                    />
                  ) : (
                    <span className="category-placeholder">
                      {group.category}
                    </span>
                  )}
                  {tagLabel ? (
                    <span className="category-tag">{tagLabel}</span>
                  ) : null}
                </div>

                <div className="category-body">
                  <div className="category-header">
                    <h3>{group.category}</h3>
                    <p className="category-sub">{summary}</p>
                  </div>

                  <ul className="category-list">
                    {subcategories.map((subcategory: string) => (
                      <li key={subcategory}>
                        <a
                          className="category-chip"
                          href={`/categories/${categorySlug}/${group.subcategorySlugs?.get(subcategory) ?? toSlug(subcategory)}`}
                        >
                          {subcategory}
                        </a>
                      </li>
                    ))}
                  </ul>

                  <a
                    href={getHomepageWhatsAppLink(group.category)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cta"
                  >
                    Enquire on WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
