'use client';

import React, { useState, useEffect } from 'react';
import { Button, Snackbar, Slide } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';
import { getWhatsAppLink } from '@/components/constants/whatsapp';

interface WhatsAppCTAProps {
  productName: string;
  selectedSize: string;
  selectedQty: string;
  selectedUnit: string;
  label?: string;
}

const WhatsAppCTA = ({
  productName,
  selectedSize,
  selectedQty,
  selectedUnit,
  label = 'Get Best Price on WhatsApp',
}: WhatsAppCTAProps) => {
  const [enabled, setEnabled] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const ready = selectedSize && selectedQty && selectedUnit;
    setEnabled(!!ready);
  }, [selectedSize, selectedQty, selectedUnit]);

  const waMessage = `Hello! I'm interested in:
🛍️ ${productName}
📐 Size: ${selectedSize}
📦 Qty: ${selectedQty}
⚖️ Unit: ${selectedUnit}
Please share pricing and availability.`;

  const handleClick = () => {
    setSnackbarOpen(true);
    const url = getWhatsAppLink(waMessage);
    window.open(url, '_blank');
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'fixed',
          bottom: '72px',
          left: 16,
          right: 16,
          paddingBottom: 'env(safe-area-inset-bottom)',
          zIndex: 1300,
          pointerEvents: 'auto',
        }}
      >
        <Button
          onClick={handleClick}
          disabled={!enabled}
          fullWidth
          variant="contained"
          color="success"
          startIcon={
            <motion.div
              animate={enabled ? { scale: [1, 1.1, 1] } : { scale: 1 }}
              transition={{
                repeat: enabled ? Infinity : 0,
                duration: 1.2,
              }}
            >
              <WhatsAppIcon />
            </motion.div>
          }
          sx={{
            fontWeight: 600,
            fontSize: '1rem',
            borderRadius: '32px',
            py: 1.4,
            textTransform: 'none',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            opacity: enabled ? 1 : 0.5,
          }}
        >
          {label}
        </Button>
      </motion.div>

      <Snackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
        autoHideDuration={2000}
        message="Opening WhatsApp…"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        TransitionComponent={Slide}
      />
    </>
  );
};

export default WhatsAppCTA;
