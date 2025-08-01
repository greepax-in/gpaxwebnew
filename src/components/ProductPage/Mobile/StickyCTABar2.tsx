'use client';

import React from 'react';
import { Box, Button } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const StickyCTABar = ({ whatsappUrl }: { whatsappUrl: string }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 20,
        bgcolor: 'background.paper',
        p: 1,
        borderTop: '1px solid #ccc',
      }}
    >
      <Button
        fullWidth
        variant="contained"
        color="success"
        startIcon={<WhatsAppIcon />}
        href={whatsappUrl}
        target="_blank"
      >
        Chat on WhatsApp
      </Button>
    </Box>
  );
};

export default StickyCTABar;