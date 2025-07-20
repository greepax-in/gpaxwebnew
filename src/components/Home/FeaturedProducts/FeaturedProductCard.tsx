'use client';

import React from 'react';
import {
  Box,
  Typography,
  IconButton,
  Button,
  useMediaQuery,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';

export type ProductCardProps = {
  name: string;
  image: string;
  offeredPrice?: number; // Changed offeredPrice type to number
  sellingPrice?: number; // Changed sellingPrice type to number
  link?: string;
  variants?: string | string[];
};

export default function ProductCard({
  name,
  image,
  offeredPrice, // Changed offeredPrice type to number
  sellingPrice, // Changed sellingPrice type to number
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
            mb: isMobile ? -0.5 : 0, // Reduced margin-bottom to decrease space between rows of product cards
          }}
        >
          {/* Image with price tag */}
          <Box
            sx={{
              position: 'relative',
              width: isMobile ? 60 : 182,
              height: isMobile ? 60 : 242, // another 10% increase for desktop
              mt:0.5,
              mb: 0.5, // Adjusted margin-bottom to move the product image down by 5%
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
                  maxHeight: isMobile ? 60 : 284, // another 10% increase for desktop
                  objectFit: 'contain',
                  borderRadius: 1,
                  display: 'block',
                }}
              />
            </motion.div>
          </Box>

          {/* Name and WhatsApp Icon (mobile only) */}
          {isMobile && (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr', // Single column layout
                alignItems: 'center',
                // gap: 0.5, // Reduced gap for closer spacing
                mt: 0.1,
                width: '100%',
              }}
            >
              <Typography
                fontWeight={700} // Keep bold
                fontSize={isMobile ? '0.7rem' : '1rem'} // Reduced font size
                lineHeight={1.3}
                sx={{
                  textAlign: 'center',
                  color: '#212121',
                  mb: 0.7,
                  whiteSpace: 'normal', // Allow wrapping
                  wordBreak: 'break-word',
                }}
              >
                {name}
              </Typography>
            </Box>
          )}

          {/* Name and Price (mobile only) */}
          {isMobile && (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                // gap: 0.5, // Reduced gap for closer spacing
                width: '100%',
                position: 'relative',
                // mt: 0.5,-004
                // marginTop: '0.5rem', // Adjusted margin-top for better spacing
              }}
            >
              {offeredPrice && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Move WhatsApp icon towards the right
                    width: '100%',
                    marginTop: '0rem',
                  }}
                >
                  <Box
                    sx={{
                      background: 'linear-gradient(90deg, #bc4d02ff, #f9d9bfff)',
                      color: '#fff',
                      px: 1.5,
                      py: 0.5,
                      fontSize: '1rem',
                      fontWeight: 700,
                      borderRadius: '0 4px 4px 0',
                      height: '2rem', // Ensure consistent height
                      width: '60%', // Increased width to 60% of the card
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    ₹{offeredPrice}{' '}
                    <Typography component="span" sx={{ textDecoration: 'line-through', marginLeft: '0.5rem' }}>
                      (₹{sellingPrice})
                    </Typography>
                  </Box>

                  {link && (
                    <IconButton
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        background: '#25D366', // WhatsApp green color
                        color: '#fff',
                        borderRadius: '50%',
                        height: '1.5rem', // Reduced height
                        width: '1.5rem', // Reduced width
                        '&:hover': {
                          backgroundColor: '#1DA851',
                        },
                      }}
                    >
                      <WhatsAppIcon sx={{ fontSize: '1rem' }} /> {/* Reduced icon size */}
                    </IconButton>
                  )}
                </Box>
              )}
            </Box>
          )}

          {/* Name (desktop) */}
          {!isMobile && (
            <Typography
              fontWeight={700}
              fontSize={isMobile ? '0.6rem' : '1.17rem'}
              lineHeight={1.3}
              sx={{
                textAlign: 'center',
                color: '#212121',
                mb: 0.7,
                whiteSpace: 'break-spaces',
              }}
            >
              {name}
            </Typography>
          )}

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

          {/* WhatsApp Button (desktop only) */}
          {!isMobile && link && (
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
          )}

     
       
        </Box>
      </motion.div>
    </Box>
  );
}
