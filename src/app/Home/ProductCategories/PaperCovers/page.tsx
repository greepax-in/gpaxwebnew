'use client';

import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
// import ProductCard from "@components/Home/ProductCategories/ProductCard";
import FeaturedProductCard from '@components/Home/FeaturedProducts/FeaturedProductCard';
import products from "../../../../data/products.json"; // Adjust the path as necessary

const paperBagProducts = products.filter(product => product.category === 'Paper Covers');

export default function PaperBagsPage() {
  const isMobile = useMediaQuery('(max-width:899.95px)');

  return (
    <Box sx={{ width: '100%', backgroundColor: '#f3fbe9 ', py: { xs: 4, sm: 6 }, px: { xs: 2, sm: 3 } }}>
      
      {/* Section Title */}
      <Box
        sx={{
          maxWidth: 1440,
          mx: 'auto',
          mb: 3,
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: isMobile ? 'clamp(1.4rem, 6vw, 2rem)' : '2.5rem',
            color: '#1a237e',
            textAlign: isMobile ? 'left' : 'center',
          }}
        >
          Paper Covers
        </Typography>
      </Box>

      {/* Product Grid */}
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: {
      xs: 'repeat(2, 1fr)',
      sm: 'repeat(3, 1fr)',
      md: 'repeat(3, 1fr)',
      lg: 'repeat(4, 1fr)',
    },
    gap: 2,
    width: '100%',
    maxWidth: 1440,
    mx: 'auto',
    px: { xs: 1, sm: 2, md: 3 },
  }}
>
  {paperBagProducts.map((product) => (
    <Box key={product.name}>
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
