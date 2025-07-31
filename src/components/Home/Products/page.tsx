'use client';

import React, { useState } from 'react';
import ProductCard from '@/components/Home/Products/ProductCard';
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import products from '@/data/items.json';

type ProductType = {
  name: string;
  image: string;
  offeredPrice?: number;
  sellingPrice?: number;
  printVariants?: string[];
  paperVariants?: string[];
  pageLink?: string;
  desc?: string;
  category: string;
  description?: string;
  printvariants?: string[];
  papervariant?: string[];
};

export default function ProductGridSection() {
  const [selectedCategory, setSelectedCategory] = useState('Paper Bags');
  const isMobile = useMediaQuery('(max-width:600px)');

  const filtered = products.filter(
    (product: ProductType) => product.category === selectedCategory
  );

  const categoryBackgrounds: Record<string, string> = {
    'Paper Bags': '#f8ecd8',     // Cream - eco feel
    'Paper Covers': '#E3F2E1',   // Light Gray - clean/neutral
    'Paper Boxes': '#e8f5e9',    // Soft Green - bakery/fresh
  };

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      {/* Smooth Background Transition */}
      <motion.div
        key={selectedCategory}
        initial={false}
        animate={{
          backgroundColor: categoryBackgrounds[selectedCategory] || '#ffffff',
        }}
        transition={{ duration: 0.5, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      />

      {/* Foreground Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: filtered.length > 2 ? '100vh' : 'auto',
          pt: 1,
          pb: 4,
          px: 1,
        }}
      >
        {/* Toggle Buttons */}
        <Box
          sx={{
            position: 'sticky',
            top: isMobile ? 0 : 25,
            zIndex: 20,
            width: '100%',
            maxWidth: { xs: 360, sm: 600 },
            backgroundColor: '#1B5E20',
            px: { xs: 1, sm: 2 },
            py: { xs: 0.5, sm: 1 },
            borderRadius: '50px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
          }}
        >
          {['Paper Bags', 'Paper Covers', 'Paper Boxes'].map((category) => (
            <motion.div
              key={category}
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Button
                onClick={() => setSelectedCategory(category)}
                sx={{
                  color: selectedCategory === category ? '#1B5E20' : '#E8F5E9',
                  fontSize: { xs: '0.85rem', sm: '1rem' },
                  fontWeight: 'bold',
                  padding: { xs: '0.2rem 0.6rem', sm: '0.3rem 0.8rem' },
                  borderRadius: '50px',
                  background:
                    selectedCategory === category ? '#FFFFFF' : 'transparent',
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background:
                      selectedCategory === category ? '#FFFFFF' : '#2E7D32',
                    color:
                      selectedCategory === category ? '#1B5E20' : '#FFFFFF',
                  },
                }}
              >
                {category}
              </Button>
            </motion.div>
          ))}
        </Box>

        {/* Heading */}
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

        {/* Product Grid */}
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
                  link={product.pageLink}
                  printVariants={product.printvariants}
                  paperVariants={product.papervariant}
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Dynamic Explore All Button */}
        <Button
          sx={{
            mt: 4,
            padding: '0.5rem 1.5rem',
            backgroundColor: '#1B5E20',
            color: '#FFFFFF',
            fontSize: '1rem',
            fontWeight: 'bold',
            borderRadius: '50px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
            textTransform: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#2E7D32',
            },
          }}
          onClick={() => console.log(`Explore All ${selectedCategory}`)}
        >
          {`Explore All ${selectedCategory}`}
        </Button>
      </Box>
    </Box>
  );
}
