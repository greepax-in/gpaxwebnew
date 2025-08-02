'use client';

import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { getWhatsAppLink } from '@/components/constants/whatsapp';
import { useMediaQuery } from '@mui/material';

interface WhatsAppCTAProps {
  productName: string;
  selectedSize: string;
  selectedQty: string;
  selectedUnit: string;
  label?: string;
}
const FloatingWhatsAppFAB = ({
  productName,
  selectedSize,         
  selectedQty,
  selectedUnit,
  // label = 'Chat with us on WhatsApp',
}: WhatsAppCTAProps) => {
 


  const isDesktop = useMediaQuery('(min-width:900px)');
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isDesktop) return;
    const handleScroll = () => {
      setShowButton(window.scrollY > 200);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isDesktop]);

  if (!isDesktop || !showButton) return null;

  const waMessage = `Hello! I'm interested in:
🛍️ ${productName}
📐 Size: ${selectedSize}
📦 Qty: ${selectedQty}
⚖️ Unit: ${selectedUnit}
Please share pricing and availability.`;

  return (
    <Tooltip title="Chat with us on WhatsApp" placement="left">
      <Button
        variant="contained"
        startIcon={<WhatsAppIcon />}
        href={getWhatsAppLink(waMessage)}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
               backgroundColor:  '#25D366' ,
            color: '#fff' ,
            '&:hover': {
              backgroundColor: '#1ebe5d'
            },
          zIndex: 1400,
          fontWeight: 600,
          fontSize: 16,
          borderRadius: 28,
          px: 3,
          minWidth: 220,
          height: 56,
        }}
      >
        Get Best Price on WhatsApp
      </Button>
    </Tooltip>
  );
};

export default FloatingWhatsAppFAB;
