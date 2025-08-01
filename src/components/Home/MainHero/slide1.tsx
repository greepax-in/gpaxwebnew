'use client';

import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';

export default function Slide1() {
  const isDesktop = useMediaQuery('(min-width:600px)');
  const titleLine1 = 'Sustainable Paper Packaging.';
  const titleLine2 = 'Made for the Planet Earth';
  const descDesktop =
    'Thoughtfully designed to replace plastic, protect nature, and empower your brand';
  const descMobile =
    'Eco-friendly bags, boxes & covers for a greener future.';

  const scrollToNext = () => {
    const el = document.getElementById('next-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/images/home/hero/eco-friendly-paper-bags.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fff',
        // py: { xs: 1.5, sm: 0 },
      }}
    >
      {/* Overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: isDesktop
            ? 'rgba(255, 255, 255, 0.4)'
            : 'rgba(234, 233, 233, 0.3)',
          zIndex: 1,
        }}
      />

      {/* Animated Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1280px',
          width: '100%',
          padding: '0 1rem',
          textAlign: 'center',
        }}
      >
        {/* Heading */}
        <h1
          style={{
            color: '#00040a',
            fontWeight: 700,
            fontSize: 'clamp(1.2rem, 4.2vw, 2.8rem)',
            margin: 0,
            lineHeight: 1.2,
            textShadow: '0px 2px 6px rgba(245, 241, 241, 0.5)',
          }}
        >
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {titleLine1}
          </motion.span>
          <br />
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            {titleLine2}
          </motion.span>
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: isDesktop
              ? 'clamp(1rem, 2vw, 1.4rem)'
              : 'clamp(0.75rem, 2vw, 1rem)',
            color: '#006d9fff',
            fontWeight: 400,
            marginTop: isDesktop ? '1.6rem' : '3.3rem',
            paddingInline: isDesktop ? 16 : 6,
            lineHeight: 1.4,
          }}
        >
          {isDesktop ? descDesktop : descMobile}
        </p>

        {/* CTA Button */}
        <Box
          component="button"
          onClick={scrollToNext}
          sx={{
            background: '#2e7d32',
            color: '#fff',
            borderRadius: '12px',
            padding: isDesktop ? '1rem 2.2rem' : '0.4rem 1rem',
            fontWeight: 600,
            fontSize: 'clamp(0.8rem, 2vw, 1.2rem)',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
            mt: isDesktop ? 4 : 1,
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: '#388e3c',
              transform: 'scale(1.05)',
            },
          }}
        >
          🌍 Explore Eco Products
        </Box>
      </motion.div>
    </Box>
  );
}
