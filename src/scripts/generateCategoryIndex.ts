import items from "../data/items.json";
import fs from "fs";

type Index = {
  [categorySlug: string]: {
    category: string;
    subcategories: {
      [subcategorySlug: string]: {
        subcategory: string;
        productIds: string[];
      };
    };
  };
};

const index: Index = {};

for (const item of items as any[]) {
  const {
    category,
    categorySlug,
    subcategory,
    subcategorySlug,
    id
  } = item;

  if (!index[categorySlug]) {
    index[categorySlug] = {
      category,
      subcategories: {}
    };
  }

  if (!index[categorySlug].subcategories[subcategorySlug]) {
    index[categorySlug].subcategories[subcategorySlug] = {
      subcategory,
      productIds: []
    };
  }

  index[categorySlug].subcategories[subcategorySlug].productIds.push(id);
}

fs.writeFileSync(
  "src/data/categoryIndex.json",
  JSON.stringify(index, null, 2),
  "utf-8"
);

console.log("Category index generated.");
