// FILE: src/components/Home/HomeCategories.tsx

// image rendering uses <picture> with fallbacks
import items from "@/data/items.json";
import rawCategoryIndex from "@/data/categoryIndex.json";
import { buildHomepageWhatsAppLink } from "@/lib/whatsapp"
import styles from "./HomeCategories.module.css";

/* =========================================================
   CATEGORY INDEX TYPES (runtime-safe boundary)
   ========================================================= */

type CategoryIndex = {
  [categorySlug: string]: {
    category: string;
    subcategories: {
      [subcategorySlug: string]: {
        subcategory: string;
        productIds: string[];
        chips: {
          line1: string;
          line2: string[];
          line3: {
            moq: string;
            price: string;
            uom: "pcs" | "kg";
            secondaryUOMs?: ("pcs" | "kg")[];
          };
        };
      };
    };
  };
};

// Explicit boundary cast: JSON -> index map
const categoryIndex = rawCategoryIndex as CategoryIndex;

const CATEGORY_ORDER = ["Paper Bags", "Paper Covers", "Paper Boxes"];
const VARIANT_ORDER = ["plain", "printed", "multicolor"] as const;

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const categories = Object.values(
  (items as any[]).reduce((acc: Record<string, any>, item: any) => {
    const category = typeof item.category === "string" ? item.category : "Packaging";
    const slug = item.categorySlug || toSlug(category);

    if (!acc[slug]) {
      acc[slug] = { category, slug, items: [] as any[], anchor: null as any };
    }

    if (item.kind === "category-anchor") {
      acc[slug].anchor = item;
    } else {
      acc[slug].items.push(item);
    }
    return acc;
  }, {} as Record<string, any>)
)
  .map((group: any) => {
    const featured =
      group.anchor ??
      group.items.find((entry: any) => entry.featured === true) ??
      group.items[0];

    return {
      category: group.category,
      slug: group.slug,
      featured,
    };
  })
  .sort((a: any, b: any) => {
    const aIndex = CATEGORY_ORDER.indexOf(a.category);
    const bIndex = CATEGORY_ORDER.indexOf(b.category);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });

