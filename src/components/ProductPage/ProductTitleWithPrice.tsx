'use client';

import React from 'react';
import { Box, Typography, Chip, Stack } from '@mui/material';

interface ProductTitleWithPriceProps {
  title: string;
  size?: string;
  offeredPrice?: number;
  sellingPrice: number;
  currencySymbol?: string;
  deviceType?: 'mobile' | 'desktop';
}

export default function ProductTitleWithPrice({
  title,
  size,
  offeredPrice,
  sellingPrice,
  currencySymbol = '₹',
  deviceType = 'mobile',
}: ProductTitleWithPriceProps) {
  const isDiscounted =
    typeof offeredPrice === 'number' && offeredPrice > sellingPrice;

  const discount = isDiscounted
    ? Math.round(((offeredPrice - sellingPrice) / offeredPrice) * 100)
    : 0;

  // 🔧 Centralized style configuration
  const styleConfig = {
    mobile: {
      titleVariant: 'h6',
      priceVariant: 'h6',
      marginTop: 1,
      marginBottom: 1,
      marginLeft: 0,
      marginRight: 0,
      paddingX: 1,
      stackMarginTop: 0.5,
      stackSpacing: 1,
    },
    desktop: {
      titleVariant: 'h5',
      priceVariant: 'h5',
      marginTop: 5,
      marginBottom: 2,
      marginLeft: -2,
      marginRight: 1,
      paddingX: 2,
      stackMarginTop: 1,
      stackSpacing: 1.5,
    },
  };

  const styles = styleConfig[deviceType];

  return (
    <Box
      sx={{
        mt: styles.marginTop,
        mb: styles.marginBottom,
        ml: styles.marginLeft,
        mr: styles.marginRight,
        px: styles.paddingX,
      }}
    >
      <Typography
        variant={styles.titleVariant as any}
        fontWeight={600}
        lineHeight={1.3}
      >
        {title}
        {size ? ` - ${size}` : ''}
      </Typography>

      <Stack
        direction="row"
        spacing={styles.stackSpacing}
        alignItems="center"
        mt={styles.stackMarginTop}
      >
        <Typography
          variant={styles.priceVariant as any}
          fontWeight={600}
          color="success.main"
        >
          {currencySymbol}
          {sellingPrice}
        </Typography>

        {isDiscounted && (
          <>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                textDecoration: 'line-through',
              }}
            >
              {currencySymbol}
              {offeredPrice}
            </Typography>

            <Chip
              label={`-${discount}%`}
              size="small"
              sx={{
                bgcolor: '#c62828',
                color: '#fff',
                fontSize: '0.75rem',
                height: 22,
                borderRadius: 1,
                px: 1,
              }}
            />
          </>
        )}
      </Stack>
    </Box>
  );
}
