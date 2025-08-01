'use client';

import React from 'react';
import { Box, Typography, Divider, Tooltip, useMediaQuery } from '@mui/material';
import Image from 'next/image';
import { ItemType } from '@/types/itemTypes';

interface Props {
  product: ItemType;
}

export default function TrustedBy({ product }: Props) {
  const isMobile = useMediaQuery('(max-width:600px)');

  if (!product.customers || product.customers.length === 0) return null;

  return (
    <Box component="section" id="trusted-by" mt={8} px={isMobile ? 2 : 0}>
      <Typography
        variant="h6"
        gutterBottom
        display="flex"
        alignItems="center"
      >
        <Box component="span" mr={1}>🤝</Box>
        Trusted By
      </Typography>

      <Divider sx={{ mb: 3 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: 'repeat(3, 1fr)',
            sm: 'repeat(4, 1fr)',
            md: 'repeat(5, 1fr)',
          },
          gap: 2,
          alignItems: 'center',
        }}
      >
        {product.customers.map((customer, index) => (
          <Tooltip title={customer.name} key={index} arrow>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: 60,
              }}
            >
              <Image
                src={customer.logo}
                alt={customer.alt || customer.name}
                width={100}
                height={40}
                style={{ objectFit: 'contain' }}
              />
            </Box>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
}
