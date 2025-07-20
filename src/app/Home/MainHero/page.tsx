'use client';

import React, { useState, useEffect } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import Slide1 from './slide1';
import Slide2 from './slide2';
import Slide3 from './slide3';

// Constants for AppBar heights
// const APPBAR_HEIGHT_MOBILE = 0;   // px
// const APPBAR_HEIGHT_DESKTOP = 0;  // px
// const DESKTOP_TOP_OFFSET = 0;

// const HERO_OFFSET_MOBILE = APPBAR_HEIGHT_MOBILE ;
// const HERO_OFFSET_DESKTOP = APPBAR_HEIGHT_DESKTOP + DESKTOP_TOP_OFFSET;

const slides = [
  <Slide1 key="slide1" />,
  <Slide2 key="slide2" />,
  <Slide3 key="slide3" />,
];

const MainHeroPage: React.FC = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    const duration = active === 1 ? 9000 : active === 2 ? 4400 : 4000;
    const timer = setTimeout(() => {
      setDirection(1);
      setActive((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, duration);
    return () => clearTimeout(timer);
  }, [active]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 600 : -600,
      opacity: 0,
      position: 'absolute' as const,
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative' as const,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 600 : -600,
      opacity: 0,
      position: 'absolute' as const,
    }),
  };

  return (
    <Box
      sx={{
        width: '100vw',
        height: {
          xs: `30vh`, // ✅ Cap total mobile hero height at 40% viewport
          sm: `100vh`,
        },
        mt: {
          xs: `-12px`,
          // sm: `${HERO_OFFSET_DESKTOP}px`,
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
          transition={{ type: 'spring', stiffness: 400, damping: 40 }}
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
