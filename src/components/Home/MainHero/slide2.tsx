'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, useMediaQuery } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

const WORDS = [
  { text: 'हिंदी', color: '#388e3c' },
  { text: 'తెలుగు', color: '#1976d2' },
  { text: 'தமிழ்', color: '#f57c00' },
  { text: 'English', color: '#d32f2f' },
  { text: 'ಕನ್ನಡ', color: '#7b1fa2' },
  { text: 'বাঙ্গালী', color: '#00796b' },
];

export default function HeroSlide() {
  const [index, setIndex] = useState(0);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 2) % WORDS.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentWords = [
    WORDS[index],
    WORDS[(index + 1) % WORDS.length],
  ];

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        backgroundColor: '#fff',
        color: '#000',
        py: { xs: 1, sm: 0 },
        px: { xs: 2, sm: 6 },
      }}
    >
      {/* Left: Animated Languages */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: { xs: '-20%', sm: 0 },
          pb: { xs: 0.5, sm: 0 },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 30, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -30, opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.6,
              ease: [0.42, 0, 0.58, 1],
            }}
            style={{
              display: 'flex',
              gap: isMobile ? '12px' : '32px',
              justifyContent: isMobile ? 'center' : 'flex-end',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            {currentWords.map((word, i) => (
              <Typography
                key={i}
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '3.5rem', sm: '5rem' },
                  color: word.color,
                  whiteSpace: 'nowrap',
                }}
              >
                {word.text}
              </Typography>
            ))}
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Right Side: Text + CTA */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
          gap: isMobile ? 0 : 1.5,
          pl: isMobile ? 0 : 4,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.95rem', sm: '2rem', md: '2.8rem' },
            color: '#1976d2',
            lineHeight: 1.3,
            mt: { xs: '-20%', sm: 0 },
          }}
        >
          We Print in Hindi, Tamil, Telugu, Kannada & More.
        </Typography>

        {/* Subtitle */}
        {!isMobile && (
          <>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '1.2rem',
                color: '#555',
                mt: 1,
              }}
            >
              Build deeper connections with regional language packaging.
            </Typography>

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
                px: 2,
                py: 0.5,
                fontSize: '0.9rem',
                color: '#444',
                fontWeight: 500,
                mt: 1,
              }}
            >
              🇮🇳 India’s Regional Languages Supported
            </Box>
          </>
        )}

        {/* Icon row */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.4,
            fontSize: { xs: '0.75rem', sm: '1.4rem' },
            mt: isMobile ? 1 : 2,
            justifyContent: 'center',
          }}
        >
          <motion.span whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.2 }}>A</motion.span>
          <motion.span whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.4 }}>आ</motion.span>
          <motion.span whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.6 }}>అ</motion.span>
          <motion.span whileInView={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ delay: 0.8 }}>அ</motion.span>
        </Box>

        {/* CTA */}
        <Button
          variant="contained"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '1rem' },
            backgroundColor: '#f57c00',
            color: '#fff',
            px: 2,
            py: 0.6,
            mt: isMobile ? 0.5 : 2.4,
            '&:hover': {
              backgroundColor: '#ef6c00',
            },
          }}
        >
          Go Desi with Your Design
        </Button>
      </Box>
    </Box>
  );
}
