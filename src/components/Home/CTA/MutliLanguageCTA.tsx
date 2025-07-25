'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
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
  const isMobile = useMediaQuery('(max-width:600px)');
  const [rotation, setRotation] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  // Orbit animation for desktop
  useEffect(() => {
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Mobile phrase rotator
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isMobile]);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: '32vh', sm: '45vh' },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        px: 2,
        py: 5,
        gap: 4,
        mb: 4,
        background: 'radial-gradient(circle, #e7f5ff 60%, #d4eaff 100%)',
      }}
    >
      {/* Phrases */}
      {isMobile ? (
   <AnimatePresence mode="wait">
    <motion.div
      key={phrases[currentPhraseIndex]}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'absolute',
        top: '26%',
        left: '37%',
transform: 'translate(-50%, -50%)',
        zIndex: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontSize: '2rem',
          color: '#b919d2ff',
          textAlign: 'center',
          fontWeight: 600,
          whiteSpace: 'nowrap',
        }}
      >
        {phrases[currentPhraseIndex]}
      </Typography>
    </motion.div>
  </AnimatePresence>
      ) : (
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
                animate={{ opacity: 0.4 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1rem', sm: '1.4rem' },
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
      )}

      {/* Heading */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '1rem', sm: '2rem' },
          textAlign: 'center',
          color: '#0d47a1',
          zIndex: 2,
        }}
      >
        Choose from multiple Indian languages
      </Typography>

      {/* Chips */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{
          zIndex: 2,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          px: 2,
          mt: 2,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {printVariants.map((variant, idx) => (
          <MotionChip
            key={variant.label}
            label={`${variant.icon} ${variant.label}`}
            whileHover={{
              scale: 1.1,
              boxShadow: '0px 4px 20px rgba(8,144,241,0.15)',
            }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              delay: idx * 0.1,
            }}
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
              boxShadow: {
                xs: '0px 2px 8px rgba(8,144,241,0.10)',
                sm: '0px 4px 16px rgba(8,144,241,0.13)',
              },
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
        viewport={{ once: false, amount: 0.4 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ zIndex: 2 }}
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
