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
  'తెలుగు',
  'हिंदी',
  'বাঙ্গালী',
  'தமிழ்',
  'ಕನ್ನಡ',
  'മലയാളം',
  'ગુજરાતી',
  'ଓଡ଼ିଆ',
];

const printVariants = [
  { label: 'Plain', icon: '📄' },
  { label: 'Single Color', icon: '🎨' },
  { label: 'Multi Color', icon: '🌈' },
];

interface PhraseInstance {
  id: number;
  text: string;
  top: number;
  left: number;
}

const MultilanguageCTA = () => {
//   const isMobile = useMediaQuery('(max-width:600px)');
  const [visiblePhrases, setVisiblePhrases] = useState<PhraseInstance[]>([]);

  const spawnPhrase = () => {
    const randomText = phrases[Math.floor(Math.random() * phrases.length)];
    const top = Math.random() * 60 + 10;
    const left = Math.random() * 60 + 10;
    const id = Date.now() + Math.random();

    const phrase = { id, text: randomText, top, left };
    setVisiblePhrases((prev) => [...prev, phrase]);

    setTimeout(() => {
      setVisiblePhrases((prev) => prev.filter((p) => p.id !== id));
    }, 3500);
  };

  useEffect(() => {
    spawnPhrase();
    const interval = setInterval(() => {
      spawnPhrase();
      spawnPhrase(); // 2 at a time
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: '20vh', sm: '35vh' },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        px: 1,
        py: 1,
        gap: 4,
        mb: 2, // Space before Why It Matters
        background: 'radial-gradient(circle, #e7f5ff 60%, #d4eaff 100%)',
      }}
    >
      {/* Floating Words */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {visiblePhrases.map(({ id, text, top, left }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.5, x: 10, y: -10 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 3, ease: 'easeInOut' }}
              style={{
                position: 'absolute',
                top: `${top}%`,
                left: `${left}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.5rem', sm: '2.5rem' },
                  color: '#b919d2ff',
                  opacity: 0.5,
                  textShadow: '0px 0px 6px rgba(25, 118, 210, 0.3)',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {text}
              </Typography>
            </motion.div>
          ))}
        </AnimatePresence>
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

      {/* Chips */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        sx={{ zIndex: 1 }}
      >
        {printVariants.map((variant) => (
          <Chip
            key={variant.label}
            label={`${variant.icon} ${variant.label}`}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.9rem' },
              px: 1.5,
              py: 1,
              fontWeight: 500,
              backgroundColor: '#0890f1ff',
              color: '#f7f8f9ff',
              borderRadius: '20px',
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
