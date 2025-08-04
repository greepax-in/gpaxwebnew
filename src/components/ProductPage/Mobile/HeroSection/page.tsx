'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  // Chip,
  // Stack,
  IconButton,
  // Tooltip,
  Collapse,
  Divider,
  Stack,
  // Divider,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import InfoIcon from '@mui/icons-material/Info';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
// import RecyclingIcon from '@mui/icons-material/Recycling';
import CloseIcon from '@mui/icons-material/Close';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import TranslateIcon from '@mui/icons-material/Translate';
// import FactoryIcon from '@mui/icons-material/Factory';
import { motion, AnimatePresence } from 'framer-motion';
import { ItemType, UnitType } from '@/types/itemTypes';
import ProductTitleWithPrice from '../../ProductTitleWithPrice';
import PaperVariantChip from '@/components/Common/VariantChips/PaperVariantChip';
import PrintVariantChip from '@/components/Common/VariantChips/PrintVariantChip';

interface Props {
  product: ItemType;
}

export default function ProductMobileUI({ product }: Props) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedUnit, setSelectedUnit] = useState<UnitType>(product.sizes[0].units[0].unitType);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showShippingDetails, setShowShippingDetails] = useState(false);
  const chipScrollRef = useRef<HTMLDivElement>(null);
  const [isZoomed, setIsZoomed] = useState(false);

  const [sizeUnit, setSizeUnit] = useState<'IN' | 'CM'>(() => {
  if (typeof window !== 'undefined') {
    return (localStorage.getItem('sizeUnit') as 'IN' | 'CM') || 'IN';
  }
  return 'IN';
});

