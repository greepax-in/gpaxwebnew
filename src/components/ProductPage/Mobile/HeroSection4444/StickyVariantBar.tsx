// components/ProductPage/StickyVariantBar.tsx
'use client';

import React from 'react';
import { Box, Chip, Typography } from '@mui/material';

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
        bgcolor: '#ffffff',
        border: '1px solid #ddd',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
        zIndex: 10,
        px: 2,
        py: 2,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        // mx: 'auto',
        marginTop: -1.5,
      }}
    >
      {variantRows.map(({ icon, label, data, selected, onClick }) => (
        <Box
          key={label}
          sx={{
            display: 'grid',
            gridTemplateColumns: '64px 1fr',
            alignItems: 'center',
            rowGap: 1,
          }}
        >
          <Typography
            variant="body2"
            fontWeight={600}
            color="text.secondary"
            sx={{ display: 'flex',  alignItems: 'center', gap: 0.5 }}
          >
            {icon} {label}:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {data.map((val) => (
              <Chip
                key={val}
                label={val}
                size="small"
                onClick={() => onClick(val)}
                sx={{
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  px: 1,
                  py: 0.5,
                  transition: 'all 0.2s ease-in-out',
                  transform: selected === val ? 'scale(1.03)' : 'scale(1)',
                  bgcolor: selected === val ? 'primary.main' : 'transparent',
                  border: selected === val ? 'none' : '1px solid #cfcfcf',
                  color: selected === val ? '#fff' : 'text.primary',
                  boxShadow: selected === val
                    ? '0 4px 10px rgba(0,0,0,0.15)'
                    : '0 1px 2px rgba(0,0,0,0.05)',
                  '&:hover': {
                    bgcolor: selected === val ? 'primary.dark' : '#f0f0f0',
                    borderColor: '#bbb',
                    cursor: 'pointer',
                  },
                }}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default StickyVariantBar;
