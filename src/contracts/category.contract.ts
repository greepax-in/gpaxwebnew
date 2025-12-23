// src/contracts/pages/category.contract.ts

export const CategoryPageContract = {
  pageType: "category",

  routePattern: "/[categorySlug]",

  dataSources: ["categoryIndex.json", "items.json"],

  allowedFields: [
    "category",
    "categorySlug",
    "subcategory",
    "subcategorySlug",
    "productIds.length"
  ],

  forbiddenFields: [
    "sizes",
    "prices",
    "units",
    "moq"
  ],

  seo: {
    required: ["title", "description", "canonical"],
    schema: ["CollectionPage"]
  },

  ctaPolicy: {
    allowed: ["whatsapp", "subcategory-navigation"],
    forbidden: ["cart", "checkout", "pricing"]
  }
} as const;
