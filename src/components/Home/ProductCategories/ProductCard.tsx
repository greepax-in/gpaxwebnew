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
            mb: isMobile ? 1 : 2, // Added margin bottom for both mobile and desktop
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

        {/* Paper Type & Print Variants */}
{!isMobile && (
  <Box sx={{ px: 1, pt: 1 }}>
    {/* Paper Type */}
    {paperVariants && paperVariants.length > 0 && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 500, color: '#555' }}>
          📄 Paper:
        </Typography>
        {paperVariants.map((variant, i) => {
          const lower = variant.toLowerCase();
          let sx: any = {
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.2,
            py: 0.4,
            fontSize: '0.7rem',
            fontWeight: 600,
            borderRadius: 99,
            whiteSpace: 'nowrap',
          };

          if (lower === 'kraft') {
            sx = {
              ...sx,
              backgroundColor: '#a47148', // Kraft brown
              color: '#fff',
            };
          } else if (lower === 'white') {
            sx = {
              ...sx,
              backgroundColor: '#fff',
              color: '#333',
              border: '1px solid #ccc',
            };
          }

          return (
            <Box key={i} sx={sx}>
              {variant}
            </Box>
          );
        })}
      </Box>
    )}

    {/* Print Variants */}
    {printVariants && printVariants.length > 0 && (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 500, color: '#555' }}>
          🎨 Print:
        </Typography>
        {printVariants.map((variant, i) => {
          const variantLower = variant.toLowerCase();
          let label = variant;
          let styleProps: any = {
            display: 'inline-flex',
            alignItems: 'center',
            px: 1.2,
            py: 0.4,
            fontSize: '0.7rem',
            fontWeight: 600,
            borderRadius: 99,
            color: '#fff',
            whiteSpace: 'nowrap',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          };

          if (variantLower === 'plain') {
            label = 'Plain';
            styleProps.backgroundColor = '#b4b5b4';
          } else if (variantLower === 'single color') {
            label = '1-Color';
            styleProps.backgroundColor = '#5f02b0';
          } else if (variantLower === 'multi color') {
            label = 'MultiColor';
            styleProps.background = 'linear-gradient(135deg, #5f02b0, #f3a42f)';
            styleProps.border = '1px solid rgba(255,255,255,0.1)';
            styleProps.boxShadow = 'inset 0 0 4px rgba(255,255,255,0.2)';
          }

          return (
            <Box key={i} sx={styleProps}>
              {label}
            </Box>
          );
        })}
      </Box>
    )}
  </Box>
)}


        {/* Price */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            px: isMobile ? 1 : 2,
            pt: isMobile ? 0.5 : 1,
          }}
        >
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              py: isMobile ? 0.3 : 0.4,
              px: isMobile ? 1 : 2,
              background: isMobile
                ? 'linear-gradient(135deg, #43cea2, #185a9d)'
                : 'linear-gradient(135deg, #0f9d58, #1e88e5)',
              color: '#fff',
              borderTopLeftRadius: isMobile ? '12px' : '999px',
              borderBottomLeftRadius: isMobile ? '6px' : '999px',
              borderTopRightRadius: isMobile ? '6px' : '6px',
              borderBottomRightRadius: isMobile ? '6px' : '6px',
              fontWeight: 600,
              fontSize: isMobile ? '1.3rem' : '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              maxWidth: 'fit-content',
            }}
          >
            ₹{offeredPrice}
            {sellingPrice && (
              <span
                style={{
                  marginLeft: 5,
                  textDecoration: 'line-through',
                  fontSize: isMobile ? '1.1rem' : '1.5rem',
                  color: isMobile ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.85)',
                  fontWeight: isMobile ? 500 : 400,
                }}
              >
                ₹{sellingPrice}
              </span>
            )}
          </Box>
        </Box>


      </Box>
    </a>
  );
}
