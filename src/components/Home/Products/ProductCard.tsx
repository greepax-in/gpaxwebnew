'use client';

import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PaperVariantChip from '@/components/Common/VariantChips/PaperVariantChip';
import PrintVariantChip from '@/components/Common/VariantChips/PrintVariantChip';

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

  const CardContent = (
    <Box
      sx={{
        textDecoration: 'none',
        width: isMobile ? '45vw' : 300,
        height: isMobile ? 'auto' : 600,
        borderRadius: 3,
        overflow: 'hidden',
        bgcolor: '#fff',
        boxShadow: isMobile ? 1 : 4,
        mx: 'auto',
        mb: 3,
        transition: 'all 0.35s ease',
        '&:hover': {
          boxShadow: isMobile ? 6 : 8,
          transform: isMobile ? 'none' : 'scale(1.025)',
        },
      }}
    >
      {/* --- MOBILE --- */}
      {isMobile ? (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
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

          {/* Price Chip Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                mt: 1,
                mb: 2,
                px: 2,
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
                  fontSize: '1.2rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <Typography
                  component="span"
                  sx={{
                    fontSize: '0.6rem',
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
                      fontSize: '1rem',
                      color: 'rgba(255,255,255,0.85)',
                      fontWeight: 400,
                    }}
                  >
                    ₹{sellingPrice}
                  </Typography>
                )}
              </Box>
            </Box>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileHover={{
            scale: 1.04,
            filter: 'brightness(1.05)',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
          }}
          transition={{ type: 'spring', stiffness: 250, damping: 20 }}
        >
          <motion.img
            src={image}
            alt={name}
            style={{
              width: '100%',
              height: 360,
              objectFit: 'cover',
              display: 'block',
            }}
            whileHover={{ scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          />
        </motion.div>
      )}

      {/* Desktop content */}
      {!isMobile && (
        <Box sx={{ px: 2, pt: 2 }}>
          <Typography
            noWrap
            sx={{ fontWeight: 700, fontSize: '1.4rem', color: '#222', mb: 1 }}
          >
            {name}
          </Typography>

          {desc && (
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

          {/* Paper Variants */}
          {paperVariants && paperVariants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 1,
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >

                {paperVariants.map((variant, i) => (
                  <PaperVariantChip key={i} label={variant} size="small" />
                ))}
              </Box>
            </motion.div>
          )}

          {/* Print Variants */}
          {printVariants && printVariants.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  mb: 2,
                  flexWrap: 'nowrap',
                  overflowX: 'auto',
                  scrollbarWidth: 'none',
                  '&::-webkit-scrollbar': { display: 'none' },
                }}
              >

                {printVariants.map((variant, i) => (
                  <PrintVariantChip key={i} label={variant} size="small" />
                ))}
              </Box>
            </motion.div>
          )}

          {/* Price */}
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
                fontSize: '1.2rem',
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Typography
                component="span"
                sx={{
                  fontSize: '0.6rem',
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
                    fontSize: '1rem',
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
      )}
    </Box>
  );

  return link ? (
    <Link href={link} passHref legacyBehavior>
      <a style={{ textDecoration: 'none' }}>{CardContent}</a>
    </Link>
  ) : (
    CardContent
  );
}
