import rawItems from "./items.v2.json";
import { ItemsSchema } from "./items.schema";
import type { Items } from "./items.schema";

const parsed = ItemsSchema.parse(rawItems);

export const items: Items = parsed;
export default items;
