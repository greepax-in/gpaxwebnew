import { z } from "zod";

/* =======================
   UNIT / SIZE SCHEMAS
   ======================= */

export const UnitSchema = z.object({
  unitType: z.string().min(1),
  offeredPrice: z.number().min(0),
  sellingPrice: z.number().min(0),
  moq: z.number().positive(),
  contains: z.number().positive(),
  containsLabel: z.string().min(1),
}).refine(
  (u) => u.sellingPrice >= u.offeredPrice,
  {
    message: "sellingPrice must be >= offeredPrice",
    path: ["sellingPrice"],
  }
);

export const SizeSchema = z.object({
  sizeIn: z.string().min(1),
  sizeCm: z.string().optional(),
  units: z.array(UnitSchema).min(1),
});

/* =======================
   ITEM SCHEMA
   ======================= */

export const ItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),

  productType: z.enum(["bag", "cover", "box"]),

  category: z.string().min(1),
  categorySlug: z.string().min(1),

  subcategory: z.string().min(1),
  subcategorySlug: z.string().min(1),

  baseSlug: z.string().min(1),
  slug: z.string().min(1),
  pageLink: z.string().regex(/^\/[a-z0-9\-\/]+$/),

  variant: z.object({
    type: z.enum(["plain", "printed", "multicolor"]),
    printColors: z.number().int().positive().optional(),
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
});

/* =======================
   COLLECTION SCHEMA
   ======================= */

export const ItemsSchema = z.array(ItemSchema);
