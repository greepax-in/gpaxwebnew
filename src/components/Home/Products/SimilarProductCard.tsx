'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import PaperVariantChip from '@/components/Common/VariantChips/PaperVariantChip';
import PrintVariantChip from '@/components/Common/VariantChips/PrintVariantChip';

export type ProductCardProps = {
  name: string;
  image: string;
  offeredPrice?: number;
  sellingPrice?: number;
  printVariants?: string[];
  paperVariants?: string[];
  link?: string;
};

export default function SimilarProductCard({
  name,
  image,
  offeredPrice,
  sellingPrice,
  printVariants,
  paperVariants,
  link,
}: ProductCardProps) {
  // const isMobile = useMediaQuery('(max-width:600px)');

  const card = (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        bgcolor: '#fff',
        borderRadius: 2,
        boxShadow: 3,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
      }}
    >
      {/* Image */}
      <Box
        component="img"
        src={image}
        alt={name}
        sx={{
          width: '100%',
          height: 180,
          objectFit: 'contain',
          bgcolor: '#f5f5f5',
        }}
      />

      {/* Content */}
      <Box sx={{ p: 2, flex: 1 }}>
        {/* Name */}
        <Typography
          variant="subtitle1"
          fontWeight={600}
          gutterBottom
          sx={{
            fontSize: '0.95rem',
            lineHeight: 1.3,
            minHeight: 48,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {name}
        </Typography>

        {/* Paper & Print Variant Chips in same row */}
        {(paperVariants && paperVariants.length > 0) || (printVariants && printVariants.length > 0) ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1.2 }}>
            {printVariants && printVariants.length > 0 &&
              printVariants.map((v, i) => (
                <PrintVariantChip key={`print-${i}`} label={v} size="small" />
              ))}
            {paperVariants && paperVariants.length > 0 &&
              paperVariants.map((v, i) => (
                <PaperVariantChip key={`paper-${i}`} label={v} size="small" />
              ))}

          </Box>
        ) : null}

        {/* Price */}
        {offeredPrice && (
          <Box
            sx={{
              px: 1.5,
              py: 0.5,
              background: 'linear-gradient(135deg, #0f9d58, #1e88e5)',
              color: '#fff',
              borderRadius: '20px',
              display: 'inline-flex',
              alignItems: 'center',
              fontWeight: 700,
              fontSize: '0.9rem',
            }}
          >
            ₹{offeredPrice}
            {sellingPrice && (
              <Typography
                component="span"
                sx={{
                  ml: 1,
                  textDecoration: 'line-through',
                  fontSize: '0.85rem',
                  color: 'rgba(255,255,255,0.85)',
                  fontWeight: 400,
                }}
              >
                ₹{sellingPrice}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );

  return link ? (
    <Link href={link} style={{ textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
      {card}
    </Link>
  ) : (
    card
  );
}
