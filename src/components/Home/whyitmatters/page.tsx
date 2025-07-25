'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
  Grid,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

const facts = [
  {
    icon: '🌱',
    title: 'Only 9% of plastic waste is recycled',
    description: 'Most ends up in oceans and landfills.',
  },
  {
    icon: '🐢',
    title: '100,000+ marine animals die yearly',
    description: 'Choked by plastic in our seas.',
  },
  {
    icon: '🌧️',
    title: 'Floods are rising across India',
    description: 'Climate change is more frequent.',
  },
  {
    icon: '🌾',
    title: 'Soil fertility is declining',
    description: 'Waste is damaging our farmland.',
  },
];

export default function WhyItMatters() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % facts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile]);

  const current = facts[index];

  return (
    <Box
      component="section"
      sx={{
        backgroundColor: '#f1fdf4',
        px: isMobile ? 2 : 10,
        py: isMobile ? 0 : 8,
        // mt: isMobile ? 2 : 4,
        minHeight: isMobile ? '20vh' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
      }}
    >
      {/* Heading */}
      <Typography
        variant="h2"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{
          fontSize: isMobile ? '1.1rem' : '2.2rem',
          color: '#2E7D32',
          mb: isMobile ? 1 : 4,
          lineHeight: 1.3,
        }}
      >
        🌍 Why Plastic-Free Packaging Matters
      </Typography>

      {/* Mobile: Rotating fact */}
      {isMobile && (
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            style={{ width: '100%' }}
          >
            <Typography fontSize="1rem" fontWeight="bold">
              {current.icon} {current.title}
            </Typography>
            <Typography fontSize="0.85rem" color="text.secondary">
              → {current.description}
            </Typography>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Desktop: Animated Grid */}
      {!isMobile && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
          variants={{
            hidden: {},
            visible: {},
          }}
        >
          <Grid container spacing={4} justifyContent="center">
            {facts.map((item, idx) => (
              <Grid size={{xs: 12, sm: 6, md: 3}} key={idx}>
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 30 }}
                  transition={{ duration: 0.5 }}
                  style={{
                    background: 'linear-gradient(to top, #ffffff, #f8fff8)',
                    borderRadius: '16px',
                    padding: '20px',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.05)',
                    height: '100%',
                  }}
                >
                  <Box
                    sx={{
                      fontSize: '2.2rem',
                      mb: 1,
                      color: '#2E7D32',
                      display: 'flex',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </Box>
                  <Typography
                    fontWeight="bold"
                    fontSize="1rem"
                    gutterBottom
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    color="text.secondary"
                    fontSize="0.875rem"
                  >
                    {item.description}
                  </Typography>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      )}

      {/* Footer caption */}
      {!isMobile && (
        <Typography
          fontStyle="italic"
          textAlign="center"
          mt={5}
          color="text.primary"
        >
          We can&apos;t undo the damage, but we can make better choices now.
        </Typography>
      )}
    </Box>
  );
}
