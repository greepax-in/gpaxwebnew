// HeroSection.tsx

'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  useMediaQuery,
  Chip,
  IconButton,
  Paper,
  Divider,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { motion, AnimatePresence } from 'framer-motion';
// import AvailableOptions from './AvailableOptions';
import { ProductType } from '../../types/itemTypes';
import PrintVariantChip from '@/components/Common/VariantChips/PrintVariantChip';
import PaperVariantChip from '@/components/Common/VariantChips/PaperVariantChip';

type Props = {
  product: ProductType;
};

const HeroSection = ({ product }: Props) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedUnit, setSelectedUnit] = useState(product.units?.[0] || '');
  const [selectedMinQty, setSelectedMinQty] = useState<number>(product.minimumQuantities?.[0] || 0);

  const images = product.sizeImages?.[selectedSize] || product.productImages || [product.featuredImage];
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);
  const handleThumbnailClick = (i: number) => setIndex(i);

  const currentPrice =
    product.variantPrices?.[selectedSize]?.[selectedUnit]?.[selectedMinQty] ||
    product.sizePrices?.[selectedSize] ||
    product.offeredPrice;

  return (
    <Box>
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={4}>
        {/* Left: Image Carousel */}
        <Box flex={1} position="relative">
          <AnimatePresence initial={false} mode="wait">
            <motion.img
              key={images[index]}
              src={images[index]}
              alt={`Product image ${index + 1}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              style={{ width: '100%', height: isMobile ? 280 : 480, objectFit: 'contain', borderRadius: '8px' }}
            />
          </AnimatePresence>
          {images.length > 1 && (
            <Box position="absolute" top="50%" left={0} right={0} display="flex" justifyContent="space-between" px={1}>
              <IconButton onClick={handlePrev}><ChevronLeftIcon /></IconButton>
              <IconButton onClick={handleNext}><ChevronRightIcon /></IconButton>
            </Box>
          )}
          <Stack direction="row" spacing={1} mt={2} justifyContent="center" flexWrap="wrap">
            {images.map((img, i) => (
              <Box
                key={i}
                component="img"
                src={img}
                alt={`thumb-${i}`}
                onClick={() => handleThumbnailClick(i)}
                sx={{ width: 64, height: 64, borderRadius: 1, objectFit: 'cover', border: i === index ? '2px solid #1976d2' : '1px solid #ccc', cursor: 'pointer', transition: 'border 0.3s' }}
              />
            ))}
          </Stack>
        </Box>

        {/* Right: Info */}
        <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">{product.name} {selectedSize && `- ${selectedSize}`}</Typography>
            {/* Stack for Price */}
            <Stack direction="row" alignItems="center" spacing={1} mt={1}>
              <Typography variant="h5" fontWeight="bold" sx={{ color: 'success.main' }}>
                ₹{currentPrice}
              </Typography>
              {product.sellingPrice > currentPrice && (
                <>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ textDecoration: 'line-through' }}
                  >
                    ₹{product.sellingPrice}
                  </Typography>
                  <Chip
                    label={`-${Math.round(
                      100 * (product.sellingPrice - currentPrice) / product.sellingPrice
                    )}%`}
                    size="small"
                    sx={{
                      bgcolor: '#d32f2f',
                      color: '#fff',
                      fontWeight: 500,
                      borderRadius: '16px',
                    }}
                  />
                </>
              )}
            </Stack>


            {/* Configure Your Product Block */}

            <Stack spacing={1} direction="row" mt={1} mb={2} flexWrap="wrap">
              <Chip label="FSC-Certified Paper" color="success" variant="outlined" />
              <Chip label="100% Biodegradable" color="success" variant="outlined" />
              <Chip label="Made in India" color="success" variant="outlined" />
            </Stack>
            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="subtitle2" fontWeight="bold">📏 Size</Typography>
              <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                {product.sizes?.map((size, idx) => (
                  <Chip
                    key={idx}
                    label={size}
                    variant={selectedSize === size ? 'filled' : 'outlined'}
                    onClick={() => {
                      setSelectedSize(size);
                      setIndex(0);
                    }}
                    sx={{ bgcolor: selectedSize === size ? 'primary.main' : 'grey.100', color: selectedSize === size ? '#fff' : 'inherit', fontWeight: 500, borderRadius: 2, px: 2, fontSize: '0.875rem', cursor: 'pointer' }}
                  />
                ))}
              </Stack>

              <Typography variant="subtitle2" fontWeight="bold" mt={2}>⚖️ Units</Typography>
              <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                {product.units?.map((unit, idx) => (
                  <Chip
                    key={idx}
                    label={unit}
                    variant={selectedUnit === unit ? 'filled' : 'outlined'}
                    onClick={() => setSelectedUnit(unit)}
                    sx={{ bgcolor: selectedUnit === unit ? 'primary.main' : 'grey.100', color: selectedUnit === unit ? '#fff' : 'inherit', fontWeight: 500, borderRadius: 2, px: 2, fontSize: '0.875rem', cursor: 'pointer' }}
                  />
                ))}
              </Stack>

              <Typography variant="subtitle2" fontWeight="bold" mt={2}>📦 Min. Qty</Typography>
              <Stack direction="row" spacing={1} mt={1} flexWrap="wrap">
                {product.minimumQuantities?.map((qty, idx) => (
                  <Chip
                    key={idx}
                    label={`${qty}`}
                    variant={selectedMinQty === qty ? 'filled' : 'outlined'}
                    onClick={() => setSelectedMinQty(qty)}
                    sx={{ bgcolor: selectedMinQty === qty ? 'primary.main' : 'grey.100', color: selectedMinQty === qty ? '#fff' : 'inherit', fontWeight: 500, borderRadius: 2, px: 2, fontSize: '0.875rem', cursor: 'pointer' }}
                  />
                ))}
              </Stack>

              {/* Visual Variant Chips */}
              <Stack direction="row" spacing={3} alignItems="center" mt={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight="medium" color="text.secondary">
                    Print
                  </Typography>
                  <PrintVariantChip label={product.printvariants?.[0]} />
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight="medium" color="text.secondary">
                    Paper
                  </Typography>
                  <PaperVariantChip label={product.papervariant?.[0]} />
                </Stack>
              </Stack>
            </Paper>

            {/* Delivery & Trust */}
            <Box sx={{ bgcolor: '#e8f5e9', borderRadius: 2, p: 1.5, mt: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
              <Typography>
                📦 Guaranteed to arrive by <strong>2 Aug</strong> — Free Shipping<br />
                🎁 Get ₹50 voucher if your order arrives late.
              </Typography>
            </Box>



            <Divider sx={{ my: 2 }} />

            {/* WhatsApp CTA */}
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ height: 48, mb: 1 }}
              startIcon={<WhatsAppIcon />}
              href={`https://wa.me/91xxxxxxxxxx?text=I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20${selectedSize} ${selectedUnit} ${selectedMinQty}`}
              target="_blank"
            >
              Chat with us on WhatsApp
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
