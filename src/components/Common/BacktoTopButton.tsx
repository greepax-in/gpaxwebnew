'use client';

import React, { useEffect, useState } from 'react';
import { Fab, useMediaQuery } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { motion, AnimatePresence } from 'framer-motion';

const BackToTopButton = () => {
  const [showButton, setShowButton] = useState(false);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {showButton && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            bottom: isMobile ? 80 : 32, // Adjusted for mobile to display above bottom nav bar
            right: isMobile ? 16 : 32, // Adjusted to always be on the right side bottom
            zIndex: 1300,
          }}
        >
          <Fab
            onClick={scrollToTop}
            size="medium"
            color="primary"
            aria-label="scroll back to top"
            sx={{
              backgroundColor: '#007a5e',
              '&:hover': { backgroundColor: '#005f47' },
            }}
          >
            <KeyboardArrowUpIcon />
          </Fab>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BackToTopButton;