export default function HomeCategories() {
  return (
    <section className="section section-categories" id="categories">
      <div className="container">
        <div className="section-header fade-up">
          <p className="section-kicker">Capabilities</p>
          <h2>Packaging categories we manufacture</h2>
          <p className="section-lede">
            Pick your format, then share size, print specs, and delivery timeline.
          </p>
          <p className="section-note">
            Indicative pricing shown for reference. Final specifications, pricing,
            and delivery timelines are confirmed on enquiry.
          </p>
        </div>

        <div className={`category-grid ${styles.categoryGrid}`}>
          {categories.map((group: any) => {
            const categorySlug = group.slug || toSlug(group.category);
            const categoryData =
              categoryIndex[categorySlug]?.subcategories ?? {};

            const featured = group.featured;
            const image = featured?.image;
            const imageFallback = featured?.imageFallback;

            // derive subcategory-level signals before returning JSX
            const subcats = Object.values(categoryData);

            // LINE 1 - subcategory chips
            const subcategoryLabels = subcats.map((d: any) => d.chips.line1);
            const MAX_VISIBLE_CHIPS = 6;
            const visibleChips = subcategoryLabels.slice(0, MAX_VISIBLE_CHIPS);
            const remainingCount = subcategoryLabels.length - visibleChips.length;

            // LINE 2 - variants (union) + normalized order (plain → printed → multicolor)
            const variantSet = new Set<string>();
            subcats.forEach((d: any) =>
              (d.chips.line2 ?? []).forEach((v: string) => variantSet.add(v))
            );

            const variantFlags = {
              plain: Array.from(variantSet).some((v) => v.toLowerCase().includes("plain")),
              printed: Array.from(variantSet).some((v) => v.toLowerCase().includes("printed")),
              multicolor: Array.from(variantSet).some((v) => v.toLowerCase().includes("multi")),
            };

            // LINE 3 - MOQ + price (min)
            const moqs = subcats
              .map((d: any) => parseInt(d.chips.line3.moq, 10))
              .filter((n: number) => !isNaN(n));

            const prices = subcats
              .map((d: any) =>
                d.chips.line3.price
                  ? parseFloat(d.chips.line3.price.replace(/[^\d.]/g, ""))
                  : null
              )
              .filter((n: number | null) => typeof n === "number");

            const minMOQ = moqs.length ? Math.min(...moqs) : null;
            const minPrice = prices.length ? Math.min(...prices) : null;

            return (
              <article className={`${styles.card} card`} key={group.category}>
                <div className={styles.imageWrap}>
                  {image ? (
                    <picture className={styles.picture}>
                      {/* AVIF primary */}
                      <source srcSet={image} type="image/avif" />

                      {/* WEBP fallback */}
                      {imageFallback ? (
                        <source srcSet={imageFallback} type="image/webp" />
                      ) : null}

                      {/* Final safety net (keeps layout stable; avoids chip/CTA shift) */}
                      <img
                        src={imageFallback || image}
                        alt={`${group.category} packaging by GreenPax`}
                        width={360}
                        height={260}
                        loading="lazy"
                        decoding="async"
                        className={`${styles.categoryImage} category-image`}
                      />
                    </picture>
                  ) : (
                    <span className="category-placeholder">{group.category}</span>
                  )}
                </div>

                <div className={styles.cardBody}>
                  <h3 className={styles.categoryTitle}>{group.category}</h3>

                  <p className={styles.categorySummary}>
                    Bulk-ready {group.category.toLowerCase()} built to spec.
                  </p>

                  <div className={styles.metaBlock}>
                    {/* LINE 1 - SUBCATEGORY CHIPS */}
                    <div className={styles.subcategoryChips}>
                      {visibleChips.map((label: string) => (
                        <span key={label} className={styles.subcategoryChip}>
                          {label}
                        </span>
                      ))}

                      {remainingCount > 0 && (
                        <span className={styles.subcategoryChip}>
                          + {remainingCount} more
                        </span>
                      )}
                    </div>

                    {/* LINE 2 - VARIANT CHIPS (FIXED ROW) */}
                    <div className={styles.variantRow}>
                      {VARIANT_ORDER.map((k) => {
                        if (!variantFlags[k]) return null;
                        if (k === "plain") {
                          return (
                            <span
                              key="plain"
                              className={`${styles.variantChip} ${styles.variantPlain}`}
                            >
                              Plain
                            </span>
                          );
                        }
                        if (k === "printed") {
                          return (
                            <span
                              key="printed"
                              className={`${styles.variantChip} ${styles.variantPrinted}`}
                            >
                              Printed (1C)
                            </span>
                          );
                        }
                        return (
                          <span
                            key="multicolor"
                            className={`${styles.variantChip} ${styles.variantMulti}`}
                          >
                            Multicolor
                          </span>
                        );
                      })}
                    </div>

                    {/* LINE 3 - MOQ + PRICE (JOINED BLOCK, CENTERED) */}
                    <div className={styles.moqPriceRow}>
                      <div className={styles.moqPrice}>
                        <div className={styles.moq}>
                          MOQ<span className={styles.moqValue}>{minMOQ ? `${minMOQ}+` : ""}</span>
                        </div>

                        <div className={styles.price}>
                          Indicative
                          <span className={styles.priceValue}>
                            {minPrice ? `?${minPrice}+ (bulk)` : `On enquiry`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA - CENTERED WHATSAPP ACTION */}
                  <div className={styles.ctaRow}>
                    <a
                      href={buildHomepageWhatsAppLink(group.category)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.whatsappCta}
                    >
                      <span className={styles.whatsappIcon} aria-hidden="true">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12 2.002c-5.514 0-10 4.486-10 10 0 1.761.465 3.467 1.343 4.977L2 22l5.154-1.327C8.61 21.554 10.29 22 12 22c5.514 0 10-4.486 10-10s-4.486-9.998-10-9.998Zm0 1.8c4.514 0 8.2 3.686 8.2 8.2s-3.686 8.2-8.2 8.2c-1.522 0-3.01-.422-4.302-1.222l-.307-.184-3.055.787.812-2.984-.2-.317C4.483 14.8 4 13.423 4 12.002c0-4.514 3.686-8.2 8-8.2Zm-3.28 3.341c-.182 0-.468.067-.71.348-.243.282-.932.911-.932 2.223 0 1.312.954 2.58 1.086 2.756.133.177 1.82 2.92 4.495 3.977 2.222.877 2.673.703 3.154.664.48-.04 1.554-.636 1.773-1.252.218-.617.218-1.146.154-1.252-.063-.106-.245-.172-.511-.301-.267-.129-1.58-.777-1.825-.866-.244-.089-.422-.133-.6.133-.178.267-.689.866-.844 1.044-.156.177-.311.2-.578.072-.267-.129-1.125-.414-2.142-1.32-.792-.703-1.327-1.57-1.483-1.836-.155-.267-.017-.411.117-.538.12-.116.267-.3.4-.45.133-.15.178-.267.267-.445.089-.178.045-.333-.022-.462-.067-.128-.6-1.455-.822-1.994-.216-.534-.434-.461-.6-.468Z"
                            fill="currentColor"
                          />
                        </svg>
                      </span>

                      Enquire on WhatsApp
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
