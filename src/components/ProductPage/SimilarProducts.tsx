'use client';

import React from 'react';
import { Box, Typography, Grid, Divider, useMediaQuery } from '@mui/material';
import SimilarProductCard from '@/components/Home/Products/SimilarProductCard';
import { ItemType } from '@/types/itemTypes';
import products from '@/data/items.json'; // ✅ Use directly

type Props = {
  currentProduct: ItemType;
};

const SimilarProducts = ({ currentProduct }: Props) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  // Show only items from the same category and not the current product
  const filtered = products.filter(
    (item) =>
      item.categorySlug === currentProduct.categorySlug &&
      item.subcategorySlug === currentProduct.subcategorySlug &&
      item.slug !== currentProduct.slug
  );

  if (filtered.length === 0) return null;

  return (
    <Box mt={2} component="section" id="similar-products" px={isMobile ? 2 : 0}>
      <Typography variant="h6" gutterBottom display="flex" alignItems="center">
        <Box component="span" mr={1}>🛍️</Box>
        Similar Products
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {filtered.map((product) => (
          <Grid key={product.slug} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <SimilarProductCard
              name={product.name}
              image={product.featuredImage}
              offeredPrice={product.offeredPrice}
              sellingPrice={product.sellingPrice}
              link={product.pageLink}
              printVariants={product.printVariants}
              paperVariants={product.paperVariant}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SimilarProducts;
