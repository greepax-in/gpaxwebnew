'use client';

import React from 'react';
import { Chip } from '@mui/material';

type ChipSize = 'small' | 'medium';

const sizeStyles = {
  small: {
    height: 28,
    px: 1.5,
    fontSize: '0.80rem',
    fontWeight: 700,
  },
  medium: {
    height: 32,
    px: 2,
    fontSize: '0.85rem',
  },
};

const paperColors: Record<string, { bg: string; color: string }> = {
  Kraft: { bg: '#c9b392ff', color: '#110a02ff' },
  White: { bg: '#F3F4F6', color: '#333' },
};

export default function PaperVariantChip({
  label,
  size = 'medium',
}: {
  label: string;
  size?: ChipSize;
}) {
  const style = paperColors[label] || { bg: '#eee', color: '#fff' };
  const chipStyle = sizeStyles[size];

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
