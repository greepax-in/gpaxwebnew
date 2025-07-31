// src/components/Product/ProductLayout.tsx
'use client';

import React from 'react';
import { Box, Typography, Chip, Stack, Divider, useMediaQuery, Button } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

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
    <Box sx={{ p: isMobile ? 2 : 4 }}>
      {/* TITLE & TAG */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold">{product.name}</Typography>
        <Chip label={product.tagtext} color="primary" size="small" />
      </Stack>

      {/* PRICING */}
      <Stack direction="row" spacing={2} alignItems="center" mt={2}>
        <Typography variant="h5" color="success.main">₹{product.offeredPrice}</Typography>
        {product.offeredPrice !== product.sellingPrice && (
          <Typography variant="body1" sx={{ textDecoration: 'line-through' }}>
            ₹{product.sellingPrice}
          </Typography>
        )}
      </Stack>

      {/* IMAGE CAROUSEL */}
      <Box mt={3}>
        <Box component="img" src={product.featuredImage} alt={product.name} sx={{ width: '100%', borderRadius: 2 }} />
        {/* Optional: add carousel with thumbnails later */}
      </Box>

      {/* PRINT & PAPER VARIANTS */}
      <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
        {product.printvariants.map((variant) => (
          <Chip key={variant} label={variant} color="default" variant="outlined" />
        ))}
        {product.papervariant.map((paper) => (
          <Chip key={paper} label={paper} color="default" variant="outlined" />
        ))}
      </Stack>

      {/* DESCRIPTION */}
      <Box mt={4}>
        <Typography variant="body1">{product.description}</Typography>
      </Box>

      {/* HIGHLIGHTS */}
      <Box mt={4}>
        <Typography variant="h6">Key Features</Typography>
        <ul>
          {product.highlights.map((h, i) => (
            <li key={i}><Typography>{h}</Typography></li>
          ))}
        </ul>
      </Box>

      {/* SPECIFICATIONS */}
      <Box mt={4}>
        <Typography variant="h6">Specifications</Typography>
        <Divider sx={{ mb: 2 }} />
        <Stack spacing={1}>
          {Object.entries(product.specifications).map(([k, v]) => (
            <Typography key={k}><strong>{k}:</strong> {v}</Typography>
          ))}
        </Stack>
      </Box>

      {/* FAQs */}
      {product.faqs.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6">FAQs</Typography>
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

      {/* CTA */}
      <Box mt={6} textAlign="center">
        <Button
          variant="contained"
          size="large"
          startIcon={<WhatsAppIcon />}
          href={`https://wa.me/91xxxxxxxxxx?text=I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
          target="_blank"
        >
          Chat on WhatsApp
        </Button>
      </Box>
    </Box>
  );
};

export default ProductLayout;