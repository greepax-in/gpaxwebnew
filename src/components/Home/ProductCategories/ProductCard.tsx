'use client';

import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

export type ProductCardProps = {
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
          width: isMobile ? '45vw' : 300,
          height: isMobile ? 'auto' : 600,
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: '#fff',
          boxShadow: 1,
          mx: 'auto',
          mb: 2,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: 6,
            transform: 'scale(1.02)',
          },
        }}
      >
        {/* --- mobile image full view --- */}
        {isMobile ? (
          <>
            <Box
              component="img"
              src={image}
              alt={name}
              sx={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
              }}
            />
            <Box sx={{ px: 1.5, py: 1 }}>
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  color: '#222',
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  textOverflow: 'ellipsis',
                }}
              >
                {name}
              </Typography>
            </Box>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1 }}
            whileHover={{
              scale: 1.06,
              filter: 'brightness(1.05)',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
            }}
            transition={{
              type: 'spring',
              stiffness: 250,
              damping: 22,
            }}
          >
            <Box
              component="img"
              src={image}
              alt={name}
              sx={{
                width: '100%',
                height: 360,
                objectFit: 'cover',
                display: 'block',
              }}
            />
          </motion.div>
        )}

        {/* --- bottom section --- */}
        <Box sx={{ px: 2, pt: isMobile ? 1.5 : 2 }}>
          {!isMobile && (
            <Typography
              noWrap
              sx={{
                fontWeight: 700,
                fontSize: '1.4rem',
                color: '#222',
                mb: 1,
              }}
            >
              {name}
            </Typography>
          )}

          {!isMobile && desc && (
            <Typography
              sx={{
                fontSize: '0.9rem',
                color: '#555',
                mb: 2,
                lineHeight: 1.4,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {desc}
            </Typography>
          )}

          {/* Paper Variants (desktop only) */}
          {!isMobile && paperVariants && paperVariants.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 500, color: '#555' }}>
                📄 Paper:
              </Typography>
              {paperVariants.map((variant, i) => {
                const lower = variant.toLowerCase();
                let sx: any = {
                  px: 1.2,
                  py: 0.4,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  borderRadius: 99,
                };

                if (lower === 'kraft') {
                  sx = {
                    ...sx,
                    backgroundColor: '#a47148',
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

          {/* Print Variants (desktop only) */}
          {!isMobile && printVariants && printVariants.length > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Typography sx={{ fontSize: '0.72rem', fontWeight: 500, color: '#555' }}>
                🎨 Print:
              </Typography>
              {printVariants.map((variant, i) => {
                const variantLower = variant.toLowerCase();
                let label = variant;
                const styleProps: Record<string, string | number> = {
                  px: 1.2,
                  py: 0.4,
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  borderRadius: 99,
                  color: '#fff',
                  whiteSpace: 'nowrap',
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
                }

                return (
                  <Box key={i} sx={styleProps}>
                    {label}
                  </Box>
                );
              })}
            </Box>
          )}

          {/* Pricing */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              mt: 'auto',
              mb: 2,
            }}
          >
            <Box
              sx={{
                px: 2,
                py: 0.6,
                background: 'linear-gradient(135deg, #0f9d58, #1e88e5)',
                color: '#fff',
                borderRadius: '20px',
                fontWeight: 700,
                fontSize: isMobile ? '1rem' : '1.2rem',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: isMobile ? '0.5rem' : '0.6rem',
                  fontWeight: 400,
                  mr: 0.5,
                  opacity: 0.85,
                }}
              >
                from
              </Typography>
              ₹{offeredPrice}
              {sellingPrice && (
                <Typography
                  component="span"
                  sx={{
                    ml: 1,
                    textDecoration: 'line-through',
                    fontSize: isMobile ? '0.75rem' : '1rem',
                    color: 'rgba(255,255,255,0.85)',
                    fontWeight: 400,
                  }}
                >
                  ₹{sellingPrice}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </a>
  );
}