const toggleSizeUnit = () => {
  const newUnit = sizeUnit === 'IN' ? 'CM' : 'IN';
  setSizeUnit(newUnit);
  localStorage.setItem('sizeUnit', newUnit);
};


  useEffect(() => {
    const availableUnits = selectedSize.units.map(u => u.unitType);
    if (!availableUnits.includes(selectedUnit)) {
      setSelectedUnit(availableUnits[0]);
    }
  }, [selectedSize]);

  useEffect(() => {
    const el = chipScrollRef.current;
    if (el) {
      el.scrollLeft = 20;
      setTimeout(() => {
        el.scrollLeft = 0;
      }, 300);
    }
  }, []);

  const selectedUnitData = selectedSize.units.find(u => u.unitType === selectedUnit);

  const offeredPrice = selectedUnitData?.offeredPrice || 0;
  const sellingPrice = selectedUnitData?.sellingPrice || 0;

  const derivedPrice = selectedUnitData?.contains
    ? (offeredPrice / selectedUnitData.contains).toFixed(2)
    : undefined;

  const getImagesArray = (images: string | string[] | undefined): string[] => {
    if (!images) return [];
    return Array.isArray(images) ? images : [images];
  };

  const productImages: string[] = getImagesArray(selectedSize.sizeImages && selectedSize.sizeImages.length > 0 ? selectedSize.sizeImages : undefined);
  if (productImages.length === 0) {
    const fallbackImages = getImagesArray(product.productImages && (Array.isArray(product.productImages) ? product.productImages.length > 0 : !!product.productImages) ? product.productImages : undefined);
    productImages.push(...(fallbackImages.length > 0 ? fallbackImages : [product.image]));
  }

  return (
    <Box sx={{ p: 0, maxWidth: 400, mx: 'auto', marginTop: -4 }}>
      {/* Image + Thumbnail Overlay */}
      <Box sx={{ position: 'relative', width: '100%', height: 220, borderRadius: 2, mb: 1, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.img
            key={productImages[selectedImageIndex]}
            src={productImages[selectedImageIndex]}
            alt="product"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            style={{
              width: '100%',
              height: '100%',
              borderRadius: '8px',
              position: 'absolute',
              top: 0,
              left: 0,
              cursor: 'zoom-in',
            }}
            onClick={() => setIsZoomed(true)}
          />
        </AnimatePresence>

        {/* Print & Paper Variant Chips (bottom right) */}
        <Box sx={{ position: 'absolute', bottom: 12, right: 12, zIndex: 3, display: 'flex', gap: 1 }}>
          {product.printVariants?.[0] && (
            <PrintVariantChip label={product.printVariants[0]} size='small' />
          )}
          {product.paperVariant?.[0] && (
            <PaperVariantChip label={product.paperVariant[0]} size='small' />
          )}
        </Box>

        {/* Thumbnail Selector */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 8,
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {productImages.slice(0, 2).map((thumb: string, index: number) => (
            <Box
              key={index}
              component="img"
              src={thumb}
              alt={`thumb-${index}`}
              onClick={() => setSelectedImageIndex(index)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                border: selectedImageIndex === index ? '2px solid #4caf50' : '1px solid #ccc',
                cursor: 'pointer'
              }}
            />
          ))}
        </Box>

        {/* Price Overlay */}
        {derivedPrice && selectedUnit && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 2,
            }}
          >
            <Box
              sx={{
                backgroundColor: 'success.main',
                borderRadius: 2,
                px: 1.5,
                py: 0.5,
                fontWeight: 700,
                fontSize: 14,
                color: '#fff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              }}
            >
              ₹{derivedPrice} / {selectedUnitData?.containsLabel}
            </Box>
          </motion.div>
        )}

      </Box>

      <ProductTitleWithPrice
        title={product.name}
        subtitle={product.subTitle}
        size={selectedSize.sizeIn || ''}
        offeredPrice={offeredPrice}
        sellingPrice={sellingPrice}
        contains={selectedUnitData?.contains}
        containsLabel={selectedUnitData?.containsLabel}
        selectedUnit={selectedUnit}
        MOQ={selectedUnitData?.moq ?? 0}
        deviceType='mobile'
        printVariant={product.printVariants?.[0]}
        usecases={product.usecases}
        sizeUnit={sizeUnit}
        toggleSizeUnit={toggleSizeUnit}
        GSM={product.GSM || 'N/A'}
         sizeIn={selectedSize.sizeIn}
  sizeCm={selectedSize.sizeCm}
      />

      {/* Size Chips with Edge Fader and Bounce */}
      <Box sx={{ position: 'relative', px: 0 }}>
  <Box
    ref={chipScrollRef}
    sx={{
      overflowX: 'auto',
      display: 'flex',
      gap: 1,
      py: 1,
      pr: 3,
      scrollBehavior: 'smooth',
      '::-webkit-scrollbar': { display: 'none' },
    }}
  >
    {product.sizes.map((s) => (
      <motion.div
        key={s.sizeIn}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow:
            selectedSize.sizeIn === s.sizeIn
              ? '0 4px 14px rgba(3, 162, 14, 0.18)'
              : 'none',
        }}
        style={{
          borderRadius: '9999px',
          display: 'inline-block',
          flex: '0 0 auto',
        }}
      >
        <Box
          onClick={() => setSelectedSize(s)}
          sx={{
            px: 1.5,
            py: 0.5,
            borderRadius: '9999px',
            border:
              selectedSize.sizeIn === s.sizeIn
                ? '1.5px solid #03a20eff'
                : '1px solid #ebbb29ff',
            bgcolor:
              selectedSize.sizeIn === s.sizeIn ? '#fff' : '#fff7ed',
            color:
              selectedSize.sizeIn === s.sizeIn
                ? '#ff5722'
                : '#8c3a00',
            fontWeight: 500,
            fontSize: '0.75rem',
            minWidth: 64,
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          {sizeUnit === 'IN' ? s.sizeIn : s.sizeCm}
        </Box>
      </motion.div>
    ))}
  </Box>

  {/* Edge Faders */}
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      width: 24,
      background: 'linear-gradient(to right, #fff, rgba(255,255,255,0))',
      pointerEvents: 'none',
      zIndex: 1,
    }}
  />
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      width: 24,
      background: 'linear-gradient(to left, #fff, rgba(255,255,255,0))',
      pointerEvents: 'none',
      zIndex: 1,
    }}
  />
