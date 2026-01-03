// FILE: src/components/Home/HomeFeatured.tsx

"use client";

import Image from "next/image";
import { getHomepageWhatsAppLink } from "@/components/Common/WhatsAppCTA";
import items from "@/data/items";
import { selectHomeFeaturedItems } from "@/lib/home/HomeFeatured.selector";
import { validateHomeFeatured } from "@/lib/home/HomeFeatured.validator";
// import { Container, Box, Stack, Typography, Button } from "@mui/material";
import { useState } from "react";
import { buildProductSubtitle } from "@/lib/productSubtitle";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

/**
 * HomeFeatured
 *
 * Role:
 * - Validate buyer intent by showing commonly requested packaging
 * - NOT a catalog
 * - NOT ecommerce
 * - WhatsApp enquiry only
 */

const FALLBACK_FEATURED_IMAGE = "/images/home/hero/printed-multi-color.svg";

export default function HomeFeatured() {
  const featuredItems = selectHomeFeaturedItems(items);

  if (process.env.NODE_ENV !== "production") {
    validateHomeFeatured(items);
  }

  return (
    <section id="featured">
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 9 } }}>
        <Stack spacing={2} mb={{ xs: 4, md: 6 }}>
          <Typography
            variant="overline"
            sx={{ letterSpacing: "0.12em", fontWeight: 600 }}
          >
            Buyer demand signals
          </Typography>
          <Typography variant="h2" fontWeight={700}>
            Most Requested Packaging
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 800 }}>
            These formats validate the most common enquiries we handle for retail, QSR, and FMCG brands across India.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: { xs: 2, md: 3 },
          }}
        >
          {featuredItems.map((item) => (
            <Box key={item.id}>
              <Box
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                  p: { xs: 2.5, md: 3 },
                  borderRadius: { xs: 3, md: 4 },
                  border: "1px solid rgba(15, 23, 42, 0.08)",
                  backgroundColor: "#fff",
                  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: { xs: 160, md: 180 },
                    borderRadius: { xs: 2, md: 3 },
                    border: "1px solid rgba(15, 23, 42, 0.06)",
                    background:
                      "linear-gradient(160deg, rgba(255, 255, 255, 0.95), rgba(237, 242, 247, 0.95))",
                    backgroundColor: "rgba(240, 244, 248, 0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                    padding: { xs: 1.5, md: 2 },
                  }}
                >
                  <FeaturedImage
                    src={item.image}
                    alt={`${item.name} by GreenPax`}
                  />
                </Box>

                <Stack spacing={0.6}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {item.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {buildProductSubtitle(item)}
                  </Typography>
                </Stack>

                <Box mt={3}>
                  <Button
                    variant="outlined"
                    fullWidth
                    component="a"
                    href={getHomepageWhatsAppLink(`Homepage featured: ${item.name}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Enquire about ${item.name}`}
                  >
                      Request specs on WhatsApp
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 3 }}>
          Intent validation only. Share size, GSM, quantity band, and delivery timeline for
          accurate quotes.
        </Typography>
      </Container>
    </section>
  );
}

/* =========================================================
   Safe Image Wrapper (prevents broken UI)
   ========================================================= */

function FeaturedImage({
  src,
  alt,
}: {
  src?: string;
  alt: string;
}) {
  const [error, setError] = useState(false);

  const imageSrc = !src || error ? FALLBACK_FEATURED_IMAGE : src;

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={400}
      height={240}
      sizes="(max-width: 600px) 88vw, (max-width: 900px) 42vw, 320px"
      loading="lazy"
      onError={() => setError(true)}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "contain",
        padding: "8px",
      }}
    />
  );
}
