'use client';

import React from 'react';
import { Box, Typography, Grid, useMediaQuery } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { ItemType } from '../../types/itemTypes';

type Props = {
  product: ItemType;
};

const UseCases = ({ product }: Props) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const useCases = product?.usecases ?? [];

  if (!useCases.length) return null;

  return (
    <Box id="use-cases" component="section" mt={8} px={isMobile ? 2 : 0}>
      <Typography variant="h6" gutterBottom display="flex" alignItems="center">
        <Box component="span" mr={1}>🧩</Box> Use Cases
      </Typography>

      <Grid container spacing={2} mt={1}>
        {useCases.map((useCase, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 1,
                p: 2,
                borderRadius: 2,
                bgcolor: '#f9f9f9',
                height: '100%',
              }}
            >
              <CheckCircleIcon color="success" sx={{ mt: 0.5 }} />
              <Typography variant="body1" sx={{ color: '#333' }}>
                {useCase}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default UseCases;
