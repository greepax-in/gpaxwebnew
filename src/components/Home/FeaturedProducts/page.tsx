'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import featuredProducts from '../../../data/products.json';

const filteredProducts = featuredProducts.filter(
  (product) => product.featuredProduct === 'yes'
);

export default function FeaturedProducts() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [showBlurOverlay, setShowBlurOverlay] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setShowBlurOverlay(false);
    const el = scrollRef.current;
    if (el) el.addEventListener('scroll', handleScroll);
    return () => el?.removeEventListener('scroll', handleScroll);
  }, []);

  const itemWidth = isMobile ? 110 : 144;

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: '#fef6e4',
        height: { xs: '24vh', sm: '50vh' },
        px: { xs: 1, sm: 3 },
        py: { xs: 2, sm: 4 },
      }}
    >
      {/* Heading */}
      <Box sx={{ maxWidth: 1500, margin: '0 auto', mb: { xs: 0.5, sm: 2 } }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.2rem', sm: '2.5rem' },
            color: '#000',
            textAlign: { xs: 'left', sm: 'center' },
            mt: { xs: -2, sm: -2 },
          }}
        >
          Popular Products
        </Typography>
      </Box>

      {/* Scrollable container wrapper */}
      <Box sx={{ position: 'relative' }}>
        <Box
          ref={scrollRef}
          sx={{
            display: 'flex',
            gap: { xs: 2, sm: 8 },
            overflowX: { xs: 'auto', sm: 'hidden' },
            justifyContent: { xs: 'flex-start', sm: 'center' },
            scrollSnapType: 'x mandatory',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            px: 0,
          }}
        >
          {/* Left padding spacer */}
          <Box sx={{ width: isMobile ? 12 : 20, flexShrink: 0 }} />

          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              style={{
                scrollSnapAlign: 'center',
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: itemWidth,
                minWidth: itemWidth,
                position: 'relative',
              }}
            >
              {/* Image Circle */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: isMobile ? 80 : 150,
                  height: isMobile ? 80 : 150,
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
                    width: '80%',
                    height: '80%',
                    objectFit: 'contain',
                  }}
                />
              </motion.div>

              {/* Title */}
              <Typography
                sx={{
                  mt: 0.5,
                  fontWeight: 700,
                  fontSize: { xs: '0.74rem', sm: '1.2rem' },
                  textAlign: 'center',
                  color: '#111',
                }}
              >
                {product.name}
              </Typography>

              {/* Price Badge */}
              <Typography
                sx={{
                  bottom: '-10px',
                  zIndex: 2,
                  background: 'linear-gradient(135deg, #ef4444 0%, #5f36f3 100%)',
                  color: '#fff',
                  fontSize: { xs: '0.9rem', sm: '1rem' },
                  fontWeight: 700,
                  px: 1,
                  borderRadius: '0 999px 999px 999px',
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
                    right: '-4px',
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

          {/* Right spacer */}
          <Box sx={{ width: isMobile ? 8 : 20, flexShrink: 0 }} />
        </Box>

        {/* Right blur/fade */}
        {isMobile && showBlurOverlay && (
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              height: '100%',
              width: '16vw',
              background: 'linear-gradient(to left, #fef6e4 20%, transparent)',
              pointerEvents: 'none',
              zIndex: 5,
            }}
          />
        )}
      </Box>
    </Box>
  );
}
