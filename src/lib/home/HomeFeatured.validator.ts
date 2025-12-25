import type { Item } from "./HomeFeatured.selector";

export function validateHomeFeatured(items: Item[]) {
  const featured = items.filter(i => i.featured === true);

  if (featured.length === 0) {
    throw new Error(
      "HomeFeatured: No items marked as featured=true"
    );
  }

  if (featured.length < 3) {
    throw new Error(
      `HomeFeatured: Minimum 3 featured items required (found ${featured.length})`
    );
  }

  if (featured.length > 6) {
    throw new Error(
      `HomeFeatured: Maximum 6 featured items allowed (found ${featured.length})`
    );
  }

  return true;
}
