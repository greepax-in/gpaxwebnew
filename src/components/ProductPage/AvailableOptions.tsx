'use client';

import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import PrintVariantChip from '@/components/Common/VariantChips/PrintVariantChip';
import PaperVariantChip from '@/components/Common/VariantChips/PaperVariantChip';

import { ItemType } from '../../types/itemTypes';


type Props = {
  product: ItemType;
};

const AvailableOptions = ({ product }: Props) => {
  const hasPrintVariants = product.printVariants?.length > 0;
  const hasPaperVariants = product.paperVariant?.length > 0;

  if (!hasPrintVariants && !hasPaperVariants) return null;

  return (
    <Box mt={0}>


      {hasPrintVariants && (
        <Box mb={3}>
          <Typography variant="subtitle1" gutterBottom>
            Print Variants
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {product.printVariants.map((variant, i) => (
              <PrintVariantChip key={i} label={variant.trim()} size="medium" />
            ))}
          </Stack>
        </Box>
      )}

      {hasPaperVariants && (
        <Box>
          <Typography variant="subtitle1" gutterBottom>
            Paper Variants
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {product.paperVariant.map((variant, i) => (
              <PaperVariantChip key={i} label={variant.trim()} size="medium" />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

export default AvailableOptions;
