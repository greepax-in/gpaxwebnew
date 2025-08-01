'use client';

import React from 'react';
import { Box, Typography, Divider, Chip, useMediaQuery } from '@mui/material';
import { ProductType } from '@/types/products';

interface Props {
  product: ProductType;
}

export default function IndustriesServed({ product }: Props) {
  const isMobile = useMediaQuery('(max-width:600px)');

  if (!product.industry) return null;

  const industries = product.industry
    .split(',')
    .map((i) => i.trim())
    .filter((i) => i.length > 0);

  if (industries.length === 0) return null;

  return (
    <Box component="section" id="industries-served" mt={8} px={isMobile ? 2 : 0}>
      <Typography
        variant="h6"
        gutterBottom
        display="flex"
        alignItems="center"
      >
        <Box component="span" mr={1}>🏭</Box>
        Industries Served
      </Typography>

      <Divider sx={{ mb: 2 }} />

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {industries.map((industry, index) => (
          <Chip
            key={index}
            label={industry}
            variant="outlined"
            color="primary"
            sx={{ fontWeight: 500, fontSize: '0.85rem' }}
          />
        ))}
      </Box>
    </Box>
  );
}
