/**
 * Product Page Contract
 * =====================
 *
 * Authority:
 * - Single product identity page
 * - Controls exposure of sizes, variants, pricing intent
 * - Prevents premature ecommerce behavior
 *
 * Status: DESIGN CONTRACT (non-executable)
 */

export const ProductPageContract = {
  pageType: "product",

  /**
   * Identity & Routing
   */
  requiredParams: {
    categorySlug: "string",
    subcategorySlug: "string",
    productSlug: "string",
  },

  /**
   * Source of Truth
   */
  allowedDataSources: [
    "items.json",
  ],

  /**
   * Core Page Content
   */
  allowedContent: {
    hero: true,                 // Product name + positioning
    imageGallery: true,         // Visual understanding
    description: true,          // Long-form copy
    highlights: true,           // Feature bullets
    materialInfo: true,         // Paper type, GSM, food safety
    useCases: true,             // Contextual reassurance
    assuranceBadges: true,      // Eco, quality, delivery
    faq: true,                  // Pre-sales objections
    breadcrumbs: true,
    seoMeta: true,
  },

  /**
   * Variant Handling
   * ----------------
   * Variants are DISCLOSURE, not selection
   */
  variants: {
    allowed: true,

    allowedFields: [
      "type",           // plain | printed | multicolor
      "printColors",    // informational only
    ],

    forbiddenBehavior: [
      "variantSwitching",
      "variantComparison",
      "variantPricing",
    ],
  },

  /**
   * Sizes & Units
   * -------------
   * Sizes may be SHOWN, not configured
   */
  sizes: {
    allowed: true,

    allowedFields: [
      "sizeIn",
      "sizeCm",
    ],

    forbiddenFields: [
      "units",
      "pricing",
      "offeredPrice",
      "sellingPrice",
      "moq",
      "contains",
    ],
  },

  /**
   * Pricing Rules (CRITICAL)
   */
  pricing: {
    display: "intent-only",

    allowedContent: [
      "priceRangeHint",     // e.g. “Bulk pricing available”
      "ctaRequestQuote",
    ],

    forbiddenContent: [
      "exactPrices",
      "perUnitPrices",
      "discounts",
      "cartTotals",
      "dynamicPricing",
    ],
  },

  /**
   * CTA Rules
   */
  callToAction: {
    primary: "Request Quote",
    secondary: "Contact Sales",

    forbiddenActions: [
      "Add to Cart",
      "Buy Now",
      "Checkout",
      "Quantity Increment",
    ],
  },

  /**
   * SEO Requirements
   */
  seo: {
    indexable: true,
    canonicalRequired: true,
    uniqueH1: true,
    structuredData: {
      type: "Product",
      pricing: "OfferIntentOnly",
    },
  },

  /**
   * Navigation Rules
   */
  navigation: {
    backTo: "subcategory-page",
    relatedProducts: "same-subcategory",
  },

  /**
   * Explicit Non-Goals
   */
  nonGoals: [
    "Direct ecommerce",
    "Price competition",
    "Dynamic discounting",
    "Self-serve checkout",
  ],
} as const;
