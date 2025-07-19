'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import FeaturedProductCard from '@components/Home/FeaturedProducts/FeaturedProductCard';
import products from './FeaturedProducts.json';

export default function FeaturedProducts() {
  // const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box
      sx={{
        width: '100vw',
        minHeight: { xs: '20vh', md: '70vh' }, // 🔧 Fix: allow space for cards
        height: 'auto',
        background: '#f5f5f7',
        py: { xs: 4, sm: 6 },
      }}
    >
      {/* Heading */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          maxWidth: 1500,
          margin: '0 auto',
          mt: { xs: -4, sm: 2 },
          mb: { xs: 0, sm: 2 },
        }}
      >
        <Typography
          align="left"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1rem', sm: '1.6rem' },
            color: '#000',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            backgroundColor: 'transparent',
            textRendering: 'optimizeLegibility',
          }}
        >
          Featured Products
        </Typography>
      </Box>

      {/* Product Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 2,
          px: { xs: 2, sm: 3 },
          pb: { xs: 0, sm: 2, md: 4 }, // reduce bottom padding for mobile
          pt: 0,
          backgroundColor: 'transparent',
          boxSizing: 'border-box',
          maxWidth: 1500,
          margin: '0 auto',
          overflow: 'visible',
        }}
      >
        {products.map((product) => (
          <Box key={product.name} sx={{ width: '100%' }}>
            <FeaturedProductCard
              name={product.name}
              image={product.image}
              // waText={product.waText}
              price={product.price}
              link={product.pageLink}
              variants={product.variants}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
