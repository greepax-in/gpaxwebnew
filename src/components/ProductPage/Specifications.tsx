'use client';

import React from 'react';
import { Box, Typography, Divider, Grid, useMediaQuery } from '@mui/material';
import { ProductType } from '../../types/products';

type Props = {
  product: ProductType;
};

const ProductSpecifications = ({ product }: Props) => {
  const specs = product.specifications;
  const hasSpecs = specs && Object.keys(specs).length > 0;
  const isMobile = useMediaQuery('(max-width:600px)');

  if (!hasSpecs) return null;

  return (
    <Box mt={8} component="section" id="specifications" px={isMobile ? 2 : 0}>
      <Typography variant="h6" gutterBottom display="flex" alignItems="center">
        <Box component="span" mr={1}>📐</Box>
        Specifications
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {Object.entries(specs).map(([label, value], index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 6 }}>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <Typography
                variant="body2"
                fontWeight={600}
                color="text.secondary"
                sx={{ minWidth: 120, display: 'inline-block' }}
              >
                {label}
              </Typography>
              <Typography variant="body2" color="text.primary">
                {value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductSpecifications;
