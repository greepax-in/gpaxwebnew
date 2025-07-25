'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import Slide1 from './slide1';
import Slide2 from './slide2';
import Slide3 from './slide3';

const slides = [
  <Slide1 key="slide1" />,
  <Slide2 key="slide2" />,
  <Slide3 key="slide3" />,
];

const MainHeroPage: React.FC = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const duration = active === 1 ? 9000 : active === 2 ? 4400 : 5000;
    const timer = setTimeout(() => {
      setDirection(1);
      setActive((prev) => (prev + 1) % slides.length);
    }, duration);
    return () => clearTimeout(timer);
  }, [active]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100vw' : '-100vw',
      opacity: 0,
      position: 'absolute' as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative' as const,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? '100vw' : '-100vw',
      opacity: 0,
      position: 'absolute' as const,
    }),
  };

  return (
    <Box
      aria-live="polite"
      sx={{
        width: '100vw',
        height: {
          xs: '30vh',
          sm: '95vh',
        },
        mt: {
          xs: '-12px',
        },
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fff',
      }}
    >
      <AnimatePresence custom={direction} initial={false} mode="wait">
        <motion.div
          key={active}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            type: 'tween',
            duration: 0.8,
            ease: 'easeInOut',
            opacity: { duration: 0.5 },
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          {slides[active]}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default MainHeroPage;
