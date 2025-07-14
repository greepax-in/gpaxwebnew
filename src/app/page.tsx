'use client';

import { useEffect, useState, useRef } from 'react';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import { motion } from 'framer-motion';
import AppBar from '@/components/AppBar/AppBar';
import MiniMenu from '@/components/AppBar/MiniMenu';
import MainHero from '../../src/app/Home/MainHero/page';
import WhyItMatters from './Home/WhyItMatters/page';
import PaperBagsCategory from '@/components/Home/ProductCategories/PaperBags';
import PaperBoxesCategory from '@/components/Home/ProductCategories/PaperBoxes';
import PaperCoversCategory from '@/components/Home/ProductCategories/PaperCovers';

const MotionBox = motion(Box);

export default function Page() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [lastY, setLastY] = useState<number>(0);
  const lastKnownSection = useRef<string | null>(null);
  const showMiniMenu = Boolean(activeSection);

  type SectionKey = 'Paper Bags' | 'Paper Boxes' | 'Paper Covers';

  const sectionRefs: Record<SectionKey, React.RefObject<HTMLDivElement | null>> = {
    'Paper Bags': useRef<HTMLDivElement | null>(null),
    'Paper Boxes': useRef<HTMLDivElement | null>(null),
    'Paper Covers': useRef<HTMLDivElement | null>(null),
  };

  useEffect(() => {
    console.log('🧭 Active section:', activeSection);
  }, [activeSection]);

  useEffect(() => {
  if (!isMobile) return;

  const observer = new IntersectionObserver(
    (entries) => {
      const scrollY = window.scrollY;
      const scrollDown = scrollY > lastY;
      setLastY(scrollY);
      console.log('⬇️ Scrolling down?', scrollDown);

      const visible = entries
        .filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0.05)
        .map((entry) => {
          const section = (entry.target as HTMLElement).dataset.section!;
          const y = (entry.target as HTMLElement).getBoundingClientRect().top;
          const ratio = entry.intersectionRatio;
          console.log(`📦 ${section}: isIntersecting=${entry.isIntersecting} ratio=${ratio.toFixed(3)}, y=${y.toFixed(1)}`);
          return { section, y, ratio };
        });

      console.log('🧩 Visible Sections Count:', visible.length);
      console.log('🔍 Visible list:', visible.map(v => `${v.section} (y=${v.y.toFixed(1)})`).join(', '));

      if (visible.length === 0) {
        console.log(`🧭 Fallback to last known section: ${lastKnownSection.current}`);
        return;
      }

      let nextSection: string | null = null;

      if (scrollDown) {
        // When scrolling down, prefer the section with highest visibility
        nextSection = visible.sort((a, b) => b.ratio - a.ratio)[0]?.section ?? lastKnownSection.current;
      } else {
        // When scrolling up, prioritize the section closest to the top (above fold)
        const aboveFold = visible.filter(v => v.y < window.innerHeight * 0.5);
        nextSection =
          aboveFold.sort((a, b) => a.y - b.y)[0]?.section ??
          visible.sort((a, b) => b.ratio - a.ratio)[0]?.section ??
          lastKnownSection.current;
      }

      if (nextSection && nextSection !== activeSection) {
        lastKnownSection.current = nextSection;
        console.log(`✅ Set active section: ${nextSection}`);
        setActiveSection(nextSection);
      }
    },
    {
      threshold: [0.05, 0.1, 0.3, 0.5, 0.75],
      rootMargin: '-10% 0px -40% 0px', // Top bias for earlier detection
    }
  );

  const elements = Object.entries(sectionRefs)
    .map(([key, ref]) => {
      const el = ref.current;
      if (el) el.dataset.section = key;
      return el;
    })
    .filter((el): el is HTMLDivElement => el !== null);

  elements.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}, [isMobile, sectionRefs, activeSection]);


  // Optional: clear MiniMenu if scrolled back to top
  useEffect(() => {
    const clearIfAbove = () => {
      if (window.scrollY < 100 && activeSection) {
        setActiveSection(null);
        console.log('🔼 Cleared active section (scrolled above product area)');
      }
    };
    window.addEventListener('scroll', clearIfAbove);
    return () => window.removeEventListener('scroll', clearIfAbove);
  }, [activeSection]);

  return (
    <main style={{ overflow: 'visible' }}>
      {/* AppBar and MiniMenu Toggle */}
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
          sx={{ position: 'absolute', width: '100%', zIndex: 1401 }}
        >
          <MiniMenu isMobile={isMobile} showMenuBar={showMiniMenu} activeSection={activeSection} />
        </MotionBox>
      </Box>

      {/* Page content */}
      <Box sx={{ mt: '64px' }}>
        <MainHero />
        <WhyItMatters />
        <PaperBagsCategory sectionRefs={sectionRefs} />
        <PaperBoxesCategory sectionRefs={sectionRefs} />
        <PaperCoversCategory sectionRefs={sectionRefs} />
        <WhyItMatters />
      </Box>
    </main>
  );
}
