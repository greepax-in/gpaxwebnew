'use client';

import React from 'react';
import { Box, Typography, Chip, Stack, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { WhatsApp } from '@mui/icons-material';
// import { Switch } from '@mui/material';

interface ProductTitleWithPriceProps {
  title: string;
  subtitle?: string;
  size?: string;
  contains?: number;
  containsLabel?: string;
  offeredPrice: number;
  sellingPrice: number;
  selectedUnit?: string;
  deviceType?: 'mobile' | 'desktop';
  MOQ: number;
  currencySymbol?: string;
  printVariant?: string;
  features?: string[];
  usecases?: string[];
  sizeUnit: 'IN' | 'CM';
  GSM: string; // Optional GSM for paper products
  toggleSizeUnit: () => void;
}

export default function ProductTitleWithPrice({
  title,
  size,
  offeredPrice,
  sellingPrice,
  contains,
  containsLabel,
  selectedUnit,
  MOQ,
  // deviceType = 'mobile',
  printVariant,
  usecases = [],
  sizeUnit,
  toggleSizeUnit,
  GSM
}: ProductTitleWithPriceProps) {
  const derivedPrice = contains ? (offeredPrice / contains).toFixed(2) : undefined;
  const isDiscounted = offeredPrice < sellingPrice;
  const discount = isDiscounted ? Math.round(100 * (sellingPrice - offeredPrice) / sellingPrice) : 0;
  const isDesktop = useMediaQuery('(min-width:600px)');

  return (
    <Box>
      <Typography
        sx={{
          fontSize: isDesktop ? '1.85rem' : '1.15rem',
          lineHeight: 1.3,
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      <Typography
        color="text.primary"
        sx={{
          fontSize: isDesktop ? '1.2rem' : '0.75rem',
          mt: -0.5,
          mb: 0.5,
        }}
      >
        {size}  • {GSM} • {selectedUnit} • {printVariant}
      </Typography>

      <Typography
        color="text.primary"
        sx={{
          mt: 0.75,
          mb: 1,
          fontSize: {
            xs: '0.65rem',
            sm: '0.85rem',
            md: '1rem',
          },
        }}
      >
        {(Array.isArray(usecases) && usecases.length > 0)
          ? usecases.join(', ')
          : 'Explore our range of eco-friendly products'}
      </Typography>

      <AnimatePresence mode="wait">
        <motion.div
          key={`priceStack-${offeredPrice}-${sellingPrice}-${discount}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 0.5, flexWrap: 'wrap', lineHeight: 1.2 }}
          >
            <Typography
              fontWeight={700}
              color="success.main"
              sx={{
                fontSize: isDesktop ? '2rem' : '1rem',
                lineHeight: 1,
              }}
            >
              ₹{offeredPrice}
            </Typography>

            {isDiscounted && (
              <Typography
                sx={{
                  textDecoration: 'line-through',
                  fontSize: isDesktop ? '1.5rem' : '0.9rem',
                  mt: '1px',
                }}
              >
                ₹{sellingPrice}
              </Typography>
            )}

            {isDiscounted && (
              <Chip
                label={`-${discount}%`}
                size="small"
                sx={{
                  bgcolor: '#d32f2f',
                  color: '#fff',
                  fontWeight: 500,
                  borderRadius: 1.5,
                  fontSize: isDesktop ? '1.25rem' : '0.75rem',
                  height: 22,
                  px: 0.5,
                }}
              />
            )}
          </Stack>
        </motion.div>
      </AnimatePresence>

      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontSize: isDesktop ? '1.15rem' : '0.75rem' }}
        >
          Approx.&nbsp;
          <AnimatePresence mode="wait">
            <motion.span
              key={`derivedPrice-${derivedPrice}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              style={{
                display: 'inline-block',
                backgroundColor: '#e8f5e9',
                color: '#1b5e20',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '12px',
                fontSize: isDesktop ? '1rem' : '0.7rem',
              }}
            >
              ₹{derivedPrice}
            </motion.span>
          </AnimatePresence>
          &nbsp;per {containsLabel || 'unit'}
          {selectedUnit === 'Kg' && ` (${contains} ${containsLabel}s per ${selectedUnit})`}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 0.75,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        {/* Left content */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontSize: isDesktop ? '1.1rem' : '0.7rem' }}
          >
            MOQ:
            <Box component="span" sx={{ fontWeight: 'bold', display: 'inline' }}>
              {selectedUnit}
            </Box>
            (s)
          </Typography>

         
            <Typography
              variant="caption"
              color="primary"
              sx={{
              fontSize: isDesktop ? '1.1rem' : '0.7rem',
              textDecoration: 'underline dotted',
              textUnderlineOffset: '2px',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              }}
            >
             🔖Bulk Orders? WhatsApp!
              <WhatsApp sx={{ fontSize: isDesktop ? 16 : 14, verticalAlign: 'middle', color: '#388e3c' }} color="success" />

            </Typography>
          
        </Box>


  {/* Right label when CM is active */}



  {/* Toggle Button Right */}
 <Box
  onClick={toggleSizeUnit}
  sx={{
    width: 44,
    height: 20,
    borderRadius: '999px',
    bgcolor: sizeUnit === 'IN' ? '#4caf50' : '#4caf50',
    position: 'relative',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    px: '2px',
  
    // transition: 'all 0.3s ease-in-out',
  }}
>
  {/* Text Label */}
  <Typography
    variant="caption"
    sx={{
      color: '#fff',
      fontWeight: 700,
      fontSize: '0.70rem',
      zIndex: 2,
      ml: sizeUnit === 'IN' ? '25px' : 'auto',
      mr: sizeUnit === 'CM' ? '21px' : 'auto',
    }}
  >
    {sizeUnit.toUpperCase()}
  </Typography>

  {/* White Toggle Ball */}
  <Box
    sx={{
      position: 'absolute',
      top: '0px',
      left: sizeUnit === 'IN' ? '1px' : 'calc(100% - 21px)',
      width: 20,
      height: 20,
      borderRadius: '50%',
      bgcolor: '#fff',
      transition: 'left 0.3s ease-in-out',
    }}
  />
</Box>

  </Box>








</Box>
  
  );
}
