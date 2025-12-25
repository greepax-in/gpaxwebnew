

import fs from "fs";
import path from "path";

const ITEMS_PATH = path.resolve("src/data/items.json");

const raw = fs.readFileSync(ITEMS_PATH, "utf-8");
const items = JSON.parse(raw);

let patchedCount = 0;

for (const item of items) {
  for (const size of item.sizes ?? []) {
    for (const unit of size.units ?? []) {
      if (
        unit.price &&
        typeof unit.price.selling === "number" &&
        unit.price.selling === 0
      ) {
        unit.price.selling = 1;
        unit.price.offered = 1;
        patchedCount++;
      }
    }
  }
}

fs.writeFileSync(
  ITEMS_PATH,
  JSON.stringify(items, null, 2),
  "utf-8"
);

console.log(
  `✅ Dummy pricing applied to ${patchedCount} units (selling=1, offered=1)`
);
