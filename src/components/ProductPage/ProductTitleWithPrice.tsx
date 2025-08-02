'use client';

import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';

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
  currencySymbol?: string; // Retained for currency display
}

export default function ProductTitleWithPrice({
  title,
  subtitle,
  size,
  offeredPrice,
  sellingPrice,
  currencySymbol = '₹',
  contains,
  containsLabel,
  selectedUnit,
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
        {title} {size && `- ${size}`}
      </Typography>
      {subtitle && (
        <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
          {subtitle}
        </Typography>
      )}

      <Stack direction="row" alignItems="center" spacing={1}>
        <Typography variant={deviceType === 'desktop' ? 'h5' : 'body1'} fontWeight={700} color="success.main">
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
            size="small"
            sx={{ bgcolor: '#d32f2f', color: '#fff', fontWeight: 500, borderRadius: '16px' }}
          />
        )}
        </Stack>
        {(selectedUnit === 'Kg') ? (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Approx. {derivedPrice} per {containsLabel || 'unit'} ({contains} {containsLabel}s per {selectedUnit})
              {/* ({contains} per {size || 'unit'}) */}
            </Typography>
          </Box>
        ) : (
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Approx. ₹{derivedPrice} per {containsLabel || 'unit'} 
              {/* If containsLabel is not provided, it defaults to 'unit' */}
            </Typography>
          </Box>
        )}

    </Box>
  );

