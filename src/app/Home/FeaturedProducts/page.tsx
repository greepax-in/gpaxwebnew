'use client';

import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import featuredProducts from '../../../data/products.json';

const filteredProducts = featuredProducts.filter(
  (product) => product.featuredProduct === 'yes'
);

export default function FeaturedProducts() {
  const isMobile = useMediaQuery('(max-width:600px)'); // Check if the screen is mobile

  return (
    <Box
      sx={{
        width: '100%',
        // height: '45vh',
        backgroundColor: '#fef6e4',
        px: { xs: 2, sm: 3 },
        py: { xs: 3, sm: 4 },
      }}
    >
      {/* Heading */}
      <Box
        sx={{
          maxWidth: 1500,
          margin: '0 auto',
          mb: { xs: 2, sm: 3 },
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.2rem', sm: '2.5rem' },
            color: '#000',
            textAlign: { xs: 'left', sm: 'center' },
          }}
        >
          Popular Products
        </Typography>
      </Box>

      {/* Product Scroll List */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 2, sm: 8 }, // Increase gap on desktop
          overflowX: { xs: 'auto', sm: 'hidden' }, // Scroll on mobile, center on desktop
          justifyContent: { xs: 'flex-start', sm: 'center' }, // Align to center on desktop
          scrollSnapType: 'x mandatory',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          px: 1,
        }}
      >
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            style={{
              scrollSnapAlign: 'center',
              flex: '0 0 auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: isMobile ? '120px' : '144px', // Increase width by 20% on desktop
              position: 'relative',
            }}
          >
            {/* Image Circle */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              style={{
                width: isMobile ? 80 : 150, // Increase size by 20% on desktop
                height: isMobile ? 80 : 150, // Increase size by 20% on desktop
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid #fcd34d',
                backgroundColor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                position: 'relative',
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  maxWidth: '90%',
                  maxHeight: '90%',
                  objectFit: 'contain',
                }}
              />
            </motion.div>

            {/* Title */}
            <Typography
              sx={{
                mt: 0.5,
                fontWeight: 700,
                fontSize: { xs: '0.74rem', sm: '1.2rem' }, // Separate font size for mobile and desktop
                textAlign: 'center',
              }}
            >
              {product.name}
            </Typography>

            {/* Price Badge */}
            <Typography
              sx={{
                // position: 'absolute', // Keep price tag fixed
                bottom: '-10px', // Fixed position from the bottom of the container
                zIndex: 2,
                background: 'linear-gradient(135deg, #ef4444 0%, #5f36f3 100%)',
                color: '#fff',
                fontSize: { xs: '0.65rem', sm: '1rem' }, // Different font size for mobile and desktop
                fontWeight: 700,
                px: 1,
                borderRadius: '0 999px 999px 999px', // Teardrop shape
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              ₹{product.offeredPrice} (<del>₹{product.sellingPrice}</del>)
            </Typography>

            {/* Optional Tag */}
            {product.tagtext && (
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: '0px',
                  right: '-4px', // Push outside the right edge
                  mt: 0,
                  backgroundColor: '#34d399',
                  color: '#fff',
                  fontSize: '0.6rem',
                  borderRadius: '8px',
                  px: 1,
                  py: 0.2,
                }}
              >
                {product.tagtext}
              </Typography>
            )}
          </motion.div>
        ))}
      </Box>
    </Box>
  );
}
