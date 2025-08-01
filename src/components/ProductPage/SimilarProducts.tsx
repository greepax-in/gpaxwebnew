'use client';

import React from 'react';
import { Box, Typography, Grid, Divider, useMediaQuery } from '@mui/material';
import ProductCard from '@/components/Home/Products/SimilarProductCard';
import { ProductType } from '@/types/itemTypes';

type Props = {
  currentProduct: ProductType;
  allProducts: ProductType[];
};

const SimilarProducts = ({ currentProduct, allProducts }: Props) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  // Filter only from same subcategory excluding self
  const filtered = allProducts.filter(
    (item) =>
      item.subcategorySlug === currentProduct.subcategorySlug &&
      item.slug !== currentProduct.slug
  );

  if (filtered.length === 0) return null;

  return (
    <Box mt={8} component="section" id="similar-products" px={isMobile ? 2 : 0}>
      <Typography variant="h6" gutterBottom display="flex" alignItems="center">
        <Box component="span" mr={1}>🛍️</Box>
        Similar Products
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {filtered.map((product) => (
          <Grid key={product.slug} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <ProductCard
              name={product.name}
              image={product.featuredImage}
              offeredPrice={product.offeredPrice}
              sellingPrice={product.sellingPrice}
              link={product.pageLink}
              printVariants={product.printvariants}   // ✅ Correct mapping
              paperVariants={product.papervariant}     // ✅ Correct mapping
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SimilarProducts;
