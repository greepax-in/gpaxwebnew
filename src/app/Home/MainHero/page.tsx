'use client';

import { Box, useMediaQuery } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';

export default function HeroSection() {
  const images = [
    '/images/home/hero/printed-multi-color.svg',
    '/images/home/hero/kraft-printed-paper-bag.svg',
    '/images/home/hero/kraft-cake-boxes.svg',
    '/images/home/hero/bakery-paper-covers.svg',
    '/images/home/hero/grocery-paper-covers.svg',
    '/images/home/hero/medical-paper-covers.svg',
    '/images/home/hero/burger-boxes.svg',
    '/images/home/hero/bakery-paper-covers-small.svg',
  ];
  const [index, setIndex] = useState(0);

  // Check if the screen size is mobile
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % images.length), 3000);
    return () => clearInterval(id);
  }, [images.length]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: { xs: 'column', md: 'row' },
        px: 4,
        py: 8,
        background: '#f4f1ec',
        // mt: { md: 0 }, // Add margin-top for desktop to place below AppBar
      }}
    >
      {/* Left: Animated Image */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: isMobile ? 300 : 400, // Adjust width for mobile
            height: isMobile ? 350 : 500, // Adjust height for mobile
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={images[index]}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.8 }}
              style={{ position: 'absolute', width: '100%', height: '100%' }}
            >
              <Image
                src={images[index]}
                alt={`Slide ${index}`}
                fill // Next.js 13+ uses 'fill' prop instead of 'layout="fill"'
                style={{
                  objectFit: 'cover', // Next.js 13+ uses style for objectFit
                  borderRadius: 16,
                  boxShadow: '0 4px 24px #0002',
                }}
              />
            </motion.div>
          </AnimatePresence>
        </Box>
      </Box>

      {/* Right: Text */}
      <Box
        sx={{
          flex: 1,
          mt: { xs: 6, md: 0 },
          textAlign: isMobile ? 'center' : 'left', // Center text for mobile
          transform: isMobile ? 'none' : 'translateX(-10%)', // Remove translation for mobile
        }}
      >
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          style={{
            fontSize: isMobile ? '1.8rem' : '2.5rem', // Responsive font size
            color: '#2e7d32',
            fontWeight: 700,
          }}
        >
          Sustainable Paper Packaging. Made for the Planet.
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{
            fontSize: isMobile ? '1rem' : '1.25rem', // Responsive font size
            marginTop: '1rem',
            color: '#444',
          }}
        >
          Every bag you choose is one less plastic choking our rivers and oceans.
          <br />
          <strong>Join the movement. Go paper. Go GreenPax.</strong>
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          style={{ marginTop: '2rem' }}
        >
          <motion.div
            whileHover="hover"
            initial="rest"
            animate="rest"
            style={{ display: 'inline-block', position: 'relative' }}
          >
            {/* Ripple Background */}
            <motion.div
              variants={{
                rest: { scale: 0, opacity: 0 },
                hover: { scale: 1.8, opacity: 0.15 },
              }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 80,
                height: 80,
                backgroundColor: '#a7c49d',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1,
              }}
            />

            {/* Button */}
            <motion.button
              variants={{
                rest: { scale: 1 },
                hover: { scale: 1.05 },
              }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                backgroundColor: '#2e7d32',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                padding: isMobile ? '0.75rem 1.5rem' : '1rem 2rem',
                fontSize: isMobile ? '0.9rem' : '1rem',
                fontWeight: 500,
                cursor: 'pointer',
                position: 'relative',
                zIndex: 2,
              }}
            >
              Explore Products
            </motion.button>
          </motion.div>
        </motion.div>
      </Box>
    </Box>
  );
}
