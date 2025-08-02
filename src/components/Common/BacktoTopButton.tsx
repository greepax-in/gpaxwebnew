'use client';

import React, { useEffect, useState } from 'react';
import { Box, Fab, Zoom } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

const BackToTopMobile = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400); // Show only after scrolling
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Zoom in={visible}>
      <Box
        role="presentation"
        onClick={scrollToTop}
        sx={{
          position: 'fixed',
          bottom: 140, // ✅ lifted above WhatsApp CTA (72 + button height)
          right: 16,
          zIndex: 1250,
        }}
      >
        <Fab size="small" aria-label="Back to Top" sx={{ bgcolor: '#1B5E20', color: '#fff' }}>
          <KeyboardArrowUpIcon />
        </Fab>
      </Box>
    </Zoom>
  );
};

export default BackToTopMobile;
