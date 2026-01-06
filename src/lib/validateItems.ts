// CODEX_PATCH_BEGIN
// FILE: src/scripts/validateItems.ts

import fs from "fs";
import path from "path";
import { ItemsSchema } from "../data/items.schema";

// const ITEMS_PATH = path.resolve("src/data/items.json");
const ITEMS_PATH = path.resolve("src/data/items.v2.json");
const PUBLIC_DIR = path.resolve("public");

type ValidationError = {
  message: string;
};

const errors: ValidationError[] = [];

try {
  const raw = fs.readFileSync(ITEMS_PATH, "utf-8");
  const data = JSON.parse(raw);

  /* =========================================================
     1. SCHEMA VALIDATION (ZOD)
     ========================================================= */

  const result = ItemsSchema.safeParse(data);

  if (!result.success) {
    console.error("❌ items.json schema validation failed\n");

    for (const issue of result.error.issues) {
      console.error(
        `• [${issue.path.join(".") || "root"}] ${issue.message}`
      );
    }

    process.exit(1);
  }

  /* =========================================================
     2. GOVERNANCE VALIDATIONS
     ========================================================= */

  const slugMap = new Map<string, string[]>();

  for (const item of data) {
    /* ---------- Slug uniqueness ---------- */
    if (!slugMap.has(item.slug)) {
      slugMap.set(item.slug, []);
    }
    slugMap.get(item.slug)!.push(item.id);

    /* ---------- Featured ⇒ must have image ---------- */
    if (item.featured === true && !item.image) {
      errors.push({
        message: `Featured item "${item.id}" must have an image`,
      });
    }

    /* =========================================================
       BASE UOM & COMMERCIAL GOVERNANCE (CRITICAL)
       ========================================================= */

    const baseUOMs: ("pcs" | "kg")[] = item.baseUOMs;
    const displayUOM: "pcs" | "kg" | undefined =
      item.categoryDisplayUOM ?? baseUOMs[0];

    if (!Array.isArray(baseUOMs) || baseUOMs.length === 0) {
      errors.push({
        message: `Item "${item.id}" must define baseUOMs (pcs | kg)`,
      });
      continue;
    }

    const allUnits: any[] = [];

    for (const size of item.sizes ?? []) {
      for (const unit of size.units ?? []) {
        // ---------------------------------------------
        // Normalize legacy → canonical (temporary)
        // ---------------------------------------------
        const normalizedUnit = {
          uom: unit.uom ?? unit.unitType,
          quantity: unit.quantity ?? unit.contains ?? 1,
          moq: unit.moq ?? unit.contains ?? 1,
          price: {
            selling:
              unit.price?.selling ??
              unit.sellingPrice ??
              0,
            offered:
              unit.price?.offered ??
              unit.offeredPrice,
          },
        };

        allUnits.push(normalizedUnit);

        if (!normalizedUnit.uom) {
          errors.push({
            message: `Item "${item.id}" has unit missing uom`,
          });
        }

        if (
          typeof normalizedUnit.moq !== "number" ||
          normalizedUnit.moq <= 0
        ) {
          errors.push({
            message: `Item "${item.id}" has invalid MOQ (uom=${normalizedUnit.uom})`,
          });
        }

        if (
          typeof normalizedUnit.price?.selling !== "number" ||
          normalizedUnit.price.selling < 0
        ) {
          errors.push({
            message: `Item "${item.id}" has invalid selling price (must be >= 0) (uom=${normalizedUnit.uom})`,
          });
        }

        if (
          normalizedUnit.price?.offered !== undefined &&
          normalizedUnit.price.offered < 0
        ) {
          errors.push({
            message: `Item "${item.id}" has invalid offered price (must be >= 0) (uom=${normalizedUnit.uom})`,
          });
        }
      }
    }

    for (const uom of baseUOMs) {
      const found = allUnits.some((u) => u.uom === uom);
      if (!found) {
        errors.push({
          message: `Item "${item.id}" declares baseUOM "${uom}" but no matching units found`,
        });
      }
    }

    if (displayUOM) {
      if (!baseUOMs.includes(displayUOM)) {
        errors.push({
          message: `Item "${item.id}" categoryDisplayUOM "${displayUOM}" must be one of baseUOMs`,
        });
      }

      const found = allUnits.some((u) => u.uom === displayUOM);
      if (!found) {
        errors.push({
          message: `Item "${item.id}" categoryDisplayUOM "${displayUOM}" has no matching units`,
        });
      }
    }

    // =========================================================
    // CATEGORY PRICE GOVERNANCE (CRITICAL)
    // =========================================================

    // displayUOM already declared above — reuse

    if (displayUOM) {
      const hasValidCategoryPrice = allUnits.some(
        (u) =>
          u.uom === displayUOM &&
          typeof u.price?.selling === "number" &&
          u.price.selling > 0
      );

      if (!hasValidCategoryPrice) {
        console.info(
          `ℹ️  Item "${item.id}" has no priced unit for categoryDisplayUOM "${displayUOM}" → enquiry-only`
        );
      }
    }

    /* ---------- Image existence (build-time) ---------- */
    const imageCandidates = [item.image, item.imageFallback].filter(Boolean) as string[];

    const isStrictImageRequired =
      item.kind === "category-anchor" ||
      (item.featured === true && item.pricingMode === "fixed");

    if (imageCandidates.length > 0) {
      const exists = imageCandidates.some((p) =>
        fs.existsSync(path.join(PUBLIC_DIR, p))
      );

      if (!exists && isStrictImageRequired) {
        errors.push({
          message: `Image required but not found for item "${item.id}" (featured / category-anchor)`,
        });
      }

      if (!exists && !isStrictImageRequired) {
        console.info(
          `ℹ️  Image missing for enquiry-only item "${item.id}" → allowed (temporary)`
        );
      }
    }
  }

  /* ---------- Duplicate slug detection ---------- */
  for (const [slug, ids] of slugMap.entries()) {
    if (ids.length > 1) {
      errors.push({
        message: `Duplicate slug "${slug}" found in items:\n  • ${ids.join(
          "\n  • "
        )}`,
      });
    }
  }

  /* =========================================================
     3. FAIL FAST IF GOVERNANCE ERRORS
     ========================================================= */

  if (errors.length > 0) {
    console.error("❌ items.json governance validation failed\n");

    for (const err of errors) {
      console.error(`• ${err.message}`);
    }

    process.exit(1);
  }

  /* =========================================================
     4. SUMMARY REPORT (POST-VALIDATION)
     ========================================================= */

  const summary = {
    totalItems: data.length,
    productTypes: {} as Record<string, number>,
    variantTypes: {} as Record<string, number>,
    categories: new Set<string>(),
    subcategories: new Set<string>(),
    featuredCount: 0,
    itemsWithImages: 0,
  };

  for (const item of data) {
    summary.productTypes[item.productType] =
      (summary.productTypes[item.productType] ?? 0) + 1;

    summary.variantTypes[item.variant.type] =
      (summary.variantTypes[item.variant.type] ?? 0) + 1;

    summary.categories.add(item.categorySlug);
    summary.subcategories.add(item.subcategorySlug);

    if (item.featured === true) summary.featuredCount += 1;
    if (item.image) summary.itemsWithImages += 1;
  }

  /* =========================================================
     5. REPORT OUTPUT
     ========================================================= */

  console.log("✅ items.json validation successful\n");

  console.log("📊 Validation Summary");
  console.log("────────────────────");
  console.log(`Total items        : ${summary.totalItems}`);
  console.log(`Featured items     : ${summary.featuredCount}`);
  console.log(
    `Image coverage     : ${summary.itemsWithImages}/${summary.totalItems}`
  );
  console.log(`Categories         : ${summary.categories.size}`);
  console.log(`Subcategories      : ${summary.subcategories.size}`);

  console.log("\nProduct Types:");
  for (const [type, count] of Object.entries(summary.productTypes)) {
    console.log(`  • ${type}: ${count}`);
  }

  console.log("\nVariant Types:");
  for (const [type, count] of Object.entries(summary.variantTypes)) {
    console.log(`  • ${type}: ${count}`);
  }

  console.log("\n────────────────────\n");
} catch (err) {
  console.error("❌ Failed to validate items.json");
  console.error(err);
  process.exit(1);
}

// CODEX_PATCH_END
