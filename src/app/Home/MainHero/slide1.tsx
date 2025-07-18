'use client';

import React from 'react';
import { Box, useMediaQuery } from '@mui/material';

export default function Slide1() {
  const isDesktop = useMediaQuery('(min-width:600px)');
  const title = 'Sustainable Paper Packaging. Made for the Planet';
  const desc = 'Sustainable Paper Packaging. Made for the Planet.';
  const cta = [
    {
      label: 'Explore Products',
      color: '#2e7d32',
      onClick: () => {
        window.location.href = '/products'; // ✅ Optional: Link to products
      },
    },
  ];

  return (
    <Box
      sx={{
        width: '100vw',
        height: { xs: '25vh', sm: '100vh' },
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: 'url(/images/home/hero/eco-friendly-paper-bags.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: '#fff', // ✅ Fix black flicker on iOS
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
          backgroundColor: 'rgba(147, 145, 145, 0.3)',
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          maxWidth: '1280px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <h1
          style={{
            color: '#002f76ff',
            fontWeight: 700,
            margin: '0 0 0.5rem',
            textAlign: 'center',
            width: '100%',
            fontSize: 'clamp(1.4rem, 6vw, 4rem)',
            textShadow: '0px 2px 6px rgba(0, 0, 0, 0.5)',
            letterSpacing: isDesktop ? '0.5px' : 'normal',
          }}
        >
          {title}
        </h1>

        {/* Desktop only description */}
        {isDesktop && (
          <h2
            style={{
              fontSize: 'clamp(1rem, 2.8vw, 2.2rem)',
              color: 'rgba(3, 119, 47, 1)',
              marginBottom: 24,
              textAlign: 'center',
              width: '100%',
              textShadow: '0px 2px 4px rgba(0, 0, 0, 0.4)',
            }}
          >
            {desc}
          </h2>
        )}

        {cta.map((btn) => (
          <Box
            key={btn.label}
            sx={{
              background: btn.color,
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: isDesktop ? '1rem 2rem' : '0.6rem 1.2rem',
              fontWeight: 600,
              fontSize: 'clamp(0.8rem, 2vw, 1.5rem)',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              marginTop: isDesktop ? 2 : 1,
              transition: isDesktop ? 'transform 0.3s ease, background-color 0.3s' : 'none',
              '&:hover': isDesktop
                ? {
                    transform: 'scale(1.05)',
                    backgroundColor: '#388e3c',
                  }
                : {},
            }}
            onClick={btn.onClick}
            component="button"
          >
            {btn.label}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
