import fs from "fs";
import path from "path";
import { ItemsSchema } from "../data/items.schema";

const ITEMS_PATH = path.resolve("src/data/items.json");

try {
  const raw = fs.readFileSync(ITEMS_PATH, "utf-8");
  const data = JSON.parse(raw);

  const result = ItemsSchema.safeParse(data);

  if (!result.success) {
    console.error("❌ items.json validation failed\n");

    for (const issue of result.error.issues) {
      console.error(
        `• [${issue.path.join(".") || "root"}] ${issue.message}`
      );
    }

    process.exit(1);
  }

  console.log("✅ items.json is valid");
} catch (err) {
  console.error("❌ Failed to validate items.json");
  console.error(err);
  process.exit(1);
}
