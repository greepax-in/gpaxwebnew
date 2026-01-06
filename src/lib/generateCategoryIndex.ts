// CODEX_PATCH_BEGIN
// FILE: src/scripts/generateCategoryIndex.ts

import items from "../data/items.v2.json";
// import items from "../data/items.json";
import fs from "fs";

type ChipLine3 = {
  moq: string;
  price: string;                 // e.g. "From ₹7000"
  uom: "pcs" | "kg";
  secondaryUOMs?: ("pcs" | "kg")[];
};

type SubcategoryIndex = {
  subcategory: string;
  productIds: string[];
  chips: {
    line1: string;
    line2: string[];
    line3: ChipLine3;
  };
};

type Index = {
  [categorySlug: string]: {
    category: string;
    subcategories: {
      [subcategorySlug: string]: SubcategoryIndex;
    };
  };
};

const index: Index = {};

// Numeric price bands & ranges are forbidden at category level

function capitalize(v: string) {
  return v.charAt(0).toUpperCase() + v.slice(1);
}

// Preferred canonical ordering for variant chips
const VARIANT_ORDER = ["Plain", "Printed", "Multicolor"];

for (const item of items as any[]) {
  // --------------------------------------------------
  // Skip category-anchor items (navigation only)
  // --------------------------------------------------
  if (item.kind === "category-anchor") {
    continue;
  }

  const {
    id,
    category,
    categorySlug,
    subcategory,
    subcategorySlug,
    variant,
    sizes,
  } = item;

  if (!index[categorySlug]) {
    index[categorySlug] = {
      category,
      subcategories: {},
    };
  }

  if (!index[categorySlug].subcategories[subcategorySlug]) {
    index[categorySlug].subcategories[subcategorySlug] = {
      subcategory,
      productIds: [],
      chips: {
        line1: subcategory.replace(/ Paper (Bags|Covers|Boxes)$/i, ""),
        line2: [],
        line3: {
          moq: "",
          price: "",
          uom: "pcs",
        },
      },
    };
  }

  const sub = index[categorySlug].subcategories[subcategorySlug];

  // ---- productIds
  sub.productIds.push(id);

  // ---- variants (line2)
  if (variant?.type) {
    const label = capitalize(variant.type);
    if (!sub.chips.line2.includes(label)) {
      sub.chips.line2.push(label);
    }

    // 🔹 OPTIONAL: enforce canonical variant order
    sub.chips.line2.sort((a, b) => VARIANT_ORDER.indexOf(a) - VARIANT_ORDER.indexOf(b));
  }

  // ---- aggregate MOQ & price using categoryDisplayUOM
  const moqs: number[] = [];
  const prices: number[] = [];
  const uomsSeen = new Set<"pcs" | "kg">();

  const baseUOMs: ("pcs" | "kg")[] = item.baseUOMs ?? [];
  const displayUOM: "pcs" | "kg" =
    item.categoryDisplayUOM ?? baseUOMs[0];

  for (const size of sizes ?? []) {
    for (const unit of size.units ?? []) {
      if (!unit.uom) continue;
      uomsSeen.add(unit.uom);

      if (unit.uom !== displayUOM) continue;

      if (typeof unit.moq === "number" && unit.moq > 0) {
        moqs.push(unit.moq);
      }

      // ✅ CATEGORY PRICE RULE:
      // Use ONLY order-level prices (never per-unit prices)
      if (
        typeof unit.price?.selling === "number" &&
        unit.price.selling > 0 &&
        unit.price.priceType === "order"
      ) {
        prices.push(unit.price.selling);
      }
    }
  }

  if (moqs.length) {
    const minMoq = Math.min(...moqs);
    sub.chips.line3.moq = `${minMoq}+`;
    sub.chips.line3.uom = displayUOM;
  }

  if (prices.length) {
    const minPrice = Math.min(...prices);
    sub.chips.line3.price = `From ₹${minPrice}`;
  }

  // ---- secondary UOM availability (hint only)
  const secondary = Array.from(uomsSeen).filter(
    (u) => u !== displayUOM
  );

  if (secondary.length) {
    sub.chips.line3.secondaryUOMs = secondary;
  }
}

fs.writeFileSync(
  "src/data/categoryIndex.json",
  JSON.stringify(index, null, 2),
  "utf-8"
);

console.log("✅ Category index generated (India price semantics applied)");

// CODEX_PATCH_END
