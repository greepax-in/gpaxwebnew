'use client';

import React from 'react';
import { Box, Typography, Stack, Divider, useMediaQuery, Grid } from '@mui/material';
import { ProductType } from '../../types/itemTypes';

type Props = {
  product: ProductType;
};

const ProductDetails = ({ product }: Props) => {
  const hasHighlights = product.highlights?.length > 0;
  const hasDescription = Boolean(product.description);
  const isMobile = useMediaQuery('(max-width:600px)');

  if (!hasHighlights && !hasDescription) return null;

  return (
    <Box mt={8} px={isMobile ? 2 : 0}>
      {/* Description Section */}
      {hasDescription && (
        <Box component="section" id="description" mb={6}>
          <Typography variant="h6" gutterBottom>
            📝 Description
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {product.description}
          </Typography>
        </Box>
      )}

      {/* Highlights Section */}
      {hasHighlights && (
        <Box component="section" id="highlights">
          <Typography variant="h6" gutterBottom>
            🌟 Highlights
          </Typography>
          <Divider sx={{ mb: 3 }} />

          {isMobile ? (
            // Mobile: stacked list with emojis inline
            <Stack
              spacing={1.5}
              component="ul"
              sx={{
                pl: 2,
                '& li': {
                  listStyle: 'disc',
                  ml: 1,
                },
              }}
            >
              {product.highlights.map((item, index) => (
                <li key={index}>
                  <Typography variant="body2" color="text.primary">
                    {item}
                  </Typography>
                </li>
              ))}
            </Stack>
          ) : (
            // Desktop: 2-column layout with aligned emojis
            <Grid container spacing={1.5} component="ul" sx={{ pl: 0, mt: 1 }}>
              {product.highlights.map((item, index) => (
                <Grid
                  size={{ xs: 12, sm: 6, md: 6 }}
                  key={index}
         
              
                  component="li"
                  sx={{
                    listStyle: 'none',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 1,
                    pl: 0,
                    mb: 1,
                  }}
                >
                  <Typography variant="body2" color="text.primary">
                    {item}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ProductDetails;
