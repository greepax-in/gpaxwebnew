'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Button,
  // useMediaQuery,

  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from 'next/image';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PrintVariantChip from '@/components/Common/VariantChips/PrintVariantChip';
import PaperVariantChip from '@/components/Common/VariantChips/PaperVariantChip';
// import useIsMobile from '@/components/Common/isMobile';

import { motion } from 'framer-motion';
import items from '@/data/items.json';
import { ItemType } from '@/types/itemTypes';



// const product: ItemType = items[0];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 8 },
  visible: { opacity: 1, x: 0 },
};

export default function ProductPage({ product }: { product: ItemType }) {
  // const isMobile = useMediaQuery('(max-width:600px)');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [mainImage, setMainImage] = useState(() =>
    product.sizeImages?.[selectedSize]?.[0] ||
    product.featuredImage ||
    product.productImages?.[0] || ''
  );
  const [offeredPrice, setOfferedPrice] = useState(() =>
    product.sizePrices?.[selectedSize] || product.offeredPrice
  );
  const [sellingPrice, setSellingPrice] = useState(() => product.sellingPrice);

  useEffect(() => {
    setMainImage(
      product.sizeImages?.[selectedSize]?.[0] ||
      product.featuredImage ||
      product.productImages?.[0] || ''
    );
    setOfferedPrice(
      product.sizePrices?.[selectedSize] || product.offeredPrice
    );
    setSellingPrice(product.sellingPrice);
  }, [selectedSize, product]);

  return (
    <Box sx={{ p: 0, mt: '0vh', maxWidth: 480, mx: 'auto' }}>
      <Box
        sx={{
          position: 'relative',
          width: '100vw',
          left: '50%',
          right: '50%',
          mx: '-50vw',
          aspectRatio: '1 / 1.2',
          my: 2,
          border: '2px solid #e0e0e0',
          borderRadius: '18px',
          overflow: 'hidden',
          height: '40vh',
        }}
      >
        <Image
          src={mainImage}
          alt="Product"
          fill
          style={{ objectPosition: '20%' }}
        />

        {/* Thumbnails overlay, left 50%, top, clearly visible, changes with size variant */}
        {Array.isArray(product.sizeImages?.[selectedSize]) && product.sizeImages[selectedSize].length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              left: '2%',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              zIndex: 2,
              background: 'rgba(255,255,255,0.85)',
              borderRadius: 2,
              boxShadow: 2,
              p: 1,
            }}
          >
            {product.sizeImages[selectedSize].map((thumb: string, idx: number) => (
              <Box
                key={thumb + idx}
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: thumb === mainImage ? '2px solid #1976d2' : '2px solid #e0e0e0',
                  boxShadow: thumb === mainImage ? '0 0 0 2px #1976d2' : 'none',
                  cursor: 'pointer',
                  background: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'border 0.2s',
                }}
                onClick={() => setMainImage(thumb)}
              >
                <Image src={thumb} alt={`Thumbnail ${idx + 1}`} width={44} height={44} style={{ objectFit: 'cover' }} />
              </Box>
            ))}
          </Box>
        )}

        <Stack direction="row" spacing={1} position="absolute" bottom={8} right={8}>
          {product.printVariants?.map((pv, idx) => (
            <PrintVariantChip key={pv + idx} label={pv} size="small" />
          ))}
          {product.paperVariant?.map((pv, idx) => (
            <PaperVariantChip key={pv + idx} label={pv} size="small" />
          ))}
        </Stack>
      </Box>

      <Typography variant="h6" fontWeight={700} mb={0.5}>
        {product.name} -  {selectedSize} 
      </Typography>

<Typography variant="subtitle2" color="text.secondary">
  {product.SubTitle}
</Typography>

      <Stack direction="row" alignItems="center" spacing={1} mb={1}>
        <Typography variant="subtitle1" fontWeight={800} color="text.primary" fontSize="1.5rem">
         ₹{offeredPrice}
        </Typography>
        {sellingPrice > offeredPrice && (
          <>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ textDecoration: 'line-through' }}
            >
              ₹{sellingPrice}
            </Typography>
            <Chip
              label={`-${Math.round(((sellingPrice - offeredPrice) / sellingPrice) * 100)}%`}
              size="small"
              color="success"
            />
          </>
        )}
        <Typography variant="caption" color="text.secondary">
          / {product.units?.[0] || 'unit'}
        </Typography>
      </Stack>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Select Size (in inches)
      </Typography>
      <Stack direction="row" spacing={1} justifyContent="center" flexWrap="wrap" mb={2}>
        {product.sizes?.map((size) => (
          <Chip
            key={size}
            label={size}
            onClick={() => setSelectedSize(size)}
            color={size === selectedSize ? 'primary' : 'default'}
          />
        ))}
      </Stack>

      <Typography variant="body2" fontWeight={500} color="text.secondary" mb={1}>
        📦 MOQ: {product.minimumQuantities?.[0]} | 🏬 {product.industry}
      </Typography>

      <Box
        component={motion.div}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1, pr: 2 }}
      >
        {Array.isArray(product.visualFeatures) &&
          product.visualFeatures.map((feature, idx) => (
            <Box
              key={idx}
              component={motion.div}
              variants={itemVariants}
              sx={{
                display: 'flex',
                alignItems: 'center',
                fontSize: '0.875rem',
                color: 'text.secondary',
                whiteSpace: 'nowrap',
              }}
            >
              <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary">
                {feature.label}
              </Typography>
            </Box>
          ))}
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        🚚 Shipping Extra, Delivery Across India
      </Typography>

      <Button
        fullWidth
        variant="contained"
        color="success"
        startIcon={<WhatsAppIcon />}
        href={`https://wa.me/919999999999?text=I am interested in ${product.name} – ${selectedSize}`}
        target="_blank"
      >
        Order via WhatsApp
      </Button>

      {product.notes?.length && (
        <Accordion sx={{ mb: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="subtitle2">Delivery & Availability</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={1}>
              {product.notes.map((note, idx) => (
                <Typography variant="body2" color="text.secondary" key={idx}>
                  • {note}
                </Typography>
              ))}
            </Stack>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
}
