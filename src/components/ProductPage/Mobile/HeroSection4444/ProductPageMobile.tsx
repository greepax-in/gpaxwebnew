'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Chip,
  Stack,
  // Divider,
  // useMediaQuery,
  // Button,
} from '@mui/material';
import StickyVariantBar from './StickyVariantBar';
import ImageCarousel from './ImageCarousel';
import { ItemType } from '@/types/itemTypes';
import { motion, AnimatePresence } from 'framer-motion';
// import FloatingWhatsAppCTA from '../WhatsAppCTA';
// import WhatsAppCTA from '@/components/Common/MobileWACTA';
// import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import WhatsAppCTA from '@/components/Common/WhatsAppCTA');  
import BackToTopMobile from '@/components/Common/BacktoTopButton';
import { WHATSAPP_NUMBER } from '@/components/constants/whatsapp';

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
<Box sx={{ mt: -1 }}>
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
</Box>
      </AnimatePresence>

      {/* <Divider /> */}

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

      {/* WhatsApp CTA Button (not component) */}
      <Box sx={{ mt:-1.5, mb: 1 }}>
        <button
          style={{
            width: '100%',
            backgroundColor: '#25D366',
            color: '#fff',
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: '32px',
            padding: '14px 0',
            border: 'none',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '35px',
            gap: '8px',
            cursor: 'pointer',
            opacity: selectedSize && selectedQty && selectedUnit ? 1 : 0.5,
            pointerEvents: selectedSize && selectedQty && selectedUnit ? 'auto' : 'none',
          }}
          onClick={() => {
            const waMessage = `Hello! I'm interested in:\n🛍️ ${product.name}\n📐 Size: ${selectedSize}\n📦 Qty: ${selectedQty}\n⚖️ Unit: ${selectedUnit}\nPlease share pricing and availability.`;
            const url = typeof window !== 'undefined'
              ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage)}`
              : '#';
            window.open(url, '_blank');
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.511-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.348.709.243 1.262.388 1.694.497.712.181 1.36.156 1.872.095.571-.068 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347zm-5.421 7.617h-.001a9.87 9.87 0 0 1-4.988-1.354l-.357-.211-3.717.946.996-3.637-.232-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.455 4.436-9.884 9.893-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.991c-.002 5.455-4.437 9.884-9.892 9.884zm8.413-18.297a11.815 11.815 0 0 0-8.414-3.488C5.304.214.217 5.3.215 11.104c.001 1.958.512 3.86 1.488 5.522L.025 23.785a1 1 0 0 0 1.213 1.212l7.16-1.921a11.89 11.89 0 0 0 4.646.934h.005c6.798 0 11.888-5.087 11.89-11.293a11.82 11.82 0 0 0-3.488-8.413z"/></svg>
          Get Best Price on WhatsApp
        </button>
      </Box>

      
                  {/* Delivery & Trust */}
                  <Box sx={{ bgcolor: '#e8f5e9', borderRadius: 2, p: 1.5, mt: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
                    <Typography>
                      📦 Guaranteed to arrive by <strong>2 Aug</strong> — Free Shipping<br />
                      🎁 Get ₹50 voucher if your order arrives late.
                    </Typography>
                  </Box>
      
      <BackToTopMobile />
    </Box>

  );
};

export default ProductPageMobile;
