'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const phrases = [
  'తెలుగు', 'हिंदी', 'বাঙ্গালী', 'தமிழ்', 'ಕನ್ನಡ',
  'മലയാളം', 'ગુજરાતી', 'ଓଡ଼ିଆ',
];

const printVariants = [
  { label: 'Plain', icon: '📄' },
  { label: 'Single Color', icon: '🎨' },
  { label: 'Multi Color', icon: '🌈' },
];

const orbitSize = 90;

const MotionChip = motion(Chip);

const MultilanguageCTA = () => {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: '28vh', sm: '40vh' },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        px: 2,
        py: 3,
        gap: 4,
        mb: 4,
        background: 'radial-gradient(circle, #e7f5ff 60%, #d4eaff 100%)',
      }}
    >
      {/* Rotating Phrases */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: `${orbitSize}%`,
          height: `${orbitSize}%`,
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {phrases.map((text, index) => {
          const angle = (index / phrases.length) * 360 + rotation;
          const radius = orbitSize / 2;
          const x = radius * Math.cos((angle * Math.PI) / 180);
          const y = radius * Math.sin((angle * Math.PI) / 180);

          return (
            <motion.div
              key={text}
              style={{
                position: 'absolute',
                left: `calc(50% + ${x}%)`,
                top: `calc(50% + ${y}%)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontSize: { xs: '1.1rem', sm: '1.6rem' },
                  color: '#b919d2ff',
                  opacity: 0.4,
                  fontWeight: 600,
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {text}
              </Typography>
            </motion.div>
          );
        })}
      </Box>

      {/* Heading */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1rem', sm: '2rem' },
          textAlign: 'center',
          color: '#0d47a1',
          zIndex: 1,
        }}
      >
        Choose from multiple Indian languages
      </Typography>

      {/* Chips with Hover Animations */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ zIndex: 1 }}
      >
        {printVariants.map((variant) => (
          <MotionChip
            key={variant.label}
            label={`${variant.icon} ${variant.label}`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.9rem' },
              px: 1.5,
              py: 1,
              fontWeight: 700,
              backgroundColor: '#0890f1ff',
              color: '#f7f8f9ff',
              borderRadius: '20px',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          />
        ))}
      </Stack>

      {/* WhatsApp CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ zIndex: 1 }}
      >
        <Button
          variant="contained"
          startIcon={<WhatsAppIcon />}
          href="https://wa.me/91XXXXXXXXXX?text=I'm%20interested%20in%20custom%20printing"
          target="_blank"
          sx={{
            backgroundColor: '#25D366',
            color: '#fff',
            fontWeight: 700,
            borderRadius: 2,
            fontSize: { xs: '0.9rem', sm: '1.2rem' },
            px: 4,
            py: { xs: 1.2, sm: 1.6 },
            '&:hover': { backgroundColor: '#1ebe5d' },
          }}
        >
          Chat on WhatsApp
        </Button>
      </motion.div>
    </Box>
  );
};

export default MultilanguageCTA;
