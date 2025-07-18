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
        height: { xs: '25vh', sm: '100vh' },
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        backgroundColor: '#fff', // ✅ force white background
        color: '#000',           // ✅ prevent iOS auto white text
      }}
    >
      {/* Animated Words */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'center' : 'flex-end',
          px: { xs: 1, sm: 4, md: 6 },
          py: { xs: 2, sm: 0 },
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            justifyContent: isMobile ? 'center' : 'flex-end',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: isMobile ? 'center' : 'flex-end',
                backgroundColor: '#fff', // ✅ prevent black flash
              }}
            >
              {currentWords.map((word, i) => (
                <Typography
                  key={i}
                  variant="h2"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '3rem', sm: '4.5rem', md: '5.5rem' },
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
      </Box>

      {/* Static Right Side Content */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: isMobile ? 'center' : 'flex-start',
          px: { xs: 2, sm: 4, md: 6 },
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.2rem', sm: '2.5rem', md: '3.5rem' },
            color: '#1976d2',
            mb: 1,
          }}
        >
          Multi Language Designs
        </Typography>
        {!isMobile && (
          <Typography
            variant="body1"
            sx={{
              fontWeight: 400,
              fontSize: { xs: '0.9rem', sm: '1.2rem', md: '1.5rem' },
              color: '#555',
              mb: 2,
            }}
          >
            Brand with your own language
          </Typography>
        )}
        <Button
          variant="contained"
          sx={{
            fontWeight: 600,
            fontSize: '0.9rem',
            px: 3,
            py: 1,
          }}
        >
          CHAT WITH US
        </Button>
      </Box>
    </Box>
  );
}
