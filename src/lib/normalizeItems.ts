import fs from "fs";
import path from "path";

const ITEMS_PATH = path.resolve("src/data/items.json");

type Item = Record<string, any>;

function normalize(items: Item[]): Item[] {
  const seen = new Map<string, Item>();
  const result: Item[] = [];

  for (const item of items) {
    const base = item.baseSlug;
    const variant = item.variant?.type ?? "plain";

    if (!base || base === "undefined") {
      console.warn(`WARN: Skipping item with invalid baseSlug: ${item.id}`);
      continue;
    }

    const key = `${base}__${variant}`;

    if (seen.has(key)) {
      console.warn(`WARN: Duplicate removed: ${item.id}`);
      continue;
    }

    // Normalize variant rules
    if (item.variant?.type === "plain") {
      delete item.variant.printColors;
    }

    if (item.variant?.type === "multicolor" && !item.variant.printColors) {
      item.variant.printColors = 2;
    }

    seen.set(key, item);
    result.push(item);
  }

  return result;
}

function main() {
  const raw = fs.readFileSync(ITEMS_PATH, "utf-8");
  const items = JSON.parse(raw);

  const normalized = normalize(items);

  fs.writeFileSync(
    ITEMS_PATH,
    JSON.stringify(normalized, null, 2),
    "utf-8"
  );

  console.log(`OK: items.json normalized (${normalized.length} items)`);
}

main();
