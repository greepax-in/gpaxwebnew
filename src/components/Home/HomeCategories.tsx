// FILE: src/components/Home/HomeCategories.tsx

import Image from "next/image";
import items from "@/data/items.json";
import rawCategoryIndex from "@/data/categoryIndex.json";
import { getHomepageWhatsAppLink } from "@/components/Common/WhatsAppCTA";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Chip from "@mui/material/Chip";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";


/* =========================================================
   CATEGORY INDEX TYPES (runtime-safe boundary)
   ========================================================= */

type CategoryIndex = {
  [categorySlug: string]: {
    category: string;
    subcategories: {
      [subcategorySlug: string]: {
        subcategory: string;
        productIds: string[];
        chips: {
          line1: string;
          line2: string[];
          line3: {
            moq: string;
            price: string;
            uom: "pcs" | "kg";
            secondaryUOMs?: ("pcs" | "kg")[];
          };
        };
      };
    };
  };
};

// Explicit boundary cast: JSON -> index map
const categoryIndex = rawCategoryIndex as CategoryIndex;

const CATEGORY_ORDER = ["Paper Bags", "Paper Covers", "Paper Boxes"];

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const categories = Object.values(
  (items as any[]).reduce((acc: Record<string, any>, item: any) => {
    const category = typeof item.category === "string" ? item.category : "Packaging";
    const slug = item.categorySlug || toSlug(category);

    if (!acc[slug]) {
      acc[slug] = { category, slug, items: [] as any[] };
    }

    acc[slug].items.push(item);
    return acc;
  }, {} as Record<string, any>)
)
  .map((group: any) => {
    const featured = group.items.find((entry: any) => entry.featured === true) ?? group.items[0];

    return {
      category: group.category,
      slug: group.slug,
      featured,
    };
  })
  .sort((a: any, b: any) => {
    const aIndex = CATEGORY_ORDER.indexOf(a.category);
    const bIndex = CATEGORY_ORDER.indexOf(b.category);
    return (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
  });

export default function HomeCategories() {
  return (
    <section className="section section-categories" id="categories">
      <div className="container">
        <div className="section-header fade-up">
          <p className="section-kicker">Capabilities</p>
          <h2>Packaging categories we manufacture</h2>
          <p className="section-lede">
            Pick your format, then share size, print specs, and delivery timeline.
          </p>
          <p className="section-note">
            Indicative pricing shown for reference. Final specifications, pricing,
            and delivery timelines are confirmed on enquiry.
          </p>
        </div>

        <div className="category-grid">
          {categories.map((group: any) => {
            const categorySlug = group.slug || toSlug(group.category);
            const categoryData =
              categoryIndex[categorySlug]?.subcategories ?? {};

            const featured = group.featured;
            const image = featured?.image;

            // derive subcategory-level signals before returning JSX
            const subcats = Object.values(categoryData);

            // LINE 1 - subcategory chips
            const subcategoryLabels = subcats.map((d: any) => d.chips.line1);
            const MAX_VISIBLE_CHIPS = 6;
            const visibleChips = subcategoryLabels.slice(0, MAX_VISIBLE_CHIPS);
            const remainingCount = subcategoryLabels.length - visibleChips.length;

            // LINE 2 - variants (union)
            const variantSet = new Set<string>();
            subcats.forEach((d: any) => d.chips.line2.forEach((v: string) => variantSet.add(v)));

            // LINE 3 - MOQ + price (min)
            const moqs = subcats
              .map((d: any) => parseInt(d.chips.line3.moq, 10))
              .filter((n: number) => !isNaN(n));

            const prices = subcats
              .map((d: any) =>
                d.chips.line3.price
                  ? parseFloat(d.chips.line3.price.replace(/[^\d.]/g, ""))
                  : null
              )
              .filter((n: number | null) => typeof n === "number");

            const minMOQ = moqs.length ? Math.min(...moqs) : null;
            const minPrice = prices.length ? Math.min(...prices) : null;

            const uom =
              subcats.find((d: any) => d.chips.line3.uom === "pcs")?.chips.line3.uom ??
              subcats[0]?.chips.line3.uom;

            return (
              <Card
                key={group.category}
                elevation={0}
                sx={{
                  borderRadius: 1,
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  "@media (hover: hover)": {
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
                    },
                  },
                }}
              >
                <Box sx={{ p: 2, backgroundColor: "#f7f8f2", borderRadius: 1 }}>
                  {image ? (
                    <Image
                      src={image}
                      alt={`${group.category} packaging by GreenPax`}
                      width={320}
                      height={220}
                      sizes="(max-width: 900px) 100vw, 33vw"
                      className="category-image"
                    />
                  ) : (
                    <span className="category-placeholder">{group.category}</span>
                  )}
                </Box>

                <CardContent sx={{ pt: 2.5 }}>
                  <Typography variant="h6" fontWeight={600}>
                    {group.category}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 2 }}
                  >
                    Bulk-ready {group.category.toLowerCase()} built to spec.
                  </Typography>

                  <Box
                    sx={{
                      mb: 2,
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* LINE 1 - SUBCATEGORY CHIPS */}
                    <Stack
                      direction="row"
                      spacing={1}
                      flexWrap="wrap"
                      sx={{
                        mb: 1,
                        minHeight: 56,
                        maxHeight: 56,
                        overflow: "hidden",
                        alignContent: "flex-start",
                        justifyContent: "flex-start",
                      }}
                    >
                      {visibleChips.map((label: string) => (
                        <Chip
                          key={label}
                          label={label}
                          size="small"
                          variant="outlined"
                          sx={{
                            fontWeight: 500,
                            borderRadius: 1.5,
                            height: 26,
                            backgroundColor: "#f7f7f2",
                            borderColor: "#dcded6",
                            color: "#2f3a45",
                          }}
                        />
                      ))}

                      {remainingCount > 0 && (
                        <Chip
                          label={`+ ${remainingCount} more`}
                          size="small"
                          variant="outlined"
                          sx={{
                            height: 26,
                            fontWeight: 500,
                            borderRadius: 1.5,
                            color: "text.secondary",
                          }}
                        />
                      )}
                    </Stack>

                    {/* LINE 2 — VARIANT CHIPS (FIXED ROW) */}
                    <Box sx={{ minHeight: 32, mb: 0.75 }}>
                      <Stack direction="row" spacing={1} flexWrap="nowrap">
                        {[...variantSet].map((variant: string) => {
                          const key = variant.toLowerCase();

                          if (key.includes("plain")) {
                            return (
                              <Chip
                                key={variant}
                                label="Plain"
                                size="small"
                                sx={{
                                  height: 26,
                                  minWidth: 80,
                                  justifyContent: "center",
                                  fontWeight: 600,
                                  fontSize: 12,
                                  letterSpacing: 0.2,
                                  backgroundColor: "#eef2f7",
                                  color: "#334155",
                                  border: "1px solid #cfd6dd",
                                }}
                              />
                            );
                          }

                          if (key.includes("printed")) {
                            return (
                              <Chip
                                key={variant}
                                label="Printed (1C)"
                                size="small"
                                sx={{
                                  height: 26,
                                  minWidth: 110,
                                  justifyContent: "center",
                                  fontWeight: 600,
                                  fontSize: 12,
                                  letterSpacing: 0.2,
                                  color: "#ffffff",
                                  backgroundColor: "#2f7a4f",
                                }}
                              />
                            );
                          }

                          if (key.includes("multi")) {
                            return (
                              <Chip
                                key={variant}
                                label="Multicolor"
                                size="small"
                                sx={{
                                  height: 26,
                                  minWidth: 110,
                                  justifyContent: "center",
                                  fontWeight: 600,
                                  fontSize: 12,
                                  letterSpacing: 0.2,
                                  color: "#ffffff",
                                  background:
                                    "linear-gradient(90deg, #7c6cff, #5cb176, #f3b04a)",
                                }}
                              />
                            );
                          }

                          return null;
                        })}
                      </Stack>
                    </Box>

                    {/* LINE 3 — MOQ + PRICE (JOINED BLOCK, CENTERED) */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        mt: 0.75,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          overflow: "hidden",
                          borderRadius: 1,
                          border: "1px solid #dfe5ec",
                        }}
                      >
                        {/* MOQ BLOCK */}
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            backgroundColor: "#f4f6f9",
                            fontSize: 13,
                            color: "text.secondary",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          MOQ&nbsp;
                          <Box component="span" sx={{ fontWeight: 700, color: "text.primary" }}>
                            {minMOQ ? `${minMOQ}+` : ""}
                          </Box>
                        </Box>

                        {/* PRICE BLOCK — INDICATIVE ONLY (NON-TRANSACTIONAL) */}
                        <Box
                          sx={{
                            px: 1.75,
                            py: 0.5,
                            backgroundColor: "#e8f4ee",
                            fontSize: 13,
                            color: "#1f6f46",
                            fontWeight: 500,
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          Indicative&nbsp;
                          <Box component="span" sx={{ fontWeight: 700 }}>
                            {minPrice ? `₹${minPrice}+ (bulk)` : `On enquiry`}
                          </Box>
                        </Box>
                      </Box>
                    </Box>

                  </Box>

                  {/* CTA — CENTERED WHATSAPP ACTION */}
                  <Box
                    sx={{
                      minHeight: 30,
                      display: "flex",
                      justifyContent: "center",
                      mt: 1
                    }}
                  >
                    <Link
                      href={getHomepageWhatsAppLink(group.category)}
                      target="_blank"
                      underline="none"
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 1.25,
                        px: 2.25,
                        py: 0.75,
                        borderRadius: 999,
                        fontWeight: 500,
                        fontSize: 13,
                        color: "#1f6f46",
                        backgroundColor: "#f1f8f4",
                        transition: "background-color 0.2s ease",
                        "&:hover": {
                          backgroundColor: "#e6f3ec",
                        },
                      }}
                    >
                      {/* LEFT ICON — OFFICIAL WHATSAPP ICON */}
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          backgroundColor: "#25D366",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          ml: -1.5,
                        }}
                      >
                        <WhatsAppIcon sx={{ color: "#fff", fontSize: 24 }} />
                      </Box>

                      Enquire on WhatsApp
                    </Link>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
