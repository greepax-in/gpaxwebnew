'use client';

import React from 'react';
import { Box, Typography, Chip, useMediaQuery } from '@mui/material';

type ProductCardProps = {
  name: string;
  image: string;
  offeredPrice?: number;
  sellingPrice?: number;
  printVariants?: string[];
  paperVariants?: string[];
  link?: string;
  desc?: string;
};

export default function ProductCard({
  name,
  image,
  offeredPrice,
  sellingPrice,
  printVariants,
  paperVariants,
  link,
  desc,
}: ProductCardProps) {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: 'none' }}
    >
      <Box
        sx={{
          width: isMobile ? '45vw' : 285, // ~60% of viewport width on mobile
          height: isMobile ? 'auto' : 490,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          bgcolor: '#fff',
          boxShadow: 1,
          mx: isMobile ? 'auto' : 1, // Centered on mobile, spaced on desktop
          mb: isMobile ? 2 : 0,
          transition: '0.3s',
          '&:hover': {
            boxShadow: 4,
            transform: 'scale(1.015)',
          },
        }}
      >
        {/* Product Image */}
        <Box
          component="img"
          src={image}
          alt={name}
          sx={{
            width: '100%',
            height: isMobile ? 'auto' : 380,
            objectFit: 'cover',
            display: 'block',
          }}
        />

        {/* Product Name */}
        <Typography
          noWrap
          sx={{
            fontWeight: 600,
            fontSize: isMobile ? '0.85rem' : '1.4rem',
            px: 1,
            pt: 1,
            color: '#111',
          }}
        >
          {name}
        </Typography>
        {!isMobile && desc && (
          <Typography
            noWrap
            sx={{
              fontWeight: 400,
              fontSize: '1rem',
              px: 1,
              pt: 0.5,
              color: '#444',
            }}
          >
            {desc}
          </Typography>
        )}


        {/* Variants */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 1, pt: 0.5 }}>
          {[...(printVariants ?? []), ...(paperVariants ?? [])].map((variant, i) => (
            <Chip
              key={i}
              label={variant}
              size="small"
              sx={{ fontSize: '0.65rem', height: 20 }}
            />
          ))}
        </Box>

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 1 }}>
          {offeredPrice && (
            <Typography sx={{ color: 'green', fontWeight: 600 }}>
              ₹{offeredPrice}
            </Typography>
          )}
          {sellingPrice && (
            <Typography
              sx={{
                textDecoration: 'line-through',
                color: '#777',
                fontSize: '0.85rem',
              }}
            >
              ₹{sellingPrice}
            </Typography>
          )}
        </Box>
      </Box>
    </a>
  );
}
