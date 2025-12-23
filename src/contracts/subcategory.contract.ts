/**
 * Subcategory Page Contract
 * =========================
 *
 * Authority:
 * - Governs WHAT a subcategory page is allowed to show
 * - Prevents price leakage, cart behavior, and variant exposure
 * - Acts as future test + AI guardrail
 *
 * Status: DESIGN CONTRACT (non-executable)
 */

export const SubcategoryPageContract = {
  pageType: "subcategory",

  /**
   * Identity
   */
  requiredParams: {
    categorySlug: "string",
    subcategorySlug: "string",
  },

  /**
   * Data Sources (READ-ONLY)
   */
  allowedDataSources: [
    "categoryIndex.json",
    "items.json",
  ],

  /**
   * What this page MAY display
   */
  allowedContent: {
    title: true,                // Subcategory name
    description: true,          // SEO-friendly intro
    productGrid: true,          // List of products (cards only)
    productCount: true,         // Optional badge
    breadcrumbs: true,
    seoMeta: true,
  },

  /**
   * Product Card Rules
   * (CRITICAL)
   */
  productCard: {
    allowedFields: [
      "id",
      "name",
      "slug",
      "baseSlug",
      "image",
      "shortDescription",
      "tag",
    ],

    forbiddenFields: [
      "sizes",
      "units",
      "pricing",
      "offeredPrice",
      "sellingPrice",
      "moq",
      "contains",
      "variant",
      "material",
      "taxonomy",
    ],
  },

  /**
   * Explicitly Forbidden Behaviors
   */
  forbiddenBehavior: {
    pricing: true,
    cartActions: true,
    checkoutLinks: true,
    quantitySelectors: true,
    variantSelectors: true,
    sizeSelectors: true,
  },

  /**
   * SEO Requirements
   */
  seo: {
    indexable: true,
    canonicalRequired: true,
    titleTemplate: "{Subcategory} | {Category}",
    descriptionRequired: true,
    noDuplicateH1: true,
  },

  /**
   * Navigation Rules
   */
  navigation: {
    productClickLeadsTo: "product-page",
    backNavigation: "category-page",
  },

  /**
   * Explicit Non-Goals
   */
  nonGoals: [
    "Direct selling",
    "Pricing comparison",
    "Bulk order configuration",
    "Checkout initiation",
  ],
} as const;
