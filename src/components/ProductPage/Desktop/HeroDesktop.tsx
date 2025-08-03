'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  // useMediaQuery,
  Chip,
  IconButton,
  Paper,
  Divider,
  // Collapse,
  // Divider,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
    // const [showShippingDetails, setShowShippingDetails] = useState(false);

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
            <motion.div
              whileHover={{ scale: 1.5 }}
              transition={{ type: 'spring', stiffness: 200 }}
              style={{
                width: '100%',
                height: 480,
                overflow: 'hidden',
                borderRadius: '8px',
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <motion.img
                key={images[index]}
                src={images[index]}
                alt={`Product image ${index + 1}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4 }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  pointerEvents: 'none', // prevents scroll interference
                }}
              />
            </motion.div>

          </AnimatePresence>

          {/* ✅ Unit price overlay */}
          {selectedUnitData?.sellingPrice && selectedUnitData?.contains && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              style={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 2,
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'success.main',
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  fontWeight: 700,
                  fontSize: 16,
                  color: '#fff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                }}
              >
                ₹{(selectedUnitData.offeredPrice / selectedUnitData.contains).toFixed(2)} / {selectedUnitData.containsLabel}
              </Box>
            </motion.div>
          )}

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
            containsLabel={selectedUnitData?.containsLabel}
            selectedUnit={selectedUnit}
            deviceType='desktop'
            MOQ={selectedUnitData?.moq ?? 0}
             usecases={product.usecases}
          />

          <Paper
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: 'grey.50',
              mt: 4,
              transform: 'translateY(-20%)',
              transition: 'transform 0.3s',
              minHeight: 200,
            }}
          >
            {/* Size Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, mt: 0 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ minWidth: 64 }}>
                <span style={{ fontSize: '1rem', color: '#111' }}>📏 Size:</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mr: 6 }}>
                {product.sizes.map((s, idx) => (
                  <motion.div
                    key={`size-${idx}`}
                    whileHover={{ scale: 1.08, boxShadow: '0 6px 24px 0 rgba(3,162,14,0.18)' }}
                    whileTap={{ scale: 0.97 }}
                    animate={selectedSize === s.sizeIn ? { boxShadow: '0 8px 32px 0 rgba(3,162,14,0.28)' } : { boxShadow: '0 2px 8px 0 rgba(140,58,0,0.10)' }}
                    style={{ borderRadius: '9999px', display: 'inline-block' }}
                  >
                    <Chip
                      label={s.sizeIn}
                      onClick={() => setSelectedSize(s.sizeIn)}
                      variant={selectedSize === s.sizeIn ? 'filled' : 'outlined'}
                      size="medium"
                      sx={{
                        border: selectedSize === s.sizeIn ? '2px solid #03a20eff' : '1px solid #ebbb29ff ',
                        bgcolor: selectedSize === s.sizeIn ? '#fff' : '#fff7ed',
                        color: '#111',
                        fontWeight: 700,
                        borderRadius: '9999px',
                        px: 3,
                        py: 1,
                        minWidth: 100,
                        fontSize: '1.25rem',
                        letterSpacing: 0.5,
                        boxShadow: 'none',
                        transition: 'box-shadow 0.3s',
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>

            {/* Unit Row */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2, mt: 4 }}>
              <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ minWidth: 64 }}>
                <span style={{ fontSize: '1rem', color: '#111' }}>📐 Unit:</span>
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {(selectedSizeObj?.units || []).map((u) => (
                  <motion.div
                    key={`unit-${u.unitType}`}
                    whileHover={{ scale: 1.08, boxShadow: '0 6px 24px 0 rgba(3,162,14,0.18)' }}
                    whileTap={{ scale: 0.97 }}
                    animate={selectedUnit === u.unitType ? { boxShadow: '0 8px 32px 0 rgba(3,162,14,0.28)' } : { boxShadow: '0 2px 8px 0 rgba(0,77,64,0.10)' }}
                    style={{ borderRadius: '9999px', display: 'inline-block' }}
                  >
                    <Chip
                      label={u.unitType}
                      onClick={() => setSelectedUnit(u.unitType)}
                      variant={selectedUnit === u.unitType ? 'filled' : 'outlined'}
                      size="medium"
                      sx={{
                        bgcolor: selectedUnit === u.unitType ? 'success.main' : '#e0f2f1',
                        color: selectedUnit === u.unitType ? '#fff' : '#004d40',
                        fontWeight: 700,
                        borderRadius: '9999px',
                        px: 3,
                        py: 1,
                        minWidth: 100,
                        fontSize: '1.25rem',
                        letterSpacing: 0.5,
                        boxShadow: 'none',
                        transition: 'box-shadow 0.3s',
                      }}
                    />
                  </motion.div>
                ))}
              </Box>
            </Box>

            {/* Print / Paper section moved down by 20% */}
            <Box sx={{ mt: 3, transform: 'translateY(20%)', transition: 'transform 0.3s' }}>
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

  <Box marginTop={-5} sx={{ px: 2 }  }>
      
{/* <Box
  sx={{
    width: '100%',
    height: '1px',
    background: 'linear-gradient(to right, rgba(0,0,0,0.05), rgba(0,0,0,0.1), rgba(0,0,0,0.05))',
    my: 0.5,
  }}
/> */}


      {/* <Divider sx={{mt:1}} /> */}
      {/* Features */}
  <Box
  sx={{
    mt: 0.4,
    px: 1,
    py: 0.5,
    borderRadius: 2,
    backgroundColor: '#e8f5dfff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 0.5,
  }}
>
  {/* Features */}
  <Typography
    variant="body2"
    color="black"
    sx={{
      fontSize: { xs: '0.75rem', md: '1.1rem' },
      lineHeight: 1.4,
      textAlign: 'center',
    }}
  >
    {product.features.map((f, i) => (
      <React.Fragment key={i}>
        {i > 0 && <span>&nbsp;•&nbsp;</span>}
        {f}
      </React.Fragment>
    ))}
  </Typography>

  {/* Info tags */}
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
    justifyContent="center"
    sx={{
      fontSize: { xs: '0.75rem', md: '1.1rem' },
    }}
  >
    <Typography
      variant="body2"
      color="black"
      sx={{
        fontSize: { xs: '0.75rem', md: '1rem' },
      }}
    >
      🌐 Multi-Language Design
    </Typography>
    <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
    <Typography
      variant="body2"
      color="black"
      sx={{
        fontSize: { xs: '0.75rem', md: '1rem' },
      }}
    >
      🏭 Manufacture Direct
    </Typography>
  </Stack>
</Box>

   </Box>
      {/* Shipping Info */}
<Box sx={{ px: 1, mt: 0 }}>
  <Box
    sx={{
      backgroundColor: '#f7f7ff',
      borderRadius: 2,
      px: 2,
      py: 1.5,
      display: 'flex',
      flexDirection: 'column',
      // alignItems: 'center',
      // textAlign: 'center',
    }}
  >
    <Typography variant="body2" color="text.primary" fontWeight="bold" align="left" fontSize="1.25rem">
      🚚 Shipping arranged at actuals
    </Typography>

    <Typography
      variant="caption"
      color="text.secondary"
      sx={{ mt: 0.5, lineHeight: 1.4 }}
    >
      We help coordinate economical shipping via VRL, Porter, etc. Customers pay shipping cost
      separately based on location, mode, and quantity.
    </Typography>
  </Box>


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
