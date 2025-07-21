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
import { motion } from 'framer-motion';
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
  description?: string;
  printvariants?: string[];
  papervariant?: string[];
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

  // Modern, mobile-friendly, globally-used color scheme
  const categoryBackgrounds: Record<string, string> = {
    'Paper Bags': '#f8ecd8',     // Cream - eco feel
    'Paper Covers': '#f3f4f6',   // Light Gray - clean/neutral
    'Paper Boxes': '#e8f5e9',    // Soft Green - bakery/fresh
  };

  return (
    <motion.div
      key={selectedCategory}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: filtered.length > 2 ? '100vh' : 'auto',
          pt: 2,
          pb: 4,
          px: 1,
          background: categoryBackgrounds[selectedCategory] || '#fff',
          transition: 'background 0.3s ease-in-out',
        }}
      >
        {/* Toggle Group */}
        <Box
          sx={{
            position: 'sticky',
            top: isMobile ? 56 : 72,
            zIndex: 20,
            width: '100%',
            maxWidth: { xs: 420, sm: 600 },
            backgroundColor: 'transparent',
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
              p: { xs: '3px', sm: '6px' },
              height: { xs: 'auto', sm: 64 },
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
                  py: { xs: 1, sm: 1.6 },
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

        {/* Category Heading */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 2,
            mt: 1,
            color: '#212121',
            fontSize: {
              xs: '1.2rem',
              sm: '2.4rem',
            },
          }}
        >
          {selectedCategory}
        </Typography>

        {/* Grid */}
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
                xs: '6px',
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
                  desc={product.description}
                  offeredPrice={product.offeredPrice ?? undefined}
                  sellingPrice={product.sellingPrice ?? undefined}
                  link={product.link}
                  printVariants={product.printvariants}
                  paperVariants={product.papervariant}
                />
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </motion.div>
  );
}
