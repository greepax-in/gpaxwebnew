'use client';

import { useEffect, useState, useRef } from 'react';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import { motion } from 'framer-motion';
import AppBar from '@/components/AppBar/AppBar';
import MiniMenu from '@/components/AppBar/MiniMenu';
import MainHero from '../../src/app/Home/MainHero/page';
import WhyItMatters from './Home/WhyItMatters/page';
import ProductCategories from './Home/ProductCategories/page';

const MotionBox = motion(Box);

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [showMiniMenu, setShowMiniMenu] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowMiniMenu(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <main>
      {/* Render both AppBar and MiniMenu, toggle via animation */}
      <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100%', zIndex: 1400 }}>
        <MotionBox
          initial={false}
          animate={{
            opacity: !showMiniMenu ? 1 : 0,
            y: !showMiniMenu ? 0 : -20,
            pointerEvents: !showMiniMenu ? 'auto' : 'none',
          }}
          transition={{ duration: 0.3 }}
        >
          <AppBar />
        </MotionBox>

        <MotionBox
          initial={false}
          animate={{
            opacity: showMiniMenu ? 1 : 0,
            y: showMiniMenu ? 0 : -20,
            pointerEvents: showMiniMenu ? 'auto' : 'none',
          }}
          transition={{ duration: 0.3 }}
          sx={{
            position: 'absolute', // stack on top of AppBar
            width: '100%',
            zIndex: 1401,
          }}
        >
          <MiniMenu isMobile={isMobile} showMenuBar={showMiniMenu} />
        </MotionBox>
      </Box>

      {/* Main content */}
      <Box sx={{ mt: '64px' }}>
        <MainHero />
        <WhyItMatters />
        <div ref={sectionRef}>
          <ProductCategories />
        </div>
      </Box>
    </main>
  );
}
