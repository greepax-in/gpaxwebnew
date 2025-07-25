'use client';

import React from 'react';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { motion, easeInOut } from 'framer-motion';

const logos = [
  {
    src: '/images/logos/logo1.png',
    alt: 'Brand One',
  },
  {
    src: '/images/logos/logo2.png',
    alt: 'Brand Two',
  },
  {
    src: '/images/logos/logo3.png',
    alt: 'Brand Three',
  },
  {
    src: '/images/logos/logo4.png',
    alt: 'Brand Four',
  },
  {
    src: '/images/logos/logo5.png',
    alt: 'Brand Five',
  },
  {
    src: '/images/logos/logo6.png',
    alt: 'Brand Six',
  },
  {
    src: '/images/logos/logo7.png',
    alt: 'Brand Seven',
  },
  {
    src: '/images/logos/logo8.png',
    alt: 'Brand Eight',
  },
];

// Framer motion variants for stagger animation
const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      duration: 0.5,
      ease: easeInOut, // Use a valid EasingFunction
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
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 48,
        paddingBottom: 80,
        maxWidth: '1200px',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        fontWeight="bold"
        textAlign="center"
        mb={4}
      >
        Trusted By Leading Brands
      </Typography>

      <Box
        component={motion.div}
        variants={containerVariants}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(2, 1fr)',
          sm: 'repeat(3, 1fr)',
          md: 'repeat(4, 1fr)',
        }}
        gap={3}
        alignItems="center"
        justifyItems="center"
      >
        {visibleLogos.map((logo) => (
          <Box
            key={logo.alt}
            component={motion.img}
            variants={itemVariants}
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            sx={{
              height: { xs: 50, sm: 60 },
              objectFit: 'contain',
              filter: 'grayscale(100%)',
              transition: '0.3s ease',
              '&:hover': {
                filter: 'grayscale(0%)',
              },
            }}
          />
        ))}
      </Box>
    </motion.section>
  );
}
