'use client';

import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
// import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
// import FactoryIcon from '@mui/icons-material/Factory';
// import StorefrontIcon from '@mui/icons-material/Storefront';
// import UseCases from './UseCases';
import { useMediaQuery } from '@mui/material';

interface ProductTitleWithPriceProps {
  title: string;
  subtitle?: string;
  size?: string;
  contains?: number; // Optional, used for derived price calculation,
  containsLabel?: string; // Optional, label for the contains field
  offeredPrice: number;
  sellingPrice: number;
  selectedUnit?: string; // Optional, used for displaying selected unit
  deviceType?: 'mobile' | 'desktop';
  MOQ: number; // Minimum Order Quantity
  currencySymbol?: string; // Retained for currency display
  printVariant?: string; // Optional, used for print variant display
  features?: string[]; // Optional, used for displaying product features
  usecases?: string[]; // Optional, used for displaying product use cases
}

export default function ProductTitleWithPrice({
  title,
  // subtitle,
  size,
  offeredPrice,
  sellingPrice,
  // currencySymbol = '₹',
  contains,
  containsLabel,
  selectedUnit,
  MOQ,
  deviceType = 'mobile',
  printVariant,
  // features = [],
  usecases = [],
}: ProductTitleWithPriceProps) {
  const derivedPrice = contains
    ? (offeredPrice / contains).toFixed(2)
    : undefined;
  const isDiscounted = offeredPrice < sellingPrice;
  const discount = isDiscounted ? Math.round(100 * (sellingPrice - offeredPrice) / sellingPrice) : 0;
  const isDesktop = useMediaQuery('(min-width:600px)');
  console.log('usecases:', usecases);
  return (
    <Box>

      <Typography
        fontSize={isDesktop ? '1.85rem' : '1.15rem'}
        lineHeight={1.3}
        sx={{ mb: 0.5 }}
      >
        {title}
      </Typography>

      <Typography
        fontSize={isDesktop ? '1.2rem' : '0.75rem'}
        color="text.secondary"
        sx={{ mt: -0.5, mb: 0.5 }}
      >
        {size} • {selectedUnit} • {printVariant}
      </Typography>

      <Typography
        color="text.secondary"
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
            sx={{
              mb: 0.5,
              flexWrap: 'wrap',
              lineHeight: 1.2,
            }}
          >
            {/* Offered Price */}
            <Typography
              fontWeight={700}
              fontSize={typeof window !== 'undefined' && window.innerWidth >= 600 ? '2rem' : '1rem'}
              color="success.main"
              lineHeight={1}
            >
              ₹{offeredPrice}
            </Typography>

            {/* Strikethrough Price */}
            {isDiscounted && (
              <Typography
                // fontSize="0.9rem"
                fontSize={typeof window !== 'undefined' && window.innerWidth >= 600 ? '1.50rem' : '0.9rem'}
                sx={{
                  textDecoration: 'line-through',
                  mt: '1px',
                }}
              >
                ₹{sellingPrice}
              </Typography>
            )}

            {/* Discount Chip */}
            {isDiscounted && (
              <Chip
                label={`-${discount}%`}
                size="small"
                sx={{
                  bgcolor: '#d32f2f',
                  color: '#fff',
                  fontWeight: 500,
                  borderRadius: 1.5,
                  fontSize:
                    typeof window !== 'undefined' && window.innerWidth >= 600
                      ? '1.25rem'
                      : '0.75rem',
                  height: 22,
                  px: 0.5,
                }}
              />
            )}
          </Stack>
        </motion.div>
      </AnimatePresence>


      <Box>
        <Typography variant="body2" color="text.secondary" fontSize={typeof window !== 'undefined' && window.innerWidth >= 600 ? '1.15rem' : '0.75rem'}>
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
                fontSize:
                  typeof window !== 'undefined' && window.innerWidth >= 600
                    ? '1rem'
                    : '0.7rem',
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
          justifyContent: 'left',
          alignItems: 'center',
          gap: 1,
          mt: 0.5,
          px: 0,
          whiteSpace: 'nowrap', // enforce single-line
          overflowX: 'auto',     // prevent breaking on small screens
          // fontSize: typeof window !== 'undefined' && window.innerWidth >= 600 ? '3rem' : '0.7rem',
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: typeof window !== 'undefined' && window.innerWidth >= 600 ? '1.1rem' : '0.7rem',
          }}
        >
          MOQ:&nbsp;
          <Box component="span" sx={{ fontWeight: 'bold', display: 'inline' }}>
            {selectedUnit}
          </Box>

        </Typography>


        {/* Optional CTA for B2B */}
        {MOQ >= 500 && (
          <Typography
            variant="caption"
            color="primary"

            sx={{
              fontSize: typeof window !== 'undefined' && window.innerWidth >= 600 ? '1.1rem' : '0.7rem',
              whiteSpace: 'nowrap',
              textDecoration: 'underline dotted',
              textUnderlineOffset: '2px',
              cursor: 'pointer',
            }}
          >
            🔖More units, less cost — let’s chat!
          </Typography>
        )}
      </Box>


    </Box>
  );
}
