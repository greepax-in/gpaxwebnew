'use client';

import React from 'react';
import { Box, Typography, Stack, Divider } from '@mui/material';
import { ProductType } from '../../types/products';

type Props = {
  product: ProductType;
};

const ProductDetails = ({ product }: Props) => {
  const hasHighlights = product.highlights?.length > 0;
  const hasDescription = Boolean(product.description);

  if (!hasHighlights && !hasDescription) return null;

  return (
    <Box mt={6}>
      {hasDescription && (
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Description
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {product.description}
          </Typography>
        </Box>
      )}

      {hasHighlights && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Key Features
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Stack spacing={1} component="ul" sx={{ pl: 2 }}>
            {product.highlights.map((item, index) => (
              <li key={index}>
                <Typography variant="body2" color="text.primary">
                  {item}
                </Typography>
              </li>
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default ProductDetails;
