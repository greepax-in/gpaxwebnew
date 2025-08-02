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
import ProductTitleWithPrice from '../ProductTitleWithPrice';

type Props = {
  product: ItemType;
};

const HeroSection = ({ product }: Props) => {
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
      <Box display="flex" flexDirection="row" gap={4}>
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
              style={{ width: '100%', height:  480, objectFit: 'contain', borderRadius: '8px' }}
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
          <ProductTitleWithPrice
            title={product.name}
            subtitle={product.subTitle}
            size={selectedSize || ''}
            offeredPrice={selectedUnitData?.offeredPrice || 0}
            sellingPrice={selectedUnitData?.sellingPrice || 0}
            contains={selectedUnitData?.contains}
            containsLabel={selectedUnitData?.containsLabel }
            selectedUnit={selectedUnit}
            deviceType='desktop'
          />

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              mt: 10,
              transform: 'translateY(-20%)',
              transition: 'transform 0.3s',
              minHeight: 150,
            }}
          >
            {/* Size Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, mt:3 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ minWidth: 64 }}>
                📏 Size:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mr: 6 }}>
                {product.sizes.map((s, idx) => (
                  <Chip
                    key={`size-${idx}`}
                    label={s.sizeIn}
                    onClick={() => setSelectedSize(s.sizeIn)}
                    variant={selectedSize === s.sizeIn ? 'filled' : 'outlined'}
                    size="medium"
                    sx={{
                      bgcolor: selectedSize === s.sizeIn ? 'primary.main' : '#f5f5f5',
                      color: selectedSize === s.sizeIn ? '#fff' : 'text.primary',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      px: 3,
                      py: 1,
                      minWidth: 100,
                      fontSize: '1.25rem',
                      letterSpacing: 0.5,
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Unit Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, mt: 6 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ minWidth: 64 }}>
                📐 Unit:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {(selectedSizeObj?.units || []).map((u, idx) => (
                  <Chip
                    key={`unit-${u.unitType}`}
                    label={u.unitType}
                    onClick={() => setSelectedUnit(u.unitType)}
                    variant={selectedUnit === u.unitType ? 'filled' : 'outlined'}
                    size="medium"
                    sx={{
                      bgcolor: selectedUnit === u.unitType ? 'primary.main' : '#f5f5f5',
                      color: selectedUnit === u.unitType ? '#fff' : 'text.primary',
                      fontWeight: 700,
                      borderRadius: '9999px',
                      px: 3,
                      py: 1,
                      minWidth: 100,
                      fontSize: '1.25rem',
                      letterSpacing: 0.5,
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Print / Paper section moved down by 20% */}
            <Box sx={{ mt: 5, transform: 'translateY(20%)', transition: 'transform 0.3s' }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Print
                  </Typography>
                  <PrintVariantChip label={product.printVariants?.[0] ?? ''} />
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="body2" fontWeight={600} color="text.secondary">
                    Paper
                  </Typography>
                  <PaperVariantChip label={product.paperVariant?.[0] ?? ''} />
                </Stack>
              </Stack>
            </Box>
          </Paper>

          <Box sx={{ bgcolor: '#e8f5e9', borderRadius: 2, p: 1.5, mt: -10, fontSize: '0.875rem', color: 'text.secondary' }}>
            <Typography>
              📦 Guaranteed to arrive by <strong>2 Aug</strong> — Free Shipping<br />
              🎁 Get ₹50 voucher if your order arrives late.
            </Typography>
          </Box>

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
  );
};

export default HeroSection;
