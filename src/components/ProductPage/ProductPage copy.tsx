'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Divider,
  useMediaQuery,
  Button,
  Grid,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PaperVariantChip from '@/components/Common/VariantChips/PaperVariantChip';
import PrintVariantChip from '@/components/Common/VariantChips/PrintVariantChip';

export type ProductType = {
  name: string;
  slug: string;
  category: string;
  description: string;
  industry: string;
  image: string;
  featuredImage: string;
  productImages: string[];
  pageLink: string;
  printvariants: string[];
  papervariant: string[];
  featuredProduct: string;
  offeredPrice: number;
  sellingPrice: number;
  tagtext: string;
  highlights: string[];
  specifications: Record<string, string>;
  faqs: { q: string; a: string }[];
};

type Props = {
  product: ProductType;
};

const ProductLayout = ({ product }: Props) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ maxWidth: '1280px', mx: 'auto', px: isMobile ? 2 : 4, mt: isMobile ? 7 : 15 }}>
      <Grid container spacing={6} alignItems="flex-start">
        {/* LEFT SIDE */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            <Box
              component="img"
              src={product.featuredImage}
              alt={product.name}
              sx={{ width: '100%', maxHeight: 480, objectFit: 'contain', borderRadius: 2 }}
            />

            {/* Thumbnails */}
            {product.productImages?.length > 0 && (
              <Stack direction="row" spacing={1} mt={2} flexWrap="wrap" justifyContent="flex-start">
                {product.productImages.map((img, idx) => (
                  <Box
                    key={idx}
                    component="img"
                    src={img}
                    alt={`thumb-${idx}`}
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: 1,
                      objectFit: 'cover',
                      border: '1px solid #ddd',
                    }}
                  />
                ))}
              </Stack>
            )}

            {/* Dummy Banner */}
            <Box mt={4}>
              <Typography variant="h6" gutterBottom>
                Product Highlights
              </Typography>
              <Box
                component="img"
                src="/images/dummy-product-detail-banner.png"
                alt="Product Detail Banner"
                sx={{ width: '100%', borderRadius: 2 }}
              />
            </Box>
          </Box>
        </Grid>

        {/* RIGHT SIDE */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Stack spacing={3}>
            {/* Title */}
            <Typography variant="h5" fontWeight="bold">
              {product.name}
            </Typography>

            {/* Pricing */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Typography variant="h5" color="success.main">
                ₹{product.offeredPrice}
              </Typography>
              {product.offeredPrice !== product.sellingPrice && (
                <Typography
                  variant="body1"
                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                >
                  ₹{product.sellingPrice}
                </Typography>
              )}
            </Stack>

            {/* Shipping Info */}
            <Box>
              <Typography variant="body2" color="text.secondary">
                Guaranteed to arrive by <strong>2 Aug</strong> — Free Shipping
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Get ₹50 voucher if your order arrives late.
              </Typography>
            </Box>

            {/* Print Variants */}
            {product.printvariants?.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {product.printvariants.map((variant, i) => (
                  <PrintVariantChip key={i} label={variant.trim()} size="medium" />
                ))}
              </Stack>
            )}

            {/* Paper Variants */}
            {product.papervariant?.length > 0 && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {product.papervariant.map((v) => (
                  <PaperVariantChip key={v} label={v} size="medium" />
                ))}
              </Stack>
            )}

            {/* CTA Buttons */}
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                size="large"
                fullWidth
                sx={{ height: 48 }}
              >
                Add to Cart
              </Button>
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                sx={{ height: 48 }}
                startIcon={<WhatsAppIcon />}
                href={`https://wa.me/91xxxxxxxxxx?text=I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
                target="_blank"
              >
                Buy on WhatsApp
              </Button>
            </Stack>

            {/* Description */}
            <Typography variant="body1">{product.description}</Typography>

            {/* Highlights */}
            {product.highlights?.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Key Features
                </Typography>
                <ul>
                  {product.highlights.map((h, i) => (
                    <li key={i}>
                      <Typography>{h}</Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}

            {/* Specifications */}
            {Object.keys(product.specifications || {}).length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Specifications
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  {Object.entries(product.specifications).map(([k, v]) => (
                    <Typography key={k}>
                      <strong>{k}:</strong> {v}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            )}

            {/* FAQs */}
            {product.faqs?.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  FAQs
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  {product.faqs.map((faq, idx) => (
                    <Box key={idx}>
                      <Typography fontWeight="bold">Q: {faq.q}</Typography>
                      <Typography>A: {faq.a}</Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductLayout;
