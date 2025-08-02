'use client';

import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

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
}

export default function ProductTitleWithPrice({
  title,
  subtitle,
  size,
  offeredPrice,
  sellingPrice,
  // currencySymbol = '₹',
  contains,
  containsLabel,
  selectedUnit,
  // MOQ,
  deviceType = 'mobile',
}: ProductTitleWithPriceProps) {
    const derivedPrice = contains
    ? (offeredPrice / contains).toFixed(2)
    : undefined;
  const isDiscounted = offeredPrice < sellingPrice;
  const discount = isDiscounted ? Math.round(100 * (sellingPrice - offeredPrice) / sellingPrice) : 0;
  return (
    <Box>
      <Typography
        variant={deviceType === 'desktop' ? 'h4' : 'h6'}
        fontWeight={700}
        sx={{ mb: 0.5 }}
      >
        {title} {size && `- ${size}`} - {selectedUnit ? selectedUnit : 'Unit'}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary" sx={{ fontSize: 15, mt:-1, mb: 1 }}>
          {subtitle}
        </Typography>
      )}

 <AnimatePresence mode="wait">
  <motion.div
    key={`priceStack-${offeredPrice}-${sellingPrice}-${discount}`}
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.25 }}
  >
    <Stack direction="row" alignItems="center" spacing={1}>
      <Typography variant={deviceType === 'desktop' ? 'h5' : 'h5'} fontWeight={700} color="success.main">
        ₹{offeredPrice}
      </Typography>

      {isDiscounted && (
        <Typography variant="body1" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
          ₹{sellingPrice}
        </Typography>
      )}

      {isDiscounted && (
        <Chip
          label={`-${discount}%`}
          size="medium"
          sx={{
            bgcolor: '#d32f2f',
            color: '#fff',
            fontWeight: 500,
            borderRadius: '16px',
            fontSize: '15px',
            height: '20px',
          }}
        />
      )}
    </Stack>
  </motion.div>
</AnimatePresence>

  <Box>
<Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
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
        fontSize: '0.875rem',
      }}
    >
      ₹{derivedPrice}
    </motion.span>
  </AnimatePresence>
  &nbsp;per {containsLabel || 'unit'}
  {selectedUnit === 'Kg' && ` (${contains} ${containsLabel}s per ${selectedUnit})`}
</Typography>

</Box>
      {/* <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          MOQ - {MOQ} {selectedUnit === 'Kg' ? 'Kg' : containsLabel}(s)
        </Typography>
      </Box> */}
    </Box>
  );
}
