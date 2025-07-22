'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence, Variants  } from 'framer-motion';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
// import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
// import PaletteIcon from '@mui/icons-material/Palette';
// import PrintIcon from '@mui/icons-material/Print';

const chipEntry: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

const phrases = [
  'GreenPax speaks every Indian language – through print.',
  'भारत की हर भाषा में डिज़ाइन – ग्रीनपैक्स से',
  'எல்லா இந்திய மொழிகளிலும் பிரிண்ட் செய்வோம்',
  'ప్రతి భారతీయ భాషలో ముద్రణ అందించేది గ్రీన్‌ప్యాక్స్',
  'সব ভারতীয় ভাষায় ছাপা সম্ভব – গ্রীনপ্যাক্স নিয়ে',
];



const MultilanguageCTA = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: { xs: '300px', sm: '40vh' },
        background: '#fef6e4',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        px: 2,
        py: 3,
        gap: 2,
      }}
    >
      {/* Animated Language Text */}
      <Box sx={{ height: '2rem' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={phrases[currentPhraseIndex]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.3rem', sm: '2rem' },
                color: '#1976d2',
                textAlign: 'center',
              }}
            >
              {phrases[currentPhraseIndex]}
            </Typography>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Inline Chips as Subtitle with Entry + Hover Animation */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          mt: { xs: '2rem', sm: '2rem' },
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap',
        }}
      >
        <Typography
          variant="body2"
          sx={{
            color: '#333',
            fontWeight: 500,
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
          }}
        >
          Choose from
        </Typography>

        {[{
          label: 'Plain',
        //   icon: <FormatColorFillIcon fontSize="small" />,
          sx: { backgroundColor: '#795548' }
        }, {
          label: 'Single Color',
        //   icon: <PaletteIcon fontSize="small" />,
          sx: { backgroundColor: '#3f51b5' }
        }, {
          label: 'Multi Color',
        //   icon: <PrintIcon fontSize="small" />,
          sx: {
            background: 'linear-gradient(45deg, #3f51b5, #ff4081)',
            boxShadow: '0 0 6px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.4)'
          }
        }].map((chip, i) => (
          <motion.div
            key={chip.label}
            variants={chipEntry}
            initial="hidden"
            animate="visible"
            custom={i}
            whileHover={{ scale: 1.1 }}
          >
            <Chip
            //   icon={chip.icon}
              label={chip.label}
              sx={{
                ...chip.sx,
                color: '#fff',
                fontWeight: 600,
                fontSize: '0.95rem',
              }}
            />
          </motion.div>
        ))}

        <Typography
          variant="body2"
          sx={{
            color: '#333',
            fontWeight: 500,
            fontSize: { xs: '0.9rem', sm: '0.95rem' },
          }}
        >
          printing – now in multiple Indian languages.
        </Typography>
      </Box>

      {/* WhatsApp CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
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
