'use client';

import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { motion, Variants  } from 'framer-motion';

const logos = [
  { src: '/images/logos/logo1.png', alt: 'Brand One' },
  { src: '/images/logos/logo2.png', alt: 'Brand Two' },
  { src: '/images/logos/logo3.png', alt: 'Brand Three' },
  { src: '/images/logos/logo4.png', alt: 'Brand Four' },
  { src: '/images/logos/logo5.png', alt: 'Brand Five' },
  { src: '/images/logos/logo6.png', alt: 'Brand Six' },
  { src: '/images/logos/logo7.png', alt: 'Brand Seven' },
  { src: '/images/logos/logo8.png', alt: 'Brand Eight' },
];

const containerVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      when: 'beforeChildren',
      staggerChildren: 0.1,
      duration: 0.5,
      ease: [0.42, 0, 0.58, 1], // cubic-bezier for easeInOut
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function CustomerLogosSection() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const visibleLogos = isMobile ? logos.slice(0, 2) : logos;

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '3rem 1rem 5rem 1rem',
      }}
    >
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        fontWeight="bold"
        textAlign="center"
        mb={4}
        color="#0d47a1"
      >
        Trusted By Leading Brands
      </Typography>

      <Box
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
        gap={{ xs: 3, sm: 4 }}
        justifyItems="center"
        alignItems="center"
      >
        {visibleLogos.map((logo) => (
          <motion.img
            key={logo.alt}
            src={logo.src}
            alt={logo.alt}
            variants={itemVariants}
            loading="lazy"
            whileHover={{ scale: 1.06 }}
            transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            style={{
              height: isMobile ? 48 : 60,
              objectFit: 'contain',
              filter: 'grayscale(100%) opacity(0.6)',
              transition: '0.3s ease',
              cursor: 'default',
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.filter = 'grayscale(0%) opacity(1)')
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.filter = 'grayscale(100%) opacity(0.6)')
            }
          />
        ))}
      </Box>
    </motion.section>
  );
}
