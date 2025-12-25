// CODEX_PATCH_BEGIN
// FILE: src/scripts/migrateAddPriceType.ts

import fs from "fs";
import path from "path";

const INPUT_PATH = path.resolve("src/data/items.v2.json");
const OUTPUT_PATH = path.resolve("src/data/items.v2.json"); // in-place upgrade

const raw = fs.readFileSync(INPUT_PATH, "utf-8");
const items = JSON.parse(raw);

const migrated = items.map((item: any) => {
  const sizes = item.sizes.map((size: any) => ({
    ...size,
    units: size.units.map((unit: any) => {
      if (unit.price?.selling && !unit.price.priceType) {
        return {
          ...unit,
          price: {
            ...unit.price,
            priceType: "order", // ✅ explicit
          },
        };
      }
      return unit;
    }),
  }));

  return {
    ...item,
    sizes,
  };
});

fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify(migrated, null, 2),
  "utf-8"
);

console.log("✅ Migration complete: priceType='order' applied where missing");

// CODEX_PATCH_END