</Box>


      {/* Unit Chips */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          gap: 1,
          mt: 0.5,
          px: 1,
          flexWrap: 'wrap', // fallback for small widths
        }}
      >
        {selectedSize.units.map((u, i) => (
          <Box
            key={`unit-${u.unitType}-${i}`}
            onClick={() => setSelectedUnit(u.unitType)}
            sx={{
              px: 2,
              py: 0.5,
              fontSize: '0.75rem',
              fontWeight: 600,
              borderRadius: '9999px',
              border: selectedUnit === u.unitType ? '2px solid #2e7d32' : '1px solid #ccc',
              bgcolor: selectedUnit === u.unitType ? '#d0f2df' : '#fff',
              color: selectedUnit === u.unitType ? '#1b5e20' : '#555',
              cursor: 'pointer',
            }}
          >
            {u.unitType}
          </Box>
        ))}
      </Box>


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
          mt: 0.6,
          px: 1,
          py: 0.5,
          borderRadius: 2,
          backgroundColor: '#f7f7ff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 0.5,
        }}
      > 
         {/* Features */}
  {/* <Typography
    variant="body2"
    color="black"
    sx={{
      fontSize: '0.75rem',
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
  </Typography>  */}

        {/* Info tags */}
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="center"
          sx={{ fontSize: '0.75rem' }}
        >
          <Typography variant="body2" color="black" fontSize="0.75rem">
            🌐 Multi-Language Design
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
          <Typography variant="body2" color="black" fontSize="0.75rem">
            🏭 Manufacture Direct
          </Typography>
        </Stack>
      </Box>




      {/* <Divider sx={{ borderColor: 'rgba(0, 0, 0, 0.05)', my: 1 }} /> */}
      {/* Shipping Info */}
      {/* Shipping Info */}
      <Box sx={{ px: 1, mt: 0.5 }}>
        <Box
          sx={{
            // backgroundColor: '#f7f7ff',
            borderRadius: 2,
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            mt: -0.5
          }}
        >
          <Typography variant="body2" color="text.primary">
            🚚 Shipping arranged at actuals
          </Typography>
          <IconButton
            size="small"
            onClick={() => setShowShippingDetails((prev) => !prev)}
            sx={{ color: 'text.secondary', p: 0 }}
          >
            <InfoOutlinedIcon fontSize="small" />
          </IconButton>
        </Box>

        <Collapse in={showShippingDetails} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 1, px: 1 }}>
            <Typography variant="caption" color="text.secondary" align="center">
              We help coordinate economical shipping via VRL, Porter, etc. Customers pay shipping cost
              separately based on location, mode, and quantity.
            </Typography>
          </Box>
        </Collapse>
      </Box>




      {/* CTA */}
      {/* <Box sx={{ height: 80 }} /> Pushes content up above sticky CTA */}

      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          zIndex: 1200,
          bgcolor: '#fff',
          // borderTop: '1px solid #e0e0e0',
          // py: `calc(env(safe-area-inset-bottom, 0px) + 1px)`,
          // px: 0,
        }}
      >
        <Button
          fullWidth
          variant="contained"
          color="success"
          startIcon={<WhatsAppIcon />}
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: 2,
            py: 0.5,
          }}
        >
          Buy via WhatsApp
        </Button>
      </Box>







      {/* 👇 Add this block just before the final </Box> */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.95)',
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: 16,
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={() => setIsZoomed(false)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#fff',
                zIndex: 99999,
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Left Arrow */}
            {productImages.length > 1 && (
              <IconButton
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === 0 ? productImages.length - 1 : prev - 1
                  )
                }
                sx={{
                  position: 'absolute',
                  left: 12,
                  color: '#fff',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <ChevronLeftIcon />
              </IconButton>
            )}

            {/* Fullscreen Image */}
            <motion.img
              src={productImages[selectedImageIndex]}
              alt="zoomed-product"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ duration: 0.3 }}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
              }}
            />

            {/* Right Arrow */}
            {productImages.length > 1 && (
              <IconButton
                onClick={() =>
                  setSelectedImageIndex((prev) =>
                    prev === productImages.length - 1 ? 0 : prev + 1
                  )
                }
                sx={{
                  position: 'absolute',
                  right: 12,
                  color: '#fff',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' },
                }}
              >
                <ChevronRightIcon />
              </IconButton>
            )}
          </motion.div>
        )}
      </AnimatePresence>

    </Box>
  );
}
