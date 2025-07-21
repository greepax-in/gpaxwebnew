'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import FeaturedProductCard from '@components/Home/FeaturedProducts/FeaturedProductCard';
import featuredProducts from '../../../data/products.json';

const filteredProducts = featuredProducts.filter(
  (product) => product.featuredProduct === 'yes'
);

export default function FeaturedProducts() {
  return (
    <Box
      sx={{
        width: '100%',
        // minHeight: { xs: '20vh', md: '70vh' },
        // height: 'auto',
        background: '#fef6e4',
        px: { xs: 2, sm: 3 },
        mx: 'auto',
        py: { xs: 4, sm: 6 },
      }}
    >
      {/* Heading */}
      <Box
        sx={{
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
            fontSize: { xs: '1rem', sm: '4rem' },
            textAlign: { xs: 'left', sm: 'center' },
            color: '#000',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
            backgroundColor: 'transparent',
            textRendering: 'optimizeLegibility',
          }}
        >
          Popular Products
        </Typography>
      </Box>

      {/* Product Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(2, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(auto-fit, minmax(280px, 1fr))',
          },
          gap: 2,
          px: { xs: 2, sm: 3 },
          pb: { xs: 0, sm: 2, md: 4 },
          pt: 0,
          backgroundColor: 'transparent',
          boxSizing: 'border-box',
          maxWidth: '1440px',
          margin: '0 auto',
        }}
      >
        {filteredProducts.map((product) => (
          <Box key={product.name} sx={{ width: '100%', maxWidth: 320, mx: 'auto' }}>
            <FeaturedProductCard
              name={product.name}
              image={product.image}
              desc={product.description}
              offeredPrice={
                product.offeredPrice !== null ? product.offeredPrice : undefined
              }
              sellingPrice={
                product.sellingPrice !== null ? product.sellingPrice : undefined
              }
              link={product.pageLink}
              variants={product.variants}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
