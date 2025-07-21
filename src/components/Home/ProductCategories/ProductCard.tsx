'use client';

import React from 'react';
import { Box, Typography, Chip, useMediaQuery } from '@mui/material';
import { off } from 'process';

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
          width: isMobile ? '45vw' : 285,
          height: isMobile ? 'auto' : 600,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          overflow: 'hidden',
          bgcolor: '#fff',
          boxShadow: 1,
          mx: isMobile ? 'auto' : 1,
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
          <Chip
            label={
              sellingPrice ? (
          <>
            ₹{offeredPrice}{' '}
            <span
              style={{
                textDecoration: 'line-through',
                color: '#000',
                fontSize: isMobile ? '0.8rem' : '1.4rem',
                marginLeft: 4,
              }}
            >
              ₹{sellingPrice}
            </span>
          </>
              ) : `₹${offeredPrice}`
            }
            sx={{
              fontWeight: 600,
              fontSize: isMobile ? '1rem' : '1.8rem',
              height: 32,
              px: 0,
              background: 'linear-gradient(135deg, #0f9d58, #1e88e5)',
              color: '#fff',
              borderRadius: '999px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              alignItems: 'center'
            }}
          />
        </Box>
      </Box>
    </a>
  );
}
