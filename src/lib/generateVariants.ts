import items from "../data/items.json";
import fs from "fs";

type VariantType = "plain" | "printed" | "multicolor";

const VARIANT_PRIORITY: VariantType[] = ["plain", "printed", "multicolor"];

function buildId(
  productType: string,
  categorySlug: string,
  subcategorySlug: string,
  baseSlug: string,
  variant: VariantType
) {
  return `${productType}-${categorySlug}-${subcategorySlug}-${baseSlug}-${variant}`;
}

function buildSlug(baseSlug: string, variant: VariantType) {
  return `${baseSlug}-${variant}`;
}

function buildPageLink(
  categorySlug: string,
  subcategorySlug: string,
  slug: string
) {
  return `/${categorySlug}/${subcategorySlug}/${slug}`;
}

const grouped = new Map<string, any[]>();

for (const item of items as any[]) {
  const key = item.baseSlug;
  if (!grouped.has(key)) grouped.set(key, []);
  grouped.get(key)!.push(item);
}

const generated: any[] = [];

for (const [, group] of grouped) {
  const existing = new Set(group.map(i => i.variant.type));

  for (const variant of VARIANT_PRIORITY) {
    if (!existing.has(variant)) {
      const source = group[0];

      const newItem = {
        ...source,
        variant: {
          type: variant,
          ...(variant === "printed" || variant === "multicolor"
            ? { printColors: variant === "multicolor" ? 2 : 1 }
            : {})
        },
        id: buildId(
          source.productType,
          source.categorySlug,
          source.subcategorySlug,
          source.baseSlug,
          variant
        ),
        slug: buildSlug(source.baseSlug, variant),
        pageLink: buildPageLink(
          source.categorySlug,
          source.subcategorySlug,
          buildSlug(source.baseSlug, variant)
        ),
        featured: false
      };

      generated.push(newItem);
    }
  }
}

const output = [...items, ...generated];

fs.writeFileSync(
  "src/data/items.generated.json",
  JSON.stringify(output, null, 2),
  "utf-8"
);

console.log(`Generated ${generated.length} missing variants.`);
