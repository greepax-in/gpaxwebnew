import fs from "fs";
import path from "path";

const INPUT_PATH = path.resolve("src/data/items.json");
const OUTPUT_PATH = path.resolve("src/data/items.v2.json");

type LegacyUnit = {
  unitType: string;
  offeredPrice?: number;
  sellingPrice?: number;
  moq: number;
  contains: number;
  containsLabel: string;
};

function inferUOM(unit: LegacyUnit): "pcs" | "kg" {
  const label = unit.containsLabel.toLowerCase();

  if (label === "kg" || unit.unitType.toLowerCase().includes("kg")) {
    return "kg";
  }

  return "pcs";
}

const raw = fs.readFileSync(INPUT_PATH, "utf-8");
const items = JSON.parse(raw);

const migrated = items.map((item: any) => {
  const uomsFound = new Set<"pcs" | "kg">();

  const sizes = item.sizes.map((size: any) => {
    const units = size.units.map((unit: LegacyUnit) => {
      const uom = inferUOM(unit);
      uomsFound.add(uom);

      return {
        uom,
        quantity: unit.contains,
        moq: unit.moq,
        price: {
          selling: unit.sellingPrice,
          ...(unit.offeredPrice !== undefined && {
            offered: unit.offeredPrice,
          }),
        },
      };
    });

    return {
      sizeIn: size.sizeIn,
      ...(size.sizeCm && { sizeCm: size.sizeCm }),
      units,
    };
  });

  const baseUOMs = Array.from(uomsFound);
  
  const hasAnyPrice = sizes.some((s: any) =>
    s.units?.some((u: any) => typeof u.price?.selling === "number" && u.price.selling > 0)
  );

  const pricingMode: "fixed" | "enquiry" = hasAnyPrice ? "fixed" : "enquiry";

  return {
    ...item,

    // --- NEW COMMERCIAL FIELDS ---
    baseUOMs,
    categoryDisplayUOM: baseUOMs[0],
    pricingMode,

    // --- NORMALIZED STRUCTURE ---
    sizes,
  };
});

fs.writeFileSync(
  OUTPUT_PATH,
  JSON.stringify(migrated, null, 2),
  "utf-8"
);

console.log(
  `✅ Migration complete → ${path.relative(process.cwd(), OUTPUT_PATH)}`
);
