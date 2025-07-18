'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import Slide1 from './slide1';
import Slide2 from './slide2';
import Slide3 from './slide3';
import { AnimatePresence, motion } from 'framer-motion';

const slides = [<Slide1 />, <Slide2 />,  <Slide3 />];

const MainHeroPage: React.FC = () => {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const isSlide2 = active === 1;
    const duration = isSlide2 ? 9000 : 4000;

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
      position: 'absolute',
    }),
    center: {
      x: 0,
      opacity: 1,
      position: 'relative',
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 600 : -600,
      opacity: 0,
      position: 'absolute',
    }),
  };

  return (
    <Box
      sx={{
        height: { xs: '25vh', sm: '100vh' },
        width: '100vw',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fff', // ✅ Fix iOS black flicker
      }}
    >
      <Box
        sx={{
          width: '100vw',
          height: { xs: '25vh', sm: '100vh' },
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: '#fff', // ✅ Ensure consistency
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
              width: '100vw',
              height: '100%',
              backgroundColor: '#fff', // ✅ Each slide motion container has bg
            }}
          >
            {slides[active]}
          </motion.div>
        </AnimatePresence>
      </Box>
    </Box>
  );
};

export default MainHeroPage;
