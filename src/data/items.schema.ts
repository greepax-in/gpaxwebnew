import { z } from "zod";

export type Item = z.infer<typeof ItemSchema>;
export type Items = z.infer<typeof ItemsSchema>;

export const VARIANT_TYPES = ["plain", "printed", "multicolor"] as const;
export const PRODUCT_TYPES = ["bag", "cover", "box"] as const;
export const ITEM_KINDS = ["product", "category-anchor"] as const;

/* =======================
   UNIT / SIZE SCHEMAS
   ======================= */

export const UnitSchema = z
  .object({
    /* ---------------------------
       Canonical fields (final)
       --------------------------- */
    uom: z.enum(["pcs", "kg"]).optional(),
    quantity: z.number().positive().optional(),
    moq: z.number().positive().optional(),

    price: z
      .object({
        offered: z.number().min(0).optional(),
        selling: z.number().min(0),
      })
      .optional(),

    /* ---------------------------
       Legacy / temporary fields
       --------------------------- */
    unitType: z.enum(["pcs", "kg"]).optional(),
    sellingPrice: z.number().min(0).optional(),
    offeredPrice: z.number().min(0).optional(),
    contains: z.number().positive().optional(),
    containsLabel: z.string().optional(),
  })
  .transform((unit) => {
    const uom = unit.uom ?? unit.unitType;

    return {
      uom,
      quantity: unit.quantity ?? unit.contains ?? 1,
      moq: unit.moq ?? unit.contains ?? 1,
      price: {
        selling:
          unit.price?.selling ??
          unit.sellingPrice ??
          0,
        offered:
          unit.price?.offered ??
          unit.offeredPrice,
      },
    };
  })
  .refine((u) => u.uom === "pcs" || u.uom === "kg", {
    message: "Unit must resolve to valid uom",
  });

export const SizeSchema = z.object({
  sizeIn: z.string().min(1),
  sizeCm: z.string().optional(),
  units: z.array(UnitSchema).min(1),
});

/* =======================
   ITEM SCHEMA
   ======================= */

export const ItemSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),

     /* =======================
       ITEM KIND (PRODUCT / CATEGORY)
       ======================= */

     kind: z.enum(["product", "category-anchor"]),

    productType: z.enum(PRODUCT_TYPES),

    /* ===== Commercial UOM Control ===== */

    baseUOMs: z.array(z.enum(["pcs", "kg"])).min(1),
    categoryDisplayUOM: z.enum(["pcs", "kg"]).optional(),
  
    /* =======================
      PRICING MODE
      ======================= */
  
    pricingMode: z.enum(["fixed", "enquiry"]),

    category: z.string().min(1),
    categorySlug: z.string().min(1),
    subcategory: z.string().min(1),
    subcategorySlug: z.string().min(1),

    image: z.string().min(1),
    imageFallback: z.string().min(1).optional(),

    baseSlug: z.string().min(1),
    slug: z.string().min(1),
    pageLink: z.string().regex(/^\/[a-z0-9\-\/]+$/),

    variant: z.object({
      type: z.enum(VARIANT_TYPES),
      printColors: z
        .number()
        .positive()
        .refine(Number.isInteger, {
          message: "printColors must be an integer",
        })
        .optional(),
    }),

    material: z.object({
      paperType: z.array(z.string().min(1)).min(1),
      gsmRange: z.string().min(1),
      foodSafe: z.boolean(),
    }),

    taxonomy: z.object({
      industries: z.array(z.string().min(1)).min(1),
      useCases: z.array(z.string().min(1)).min(1),
      foodSafe: z.boolean(),
    }),

    sizes: z.array(SizeSchema).min(1),

    featured: z.boolean().optional(),
    tag: z.enum(["New", "Hot", "Popular"]).optional(),
    customerRefs: z.array(z.string()).optional(),
  })
  .strict()
  .superRefine((item, ctx) => {
    const allUnits = item.sizes.flatMap((s) => s.units);

    /* =========================================================
       CATEGORY ANCHOR RULES
       ========================================================= */

    if (item.kind === "category-anchor") {
      if (item.pricingMode !== "enquiry") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `category-anchor items must use pricingMode 'enquiry'`,
          path: ["pricingMode"],
        });
      }

      const hasPricedUnit = allUnits.some(
        (u) => typeof u.price?.selling === "number" && u.price.selling > 0
      );

      if (hasPricedUnit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `category-anchor items must not declare priced units`,
          path: ["sizes"],
        });
      }
    }

    /* ---------- Base UOMs must exist ---------- */
    for (const uom of item.baseUOMs) {
      if (!allUnits.some((u) => u.uom === uom)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `baseUOM "${uom}" declared but no matching units found`,
          path: ["baseUOMs"],
        });
      }
    }

    /* ---------- categoryDisplayUOM must be valid ---------- */
    const displayUOM =
      item.categoryDisplayUOM ?? item.baseUOMs[0];

    if (!item.baseUOMs.includes(displayUOM)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `categoryDisplayUOM must be one of baseUOMs`,
        path: ["categoryDisplayUOM"],
      });
    }

    /* ---------- At least ONE priced unit for display UOM (if required) ---------- */
    const hasPricedUnit = allUnits.some(
      (u) => u.uom === displayUOM && typeof u.price?.selling === "number" && u.price.selling > 0
    );

    /* =========================================================
       PRICING MODE ENFORCEMENT
       ========================================================= */

    if (item.pricingMode === "fixed" && item.kind !== "category-anchor") {
      if (!item.categoryDisplayUOM) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `pricingMode 'fixed' requires categoryDisplayUOM to be declared`,
          path: ["categoryDisplayUOM"],
        });
      } else if (!hasPricedUnit) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `No priced unit found for categoryDisplayUOM "${displayUOM}"`,
          path: ["sizes"],
        });
      }
    }
  });

/* =======================
   COLLECTION SCHEMA
   ======================= */

export const ItemsSchema = z.array(ItemSchema);
