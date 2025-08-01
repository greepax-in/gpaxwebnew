// components/ProductPage/StickyVariantBar.tsx
'use client';

import React from 'react';
import { Box, Chip, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

interface StickyVariantBarProps {
  sizes: string[];
  selectedSize: string;
  onSizeSelect: (size: string) => void;
  qtyOptions: string[];
  selectedQty: string;
  onQtySelect: (qty: string) => void;
  unitOptions: string[];
  selectedUnit: string;
  onUnitSelect: (unit: string) => void;
}

const StickyVariantBar = ({
  sizes,
  selectedSize,
  onSizeSelect,
  qtyOptions,
  selectedQty,
  onQtySelect,
  unitOptions,
  selectedUnit,
  onUnitSelect,
}: StickyVariantBarProps) => {
  const theme = useTheme();
  const variantRows = [
    {
      icon: '📏',
      label: 'Size',
      data: sizes,
      selected: selectedSize,
      onClick: onSizeSelect,
    },
    {
      icon: '📦',
      label: 'Qty',
      data: qtyOptions,
      selected: selectedQty,
      onClick: onQtySelect,
    },
    {
      icon: '📐',
      label: 'Unit',
      data: unitOptions,
      selected: selectedUnit,
      onClick: onUnitSelect,
    },
  ];

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        bgcolor: theme.palette.mode === 'light' ? '#f8f9fb' : '#1c1c1e',
        zIndex: 10,
        px: 2,
        py: 2,
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        width: '100%',
        maxWidth: 420,
        mx: 'auto',
      }}
    >
      {variantRows.map(({ icon, label, data, selected, onClick }) => (
        <Box key={label}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography
              variant="body2"
              fontWeight={500}
              color="text.secondary"
              sx={{ minWidth: 56 }}
            >
              {icon} {label}:
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {data.map((val) => (
              <motion.div
                key={val}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Chip
                  label={val}
                  size="medium"
                  onClick={() => onClick(val)}
                  color={selected === val ? 'primary' : 'default'}
                  sx={{
                    borderRadius: 3,
                    fontWeight: 500,
                    px: 2,
                    height: 36,
                    fontSize: '0.8rem',
                    bgcolor: selected === val ? theme.palette.primary.main : '#f0f0f0',
                    color: selected === val ? '#fff' : '#444',
                    transition: 'all 0.2s ease-in-out',
                    boxShadow: selected === val ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                  }}
                />
              </motion.div>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default StickyVariantBar;
