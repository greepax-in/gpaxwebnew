'use client';

import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  Chip,
} from '@mui/material';
import { motion } from 'framer-motion';
import PrintVariants from '../../../app/PrintVariants.json';

const typedPrintVariants = PrintVariants.variants as {
  name: string;
  backgroundColor: string;
}[];

export type ProductCardProps = {
  name: string;
  image: string;
  desc: string;
  offeredPrice?: number;
  sellingPrice?: number;
  link?: string;
  variants?: string | string[];
};

export default function ProductCard({
  name,
  image,
  desc,
  offeredPrice,
  sellingPrice,
  link,
  variants,
}: ProductCardProps) {
  const isMobile = useMediaQuery('(max-width:600px)');

  const motionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <Box sx={{ width: '100%' }}>
      <motion.div
        whileHover={!isMobile ? { scale: 1.03 } : undefined}
        initial="hidden"
        animate="visible"
        variants={motionVariants}
        custom={0}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ width: '100%' }}
        onClick={() => link && window.open(link, '_blank')}
        tabIndex={0} // Make the card tabbable
        onKeyDown={(e) => {
          if (e.key === 'Enter' && link) {
            window.open(link, '_blank');
          }
        }}
      >
        <Box
          sx={{
            background: '#fff',
            borderRadius: 2,
            p: isMobile ? 0 : 3,
            boxShadow: 1,
            '&:hover': { boxShadow: 3 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            minHeight: isMobile ? 108 : 450,
            maxHeight: isMobile ? 108 : 450,
            width: isMobile ? '100%' : 320, // Increased width for mobile
            mb: isMobile ? -1 : 0,
          }}
        >
          {/* Image with floating price tag */}
          <Box
            sx={{
              position: 'relative',
              width: isMobile ? 60 : 182,
              height: isMobile ? 60 : 242,
              mt: 0.5,
              mb: 0.5,
            }}
          >
            <motion.div
              whileHover={
                !isMobile
                  ? {
                      scale: 1.1,
                      rotate: 1.5,
                      transition: { type: 'spring', stiffness: 200, damping: 10 },
                    }
                  : undefined
              }
              style={{ width: '100%', height: '100%' }}
            >
              <Box
                component="img"
                src={image}
                alt={`Product image for ${name}`}
                sx={{
                  width: '100%',
                  height: '100%',
                  maxWidth: isMobile ? 60 : 220,
                  maxHeight: isMobile ? 60 : 284,
                  objectFit: 'contain',
                  borderRadius: 1,
                  display: 'block',
                }}
              />
            </motion.div>

            {/* Floating price tag (desktop and mobile) */}
            {offeredPrice && (
                <Box
                  sx={{
                  position: 'absolute',
                  top: 4,
                  right: isMobile ? -55 : 4,
                  background: 'linear-gradient(#f99f02fc)',
                  color: '#00000eff',
                  px: 1.2,
                  py: 0.4,
                  borderRadius: '12px',
                  fontWeight: 'bold',
                  fontSize: isMobile ? '0.8rem' : '1.5rem',
                  zIndex: 2,
                  boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                >
                  ₹{offeredPrice}
                  {sellingPrice && (
                  <Typography
                    component="span"
                    sx={{
                    ml: 0.7,
                    textDecoration: 'line-through',
                    fontSize: isMobile ? '0.8rem' : '0.7rem',
                      fontWeight: 'bold',
                    color: '#f9f9fcff',
                    }}
                  >
                    ₹{sellingPrice}
                  </Typography>
                  )}
                </Box>
            )}
          </Box>

          {/* Product Name */}
          <Typography
            fontWeight={700}
            fontSize={isMobile ? '0.7rem' : '1.17rem'}
            lineHeight={1.3}
            sx={{
              textAlign: 'center',
              color: '#212121',
              mb: 0.7,
              whiteSpace: 'break-spaces',
              px: 1,
            }}
          >
            {name}
          </Typography>

          {/* Description and Variants (desktop only) */}
          {!isMobile && (
            <>
              <Typography
                sx={{
                  fontSize: '1.04rem',
                  color: '#616161',
                  textAlign: 'center',
                  width: '100%',
                  lineHeight: 1.4,
                  mb: 1.3,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  px: 2,
                }}
              >
                {desc.length > 100 ? `${desc.substring(0, 97)}...` : desc}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 1,
                  mt: 1.5,
                }}
              >
                {Array.isArray(variants) &&
                  variants.slice(0, 3).map((variant, index) => (
                    <Chip
                      key={index}
                      label={variant}
                      sx={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        background:
                          typedPrintVariants.find(
                            (pv) => pv.name.trim().toLowerCase() === variant.trim().toLowerCase()
                          )?.backgroundColor || '#1976d2',
                        color: '#fff',
                        px: 1,
                        py: 0.5,
                      }}
                    />
                  ))}
              </Box>
            </>
          )}
        </Box>
      </motion.div>
    </Box>
  );
}