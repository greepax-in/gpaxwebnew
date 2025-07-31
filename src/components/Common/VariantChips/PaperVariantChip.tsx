'use client';

import React from 'react';
import { Chip } from '@mui/material';

type ChipSize = 'small' | 'medium';

const sizeStyles = {
  small: {
    height: 28,
    px: 1.5,
    fontSize: '0.75rem',
  },
  medium: {
    height: 32,
    px: 2,
    fontSize: '0.85rem',
  },
};

const paperColors: Record<string, { bg: string; color: string }> = {
  Kraft: { bg: '#E0C9A6', color: '#3E2F1C' },
  White: { bg: '#F3F4F6', color: '#333' },
};

export default function PaperVariantChip({
  label,
  size = 'medium',
}: {
  label: string;
  size?: ChipSize;
}) {
  const style = paperColors[label] || { bg: '#eee', color: '#333' };
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
