'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

// Shared data
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
  // const theme = useTheme();
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
        mt: isMobile ? 2 : 4, // ADDITION: Margin top to separate from Multilingual CTA
        minHeight: isMobile ? '20vh' : 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
      }}
    >
      {/* Heading */}
      <Typography
        variant="h2"
        fontWeight="bold"
        textAlign="center"
        gutterBottom
        sx={{
          fontSize: isMobile ? '1.1rem' : '2rem',
          color: '#2E7D32',
          mb: isMobile ? 1 : 4,
        }}
      >
        Protecting Earth for Every Child: Why Plastic-Free Packaging Matters
      </Typography>

      {/* Mobile: Animated Text */}
      {isMobile && (
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }} // Slightly quicker
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

      {/* Desktop: Grid of Cards */}
      {!isMobile && (
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            justifyContent: 'center',
            mt: 2,
          }}
        >
          {facts.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              transition={{ type: 'spring', stiffness: 300 }}
              style={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '16px',
                boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
                width: '22%',
                minWidth: 200,
              }}
            >
              <Box
                sx={{
                  fontSize: '2rem',
                  mb: 1,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </Box>
              <Typography fontWeight="bold" fontSize="1rem" gutterBottom>
                {item.title}
              </Typography>
              <Typography color="text.secondary" fontSize="0.875rem">
                {item.description}
              </Typography>
            </motion.div>
          ))}
        </Box>
      )}

      {/* Optional footer caption (desktop only) */}
      {!isMobile && (
        <Typography
          fontStyle="italic"
          textAlign="center"
          mt={4}
          color="text.primary"
        >
          We can't undo the damage, but we can make better choices now.
        </Typography>
      )}
    </Box>
  );
}
