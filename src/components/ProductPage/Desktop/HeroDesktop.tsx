// HeroSection.tsx

'use client';

import React, { useState, useEffect } from 'react';
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
import { ItemType } from '@/types/itemTypes';
import PrintVariantChip from '@/components/Common/VariantChips/PrintVariantChip';
import PaperVariantChip from '@/components/Common/VariantChips/PaperVariantChip';
import DesktopWACTA from '@/components/Common/DesktopWACTA';
import { WHATSAPP_NUMBER } from '@/components/constants/whatsapp';

type Props = {
  product: ItemType;
};

const HeroSection = ({ product }: Props) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0]?.sizeIn || '');
  const selectedSizeObj = product.sizes.find(s => s.sizeIn === selectedSize);
  const [selectedUnit, setSelectedUnit] = useState<string>(selectedSizeObj?.units?.[0]?.unitType || '');

  useEffect(() => {
    const newSizeObj = product.sizes.find(s => s.sizeIn === selectedSize);
    setSelectedUnit(newSizeObj?.units?.[0]?.unitType || '');
  }, [selectedSize, product.sizes]);

  const selectedUnitData = selectedSizeObj?.units?.find(u => u.unitType === selectedUnit);
  const images = selectedSizeObj?.sizeImages?.length ? selectedSizeObj.sizeImages : (product.productImages?.length ? product.productImages : [product.featuredImage ?? "/next.svg"]);
  const [index, setIndex] = useState(0);

  const handleNext = () => setIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setIndex((prev) => (prev - 1 + images.length) % images.length);
  const handleThumbnailClick = (i: number) => setIndex(i);

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
            {images.map((img: string, i: number) => (
              <Box
                key={`thumb-${img}-${i}`}
                component="img"
                src={img}
                alt={`thumb-${i}`}
                onClick={() => handleThumbnailClick(i)}
                sx={{ width: 64, height: 64, borderRadius: 1, border: i === index ? '2px solid #1976d2' : '1px solid #ccc', cursor: 'pointer', transition: 'border 0.3s' }}
              />
            ))}
          </Stack>
        </Box>

        {/* Right: Info */}
        <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between" gap={2}>
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              sx={{ fontSize: isMobile ? '1.5rem' : '2.125rem' }}
            >
              {product.name} {selectedSize && `- ${selectedSize}`}
            </Typography>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedSize}-${selectedUnit}-${selectedUnitData?.offeredPrice}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <Stack direction="row" alignItems="center" spacing={1} mt={1}>
                  <Typography variant="h5" fontWeight="bold" sx={{ color: 'success.main' }}>
                    ₹{selectedUnitData?.offeredPrice ?? product.offeredPrice}
                  </Typography>
                  {(selectedUnitData?.sellingPrice && selectedUnitData?.offeredPrice && selectedUnitData.sellingPrice > selectedUnitData.offeredPrice) && (
                    <>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ textDecoration: 'line-through' }}
                      >
                        ₹{selectedUnitData.sellingPrice}
                      </Typography>
                      <Chip
                        label={`-${Math.round(((selectedUnitData.sellingPrice - selectedUnitData.offeredPrice) / selectedUnitData.sellingPrice) * 100)}%`}
                        size="small"
                        sx={{ bgcolor: '#d32f2f', color: '#fff', fontWeight: 500, borderRadius: '16px' }}
                      />
                    </>
                  )}
                </Stack>
              </motion.div>
            </AnimatePresence>

            {!isMobile && (
              <Stack spacing={1} direction="row" mt={1} mb={2} flexWrap="wrap">
                <Chip label="FSC-Certified Paper" color="success" variant="outlined" />
                <Chip label="100% Biodegradable" color="success" variant="outlined" />
                <Chip label="Made in India" color="success" variant="outlined" />
              </Stack>
            )}

            <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50' }}>
              {[{
                icon: '📏',
                label: 'Size',
                data: product.sizes.map(s => s.sizeIn),
                selected: selectedSize,
                onClick: (val: string) => setSelectedSize(val),
                type: 'string' as const,
              },
              {
                icon: '📐',
                label: 'Unit',
                data: selectedSizeObj?.units?.map(u => u.unitType) ?? [],
                selected: selectedUnit,
                onClick: (val: string) => setSelectedUnit(val),
                type: 'string' as const,
              }].map(({ icon, label, data, selected, onClick, type }) => (
                <Box key={label} sx={{ display: 'grid', gridTemplateColumns: '64px 1fr', alignItems: 'center', rowGap: 1, mb: 2 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {icon} {label}:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {data.map((val, idx) => (
                      <Chip
                        key={`chip-${label}-${val}-${idx}`}
                        label={val}
                        size={isMobile ? 'small' : 'medium'}
                        variant={selected === val ? 'filled' : 'outlined'}
                        onClick={() => onClick(val)}
                        sx={{
                          bgcolor: selected === val ? 'primary.main' : '#f5f5f5',
                          color: selected === val ? '#fff' : 'text.primary',
                          fontWeight: 600,
                          borderRadius: '9999px',
                          fontSize: isMobile ? '0.8rem' : '1rem',
                          px: isMobile ? 1 : 2,
                          py: isMobile ? 0.5 : 1,
                          minWidth: isMobile ? 48 : 72,
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              ))}

              <Stack direction="row" spacing={3} alignItems="center" mt={3}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight="medium" color="text.secondary">
                    Print
                  </Typography>
                  <PrintVariantChip label={product.printVariants?.[0] ?? ''} />
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight="medium" color="text.secondary">
                    Paper
                  </Typography>
                  <PaperVariantChip label={product.paperVariant?.[0] ?? ''} />
                </Stack>
              </Stack>
            </Paper>

            <Box sx={{ bgcolor: '#e8f5e9', borderRadius: 2, p: 1.5, mt: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
              <Typography>
                📦 Guaranteed to arrive by <strong>2 Aug</strong> — Free Shipping<br />
                🎁 Get ₹50 voucher if your order arrives late.
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ height: 48, mb: 1 }}
              startIcon={<WhatsAppIcon />}
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=I%20am%20interested%20in%20${encodeURIComponent(product.name)}%20${selectedSize} ${selectedUnit}`}
              target="_blank"
            >
              Get Best Price on WhatsApp
            </Button>
            <DesktopWACTA
              productName={product.name}
              selectedSize={selectedSize}
              selectedUnit={selectedUnit}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
