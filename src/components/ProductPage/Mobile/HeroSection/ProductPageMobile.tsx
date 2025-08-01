'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  Divider,
  // useMediaQuery,
  // Button,
} from '@mui/material';
import StickyVariantBar from './StickyVariantBar';
import ImageCarousel from './ImageCarousel';
import { ItemType } from '@/types/itemTypes';
import { motion, AnimatePresence } from 'framer-motion';
// import FloatingWhatsAppCTA from '../WhatsAppCTA';
import WhatsAppCTA from '@/components/Common/WhatsAppCTA';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import WhatsAppCTA from '@/components/Common/WhatsAppCTA');  

interface ProductPageMobileProps {
  product: ItemType;
}

const ProductPageMobile = ({ product }: ProductPageMobileProps) => {
  // const isMobile = useMediaQuery('(max-width:600px)');

  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || '');
  const [selectedQty, setSelectedQty] = useState(
    product.minimumQuantities?.[0]?.toString() || ''
  );
  const [selectedUnit, setSelectedUnit] = useState(product.units?.[0] || '');

  const variantPrice =
    product.variantPrices?.[selectedSize]?.[selectedUnit]?.[selectedQty];

  const fallbackOffered = product.offeredPrice ?? 0;
  const fallbackSelling = product.sellingPrice ?? 0;

  const offeredPrice =
    variantPrice !== undefined ? variantPrice : fallbackOffered;
  const sellingPrice =
    variantPrice !== undefined
      ? Math.round(variantPrice * 1.2)
      : fallbackSelling;

  const perUnitPrice =
    selectedQty && offeredPrice
      ? (offeredPrice / parseInt(selectedQty)).toFixed(2)
      : null;

  // const packSize = product.packSize ?? selectedQty;
  // const moq = selectedQty;
  // const tags = product.tags?.slice(0, 2) ?? [];
  // const paperVariant = product.paperVariant?.[0];
  // const printVariant = product.printVariants?.[0];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        px: { xs: 2, sm: 3 },
        maxWidth: 480,
        mx: 'auto',
        minHeight: '100dvh',
        pb: 10,
      }}
    >
      {/* Image + Thumbnail */}
      <Box>
        <ImageCarousel
          product={product}
          selectedSize={selectedSize}
          perUnitPrice={perUnitPrice ?? undefined}
          selectedUnit={selectedUnit}
        />
      </Box>

      {/* Product Title */}
      <Typography variant="h6" fontWeight={600} lineHeight={1.4}>
        {product.name}
        {selectedSize ? ` – ${selectedSize}` : ''}
      </Typography>



      {/* Price Section */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedSize}-${selectedQty}-${selectedUnit}-${offeredPrice}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="h6" color="primary" fontWeight={700}>
              ₹{offeredPrice}
            </Typography>
            {sellingPrice > offeredPrice && (
              <>
                <Typography
                  variant="body2"
                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                >
                  ₹{sellingPrice}
                </Typography>
                <Chip
                  label={`-${Math.round(
                    ((sellingPrice - offeredPrice) / sellingPrice) * 100
                  )}%`}
                  size="small"
                  sx={{ bgcolor: 'success.main', color: '#fff', fontWeight: 600 }}
                />
              </>
            )}
          </Stack>

        

          {/* Pack Info + Tags */}
       
 

          {/* WhatsApp CTA */}

        </motion.div>
      </AnimatePresence>

      <Divider />

      {/* Sticky Variant Bar */}
      <StickyVariantBar
        sizes={product.sizes || []}
        selectedSize={selectedSize}
        onSizeSelect={setSelectedSize}
        qtyOptions={product.minimumQuantities?.map((q) => q.toString()) || []}
        selectedQty={selectedQty}
        onQtySelect={setSelectedQty}
        unitOptions={product.units || []}
        selectedUnit={selectedUnit}
        onUnitSelect={setSelectedUnit}
      />
<WhatsAppCTA
  productName={product.name}
  selectedSize={selectedSize}
  selectedQty={selectedQty}
  selectedUnit={selectedUnit}
/>
    </Box>
  );
};

export default ProductPageMobile;
