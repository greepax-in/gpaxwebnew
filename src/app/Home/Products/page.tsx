'use client';

import React, { useState } from "react";
import ProductCard from "@components/Home/ProductCategories/ProductCard";
import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useMediaQuery,
} from '@mui/material';
import products from "../../../data/products.json";

type ProductType = {
  name: string;
  image: string;
  offeredPrice?: number;
  sellingPrice?: number;
  printVariants?: string[];
  paperVariants?: string[];
  link?: string;
  desc?: string;
  category: string;
};

export default function ProductGridSection() {
  const [selectedCategory, setSelectedCategory] = useState('Paper Bags');
  const isMobile = useMediaQuery('(max-width:600px)');

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newCategory: string | null
  ) => {
    if (newCategory !== null) {
      setSelectedCategory(newCategory);
    }
  };

  const filtered = products.filter(
    (product: ProductType) => product.category === selectedCategory
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: filtered.length > 2 ? '100vh' : 'auto',
        pt: 2,
        pb: 4,
        px: 1,
        background: '#fffefc',
      }}
    >
      {/* Sticky Toggle Button Group */}
      <Box
        sx={{
          position: 'sticky',
          top: isMobile ? 56 : 72,
          zIndex: 20,
          width: '100%',
          maxWidth: { xs: 420, sm: 600 }, // Increased for desktop
          backgroundColor: '#fffefc',
          px: 1,
          pb: 2,
        }}
      >
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={handleChange}
          fullWidth
          sx={{
            borderRadius: 999,
            backgroundColor: '#f5f5f7',
            p: { xs: '3px', sm: '6px' }, // More padding on desktop
            height: { xs: 'auto', sm: 64 }, // Increased height for desktop
            mx: 'auto',
            boxShadow: 'inset 0 0 4px rgba(0, 0, 0, 0.06)',
            transition: 'all 0.3s ease',
          }}
        >
          {['Paper Bags', 'Paper Covers', 'Paper Boxes'].map((category) => (
            <ToggleButton
              key={category}
              value={category}
              sx={{
                flex: 1,
                borderRadius: 999,
                py: { xs: 1, sm: 1.6 }, // Taller padding on desktop
                px: { xs: 2, sm: 3 },
                fontSize: { xs: '0.78rem', sm: '1rem' },
                fontWeight: 600,
                textTransform: 'none',
                lineHeight: 1.2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                whiteSpace: 'nowrap',
                color: selectedCategory === category ? '#fff' : '#1a1a1a',
                backgroundColor: selectedCategory === category ? '#1976d2' : 'transparent',
                boxShadow: selectedCategory === category
                  ? '0 2px 6px rgba(0,0,0,0.12)'
                  : 'none',
                '&.Mui-selected': {
                  backgroundColor: '#1976d2 !important',
                  color: '#fff !important',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.12) !important',
                },
                '&.Mui-selected:hover': {
                  backgroundColor: '#1565c0 !important',
                },
                '&:hover': {
                  backgroundColor: selectedCategory === category
                    ? '#1565c0'
                    : '#ececec',
                },
              }}
            >
              {category}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {/* Selected Category Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 2,
          mt: 1,
          fontSize: {
            xs: '1.1rem',
            sm: '3rem',
          },
        }}
      >
        {selectedCategory}
      </Typography>

      {/* Centered Grid */}
      {filtered.length === 0 ? (
        <Typography>No products found in {selectedCategory}</Typography>
      ) : (
        <Box
          sx={{
            width: '100%',
            maxWidth: '1300px',
            mx: 'auto',
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 60%))',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)',
            },
            justifyContent: {
              xs: 'center',
              sm: 'normal',
            },
            gap: {
              xs: '-1px 6px',
              sm: '20px',
            },
            px: { xs: 0.5, sm: 2 },
          }}
        >
          {filtered.map((product: ProductType, index: number) => (
            <Box key={index} sx={{ width: '100%' }}>
              <ProductCard
                name={product.name}
                image={product.image}
                desc={product.desc}
                offeredPrice={product.offeredPrice ?? undefined}
                sellingPrice={product.sellingPrice ?? undefined}
                link={product.link}
                printVariants={product.printVariants}
                paperVariants={product.paperVariants}
              />
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
