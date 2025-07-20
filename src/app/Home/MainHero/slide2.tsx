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
        mt: { xs: '56px', sm: '64px' },
        height: '100%',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        backgroundColor: '#fff',
        color: '#000',
        py: { xs: 1, sm: 0 },
        px: { xs: 2, sm: 6 },
      }}
    >
      {/* Left Side: Animated Words */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pb: { xs: 0.5, sm: 0 },
          mt: { xs: '-20%', sm: 0 },
        }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              display: 'flex',
              gap: '12px',
              justifyContent: isMobile ? 'center' : 'right', // Center for mobile, right for desktop
              alignItems: 'center',
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

      {/* Right Side */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isMobile ? 'center' : 'flex-start',
          textAlign: isMobile ? 'center' : 'left',
          gap: isMobile ? 0 : 1.5,
        }}
      >
        {/* Title */}
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: '0.95rem', sm: '2rem', md: '2.8rem' },
            color: '#1976d2',
            mt: { xs: '-20%', sm: 0 }, // Moved title up by 20% for mobile
          }}
        >
          We Print in Hindi, Tamil, Telugu, Kannada & More.
        </Typography>

        {/* Subtitle and badge for Desktop */}
        {!isMobile && (
          <>
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: '1.2rem',
                color: '#555',
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
              }}
            >
              🇮🇳 India’s Regional Languages Supported
            </Box>
          </>
        )}

        {/* Icon Row */}
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            fontSize: { xs: '0.75rem', sm: '1.4rem' },
            justifyContent: 'center',
          }}
        >
          <span>A</span>
          <span>आ</span>
          <span>అ</span>
          <span>அ</span>
        </Box>

        {/* CTA Button */}
        <Button
          variant="contained"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.75rem', sm: '1rem' },
            backgroundColor: '#f57c00',
            color: '#fff',
            px: 2,
            py: 0.6,
            mt: isMobile ? 0.5 : 2,
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
