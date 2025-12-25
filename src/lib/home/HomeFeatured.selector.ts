import type { z } from "zod";
import { ItemsSchema } from "@/data/items.schema";

export type Item = z.infer<typeof ItemsSchema>[number];

/**
 * Select items for HomeFeatured section
 */
export function selectHomeFeaturedItems(
  items: Item[],
  options?: {
    min?: number;
    max?: number;
  }
): Item[] {
  const min = options?.min ?? 3;
  const max = options?.max ?? 6;

  // 1️⃣ Explicit featured items
  let featured = items.filter(item => item.featured === true);

  // 2️⃣ Fallback: auto-pick if insufficient
  if (featured.length < min) {
    const fallback = items
      .filter(item => item.featured !== true)
      .filter(item =>
        ["Paper Bags", "Paper Boxes", "Paper Covers"].includes(item.category)
      );

    featured = [...featured, ...fallback];
  }

  // 3️⃣ Hard cap
  return featured.slice(0, max);
}
