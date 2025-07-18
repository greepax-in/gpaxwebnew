'use client';

import React from 'react';
import {
  Box,
  Typography,
  Tooltip,
  IconButton,
  Button,
  useMediaQuery,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';

export type ProductCardProps = {
  name: string;
  image: string;
  // waText?: string;
  price?: string;
  link?: string;
  variants?: string | string[];
};

export default function ProductCard({
  name,
  image,
  // waText,
  price,
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
            minHeight: isMobile ? 90 : 450,
            position: 'relative',
            width: '100%',
          }}
        >
          {/* Image with price tag */}
          <Box
            sx={{
              position: 'relative',
              width: isMobile ? 60 : 182,
              height: isMobile ? 60 : 242, // another 10% increase for desktop
              mb: 1,
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
                maxWidth: isMobile ? 60 : 200,
                maxHeight: isMobile ? 60 : 264, // another 10% increase for desktop
                objectFit: 'contain',
                borderRadius: 1,
                display: 'block',
              }}
              />
            </motion.div>

            {price && (
                <Box
                sx={{
                  position: 'absolute',
                  top: isMobile ? 10 : 2,
                  right: isMobile ? -30 : 2,
                  backgroundColor: '#2e7d32',
                  color: '#fff',
                  px: 1,
                  py: 0.25,
                  pr: isMobile ? 3 : 2,
                  fontSize: isMobile ? '0.7rem' : '0.91rem',
                  fontWeight: 700,
                  borderRadius: '4px 10px 10px 4px',
                  boxShadow: 1,
                  zIndex: 1,
                  '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: '50%',
                  right: 0,
                  transform: 'translate(50%, -50%)',
                  width: 0,
                  height: 0,
                  borderTop: '5px solid transparent',
                  borderBottom: '5px solid transparent',
                  borderLeft: '5px solid #2e7d32',
                  },
                }}
                >
                ₹{price}
                </Box>
            )}
          </Box>

          {/* Name */}
          <Typography
            fontWeight={700}
            fontSize={isMobile ? '0.6rem' : '1.17rem'}
            lineHeight={1.3}
            sx={{
              textAlign: 'center',
              color: '#212121',
              mb: 0.7,
            }}
          >
            {name}
          </Typography>

          {/* Variants (desktop only) */}
          {!isMobile && variants && (
            <Typography
              sx={{
                fontSize: '1.04rem',
                color: '#616161',
                textAlign: 'center',
                width: '100%',
                lineHeight: 1.4,
                mb: 1.3,
              }}
            >
              Variants: {Array.isArray(variants) ? variants.join(', ') : variants}
            </Typography>
          )}

          {/* WhatsApp CTA */}
          {link &&
            (isMobile ? (
              <Tooltip title="Chat on WhatsApp">
                <IconButton
                  component="a"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: '#25D366',
                    p: 0.3,
                    mt: 0.5,
                  }}
                >
                  <WhatsAppIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            ) : (
              <Button
                variant="outlined"
                size="medium"
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                startIcon={<WhatsAppIcon />}
                sx={{
                  textTransform: 'none',
                  fontSize: '0.975rem',
                  color: '#25D366',
                  borderColor: '#25D366',
                  '&:hover': {
                    backgroundColor: '#e8f5e9',
                    borderColor: '#25D366',
                  },
                }}
              >
                Chat with us
              </Button>
            ))}
        </Box>
      </motion.div>
    </Box>
  );
}
