/**
 * Quote Request Contract
 * ======================
 *
 * Authority:
 * - Captures buyer intent
 * - Bridges product interest → sales workflow
 * - Explicitly non-ecommerce
 *
 * Status: DESIGN CONTRACT (non-executable)
 */

export const QuoteRequestContract = {
  pageType: "quote",

  /**
   * Invocation Rules
   */
  entryPoints: [
    "product-page",
    "category-page",
    "global-cta",
  ],

  /**
   * Context Requirements
   */
  requiredContext: {
    productId: "string",          // from items.json
    categorySlug: "string",
    subcategorySlug: "string",
    productSlug: "string",
  },

  optionalContext: {
    sizeHint: "string",           // informational only
    variantHint: "string",        // plain | printed | multicolor
    quantityHint: "number",
  },

  /**
   * Allowed Data Sources
   */
  allowedDataSources: [
    "items.json",
    "categoryIndex.json",
  ],

  /**
   * Buyer Information
   */
  buyer: {
    required: [
      "name",
      "company",
      "phone",
    ],

    optional: [
      "email",
      "city",
      "state",
    ],

    validationRules: {
      phone: "india-mobile-or-landline",
      email: "optional-but-validated",
    },
  },

  /**
   * Quote Details
   */
  quoteIntent: {
    allowedFields: [
      "estimatedQuantity",
      "deliveryCity",
      "printingRequired",
      "brandingNotes",
    ],

    forbiddenFields: [
      "priceExpectation",
      "discountDemand",
      "competitorComparison",
    ],
  },

  /**
   * Pricing Semantics (IMPORTANT)
   */
  pricing: {
    allowed: [
      "intent-only",
    ],

    forbidden: [
      "priceSubmission",
      "budgetEntry",
      "autoQuote",
      "priceCalculation",
    ],
  },

  /**
   * File Attachments
   */
  attachments: {
    allowed: true,
    allowedTypes: [
      "pdf",
      "png",
      "jpg",
      "svg",
    ],
    maxFiles: 3,
    maxSizeMB: 5,
    purpose: "branding-artwork",
  },

  /**
   * CTA Semantics
   */
  callToAction: {
    primary: "Submit Quote Request",
    secondary: "Talk to Sales",

    forbiddenActions: [
      "Proceed to Checkout",
      "Instant Price",
      "Add to Cart",
    ],
  },

  /**
   * Post-Submission Behavior
   */
  submissionOutcome: {
    userFeedback: [
      "Thank you confirmation",
      "Sales will contact you within X hours",
    ],

    forbiddenUserFeedback: [
      "Estimated price",
      "Automated quotation",
    ],
  },

  /**
   * Sales & Ops Handoff
   */
  internalHandoff: {
    notify: [
      "sales-team",
    ],

    requiredPayload: [
      "productId",
      "buyerInfo",
      "quoteIntent",
      "timestamp",
    ],
  },

  /**
   * SEO & Indexing
   */
  seo: {
    indexable: false,
    reason: "transactional-intent",
  },

  /**
   * Explicit Non-Goals
   */
  nonGoals: [
    "Instant quotation",
    "Self-serve pricing",
    "Checkout flow",
    "Payment processing",
  ],
} as const;
