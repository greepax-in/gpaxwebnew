'use client';

import React, { useState, useEffect } from 'react';
import { Box, Stack, IconButton} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ItemType } from '@/types/itemTypes';

interface ImageCarouselProps {
  product: ItemType;
  selectedSize: string;
  perUnitPrice?: string;
  selectedUnit?: string;
}

const ImageCarousel = ({
  product,
  selectedSize,
  perUnitPrice,
  selectedUnit,
}: ImageCarouselProps) => {
  const [images, setImages] = useState<string[]>([]);
  const [selected, setSelected] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  // const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const imgs =
      (product.sizeImages && product.sizeImages[selectedSize]) ||
      product.productImages || [];
    setImages(imgs);
    setSelected(0);
  }, [selectedSize, product]);

  const unitPriceText =
    perUnitPrice && selectedUnit ? `₹${perUnitPrice} / ${selectedUnit}` : null;

  const handleNext = () => {
    setSelected((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setSelected((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      <Box>
        <Box
          sx={{
            width: '100%',
            aspectRatio: '1 / 1',
            bgcolor: '#f5f5f5',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            height: { xs: 300, sm: 400, md: 500 },
            cursor: 'pointer',
          }}
          onClick={() => setFullscreen(true)}
        >
          {/* Gradient for readability */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '25%',
              background: 'linear-gradient(to top, rgba(255,255,255,0.95), transparent)',
              zIndex: 1,
            }}
          />

          {/* Bottom Overlay for Unit Price */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              py: 1.2,
              px: 2,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 2,
            }}
          >
            <AnimatePresence mode="wait">
              {unitPriceText && (
                <motion.div
                  key={unitPriceText}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  style={{
                    background: '#c5e1a5',
                    color: '#1b5e20',
                    fontWeight: 700,
                    padding: '6px 14px',
                    borderRadius: '999px',
                    fontSize: '0.95rem',
                    border: '1px solid #9ccc65',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                  }}
                >
                  {unitPriceText}
                </motion.div>
              )}
            </AnimatePresence>
          </Box>

          {/* Main Image */}
          {images.length > 0 && (
            <img
              src={images[selected]}
              alt={`product-${selected}`}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}
        </Box>

        {/* Thumbnails */}
        <Stack direction="row" spacing={1} justifyContent="center" mt={1}>
          {images.map((src, index) => (
            <Box
              key={index}
              sx={{
                width: 48,
                height: 48,
                border: selected === index ? '2px solid #1976d2' : '1px solid #ccc',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
              }}
              onClick={() => setSelected(index)}
            >
              <img
                src={src}
                alt={`thumb-${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100dvh',
              backgroundColor: 'rgba(0,0,0,0.95)',
              zIndex: 9999,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              padding: 16,
            }}
          >
            <IconButton
              onClick={() => setFullscreen(false)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                color: '#fff',
              }}
            >
              <CloseIcon />
            </IconButton>

            {images.length > 0 && (
              <motion.img
                key={images[selected]}
                src={images[selected]}
                alt={`fullscreen-${selected}`}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{
                  maxWidth: '90%',
                  maxHeight: '80%',
                  objectFit: 'contain',
                  borderRadius: 12,
                }}
              />
            )}

            {/* Navigation Buttons */}
            <Box
              sx={{
                position: 'absolute',
                width: '100%',
                top: '50%',
                display: 'flex',
                justifyContent: 'space-between',
                px: 2,
              }}
            >
              <IconButton onClick={handlePrev} sx={{ color: '#fff' }}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <IconButton onClick={handleNext} sx={{ color: '#fff' }}>
                <ArrowForwardIosIcon />
              </IconButton>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ImageCarousel;
