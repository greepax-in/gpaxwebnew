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
];

const printVariants = [
  { label: 'Plain', icon: '📄' },
  { label: 'Single Color', icon: '🎨' },
  { label: 'Multi Color', icon: '🌈' },
];

const MultilanguageCTA = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [animatedWords, setAnimatedWords] = useState<
    { phrase: string; id: number; top: number; left: number }[]
  >([]);

  const getRandomPosition = () => ({
    top: Math.random() * 20 + 20,
    left: Math.random() * 70 + 20,
  });

  const getTwoUniquePhrases = () => {
    const shuffled = [...phrases].sort(() => 0.5 - Math.random());
    return [shuffled[0], shuffled[1]];
  };

  useEffect(() => {
    const updateWords = () => {
      const [first, second] = getTwoUniquePhrases();
      setAnimatedWords([
        {
          phrase: first,
          id: Date.now(),
          ...getRandomPosition(),
        },
        {
          phrase: second,
          id: Date.now() + 1,
          ...getRandomPosition(),
        },
      ]);
    };

    updateWords();
    const interval = setInterval(updateWords, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: '200px', sm: '45vh' },
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        px: 2,
        py: 4,
        gap: 1,
        background: 'radial-gradient(circle, #e7f5ff 60%, #d4eaff 100%)',
      }}
    >
      {/* Floating Words Layer */}
      <Box
        sx={{
          position: 'absolute',
        //   top: isMobile ? 10 : 20,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence>
          {animatedWords.map(({ phrase, top, left, id }) => (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.5, y: -20 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 2 }}
              style={{
                position: 'absolute',
                top: `${top}%`,
                left: `${left}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Typography
                variant="h3"
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
                {phrase}
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

      {/* WhatsApp Button */}


      {/* Print Variant Chips */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        // flexWrap="wrap"
        sx={{ zIndex: 1 }}
      >
        {printVariants.map((variant) => (
          <Chip
            key={variant.label}
            label={`${variant.icon} ${variant.label}`}
            sx={{
              fontSize: { xs: '0.75rem', sm: '0.9rem' },
              px: 1,
              py: 1,
              fontWeight: 700,
              backgroundColor: '#0890f1ff',
              color: '#f7f8f9ff',
              borderRadius: '20px',
            }}
          />
        ))}
      </Stack>

    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        style={{ zIndex: 1
            // top: isMobile ? '10px' : '20px',
         }}
      >
        <Button
          variant="contained"
          startIcon={<WhatsAppIcon />}
          href="https://wa.me/91XXXXXXXXXX?text=I'm%20interested%20in%20custom%20printing"
          target="_blank"
          sx={{
            backgroundColor: '#25D366',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            fontSize: { xs: '0.8rem', sm: '1rem' },
            top: isMobile ? '20px' : '20px',
            px: 4,
            py: 1.2,
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
