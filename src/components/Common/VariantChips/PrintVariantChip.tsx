'use client';

import React from 'react';
import { Chip, Box } from '@mui/material';

type ChipSize = 'small' | 'medium';

const sizeStyles = {
  small: {
    height: 28,
    px: 1.5,
    fontSize: '0.75rem',
  },
  medium: {
    height: 35,
    px: 2,
    fontSize: '0.95rem',
  },
};

const printColors: Record<
  string,
  { bg: string; color: string; isGradient?: boolean }
> = {
  plain: { bg: '#b4b5b4', color: '#333' },
  '1-color': { bg: '#5f02b0', color: '#fff' },
  'multi color': {
    bg: 'linear-gradient(135deg, #5f02b0, #f3a42f)',
    color: '#fff',
    isGradient: true,
  },
};

export default function PrintVariantChip({
  label,
  size = 'medium',
}: {
  label: string;
  size?: ChipSize;
}) {
  const normalizedLabel = label.trim().toLowerCase().replace(/\s+/g, ' ');
  const style = printColors[normalizedLabel] || {
    bg: '#eee',
    color: '#333',
    isGradient: false,
  };
  const chipStyle = sizeStyles[size];

  if (style.isGradient) {
    return (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: chipStyle.height,
          px: chipStyle.px,
          borderRadius: '24px',
          background: style.bg,
          color: style.color,
          fontSize: chipStyle.fontSize,
          fontWeight: 500,
          lineHeight: 1,
        }}
      >
        {label}
      </Box>
    );
  }

  return (
    <Chip
      label={label}
      sx={{
        height: chipStyle.height,
        fontSize: chipStyle.fontSize,
        px: chipStyle.px,
        backgroundColor: style.bg,
        color: style.color,
        fontWeight: 500,
      }}
    />
  );
}
