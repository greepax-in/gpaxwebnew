'use client';

import React from 'react';
import { Box, Typography, Grid, Divider, useMediaQuery } from '@mui/material';
import { ProductType } from '../../types/products';

type Props = {
  product: ProductType;
};

const ProductAssurance = ({ product }: Props) => {
  const list = product.assurance;
  const hasAssurance = list && list.length > 0;
  const isMobile = useMediaQuery('(max-width:600px)');

  if (!hasAssurance) return null;

  return (
    <Box mt={8} component="section" id="assurance" px={isMobile ? 2 : 0}>
      <Typography variant="h6" gutterBottom display="flex" alignItems="center">
        <Box component="span" mr={1}>🛡️</Box>
        Customer Assurance
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {list.map((item, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 6 }}>
            <Box>
              <Typography variant="subtitle2" gutterBottom display="flex" alignItems="center">
                <Box component="span" mr={1}>{item.icon}</Box>
                {item.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {item.desc}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProductAssurance;
