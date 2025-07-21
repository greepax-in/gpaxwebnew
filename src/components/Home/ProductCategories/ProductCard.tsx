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
  variants?: string[];
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
  variants,
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
          height: isMobile ? 'auto' : 570,
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
            sx={{
              fontWeight: 400,
              fontSize: '1rem',
              px: 1,
              pt: 0.5,
              color: '#444',
              display: '-webkit-box',
              WebkitLineClamp: 2, // Limit to 2 lines
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {desc}
          </Typography>
        )}

        {/* Paper Variants */}
        {!isMobile && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 1, pt: 0.5 }}>
            {[...(printVariants ?? variants ?? [])].map((variant, i) => (
              <Chip
                key={i}
                label={variant}
                size="small"
                sx={{ fontSize: '0.65rem', height: 20 }}
              />
            ))}
          </Box>
        )}

        {/* Print Variants */}
        {!isMobile && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, px: 1, pt: 0.5 }}>
            {[...(paperVariants ?? [])].map((variant2, i) => (
              <Chip
                key={i}
                label={variant2}
                size="small"
                sx={{ fontSize: '0.65rem', height: 20 }}
              />
            ))}
          </Box>
        )}

        {/* Price */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 1 }}>
          {offeredPrice && (
            <Typography sx={{ color: 'green', fontWeight: 600 }}>
              ₹{sellingPrice}
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
              ₹{offeredPrice}
            </Typography>
          )}
        </Box>
      </Box>
    </a>
  );
}
