'use client';

import { useEffect, useState, useRef } from 'react';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import { motion } from 'framer-motion';

import AppBar from '@/components/AppBar/AppBar';
import MiniMenu from '@/components/AppBar/MiniMenu';
import MainHero from '../../src/app/Home/MainHero/page';
import WhyItMatters from '@/components/Home/whyitmatters/page';
import Footer from '@/components/Home/Footer/Footer';
import Footer2 from './Home/Footer2/page';
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

  const footerRef = useRef<HTMLDivElement>(null);
  const topSentinelRef = useRef<HTMLDivElement>(null);
  const endSentinelRef = useRef<HTMLDivElement>(null);

  const sectionRefs: Record<
    'WhyItMatters' | 'Paper Bags' | 'Paper Boxes' | 'Paper Covers' | 'Footer',
    React.RefObject<HTMLDivElement | null>
  > = {
    'WhyItMatters': useRef<HTMLDivElement>(null),
    'Paper Bags': useRef<HTMLDivElement>(null),
    'Paper Boxes': useRef<HTMLDivElement>(null),
    'Paper Covers': useRef<HTMLDivElement>(null),
    'Footer': useRef<HTMLDivElement>(null),
  };

  const showMiniMenu =
    Boolean(activeSection) &&
    activeSection !== 'Footer' &&
    activeSection !== 'WhyItMatters';

  const showAppBar = !showMiniMenu;

  useEffect(() => {
    console.log(
      `🔀 showMiniMenu: ${showMiniMenu} | showAppBar: ${showAppBar} | activeSection: ${activeSection}`
    );
  }, [showMiniMenu, showAppBar, activeSection]);

  // Section observer
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const scrollY = window.scrollY;
        const scrollDown = scrollY > lastY;
        setLastY(scrollY);

        console.log(`⬇️ Scrolling down? ${scrollDown}`);
        const visible = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio > 0.05)
          .map((entry) => {
            const section = (entry.target as HTMLElement).dataset.section!;
            const y = (entry.target as HTMLElement).getBoundingClientRect().top;
            const ratio = entry.intersectionRatio;
            console.log(
              `📦 ${section}: isIntersecting=${entry.isIntersecting} ratio=${ratio.toFixed(3)}, y=${y.toFixed(1)}`
            );
            return { section, y, ratio };
          });

        if (visible.length === 0) return;

        let nextSection: string | null = null;

        if (scrollDown) {
          nextSection =
            visible.sort((a, b) => b.ratio - a.ratio)[0]?.section ??
            lastKnownSection.current;
        } else {
          const aboveFold = visible.filter((v) => v.y < window.innerHeight * 0.5);
          nextSection =
            aboveFold.sort((a, b) => a.y - b.y)[0]?.section ??
            visible.sort((a, b) => b.ratio - a.ratio)[0]?.section ??
            lastKnownSection.current;
        }

        if (nextSection && nextSection !== activeSection) {
          lastKnownSection.current = nextSection;
          setActiveSection(nextSection);
          console.log(`🧭 Active section: ${nextSection}`);
        }
      },
      {
        threshold: [0.05, 0.1, 0.3, 0.5],
        rootMargin: '-10% 0px -40% 0px',
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
  }, [isMobile, activeSection, lastY, sectionRefs]);

  // Sentinel observer (top & bottom)
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === topSentinelRef.current && entry.isIntersecting) {
            setActiveSection(null);
            console.log('🔼 Top sentinel triggered: clear activeSection');
          }
          if (entry.target === endSentinelRef.current && entry.isIntersecting) {
            setActiveSection(null);
            console.log('🔽 End sentinel triggered: clear activeSection');
          }
        });
      },
      {
        threshold: 0.01,
        rootMargin: '0px 0px -90% 0px',
      }
    );

    if (topSentinelRef.current) observer.observe(topSentinelRef.current);
    if (endSentinelRef.current) observer.observe(endSentinelRef.current);

    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <main style={{ overflow: 'visible' }}>
      {/* AppBar + MiniMenu */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          zIndex: 2000,
          backgroundColor: '#fff',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        }}
      >
        <MotionBox
          initial={false}
          animate={{
            opacity: showAppBar ? 1 : 0,
            y: showAppBar ? 0 : -20,
            pointerEvents: showAppBar ? 'auto' : 'none',
          }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
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
          transition={{ duration: 0.3, ease: 'easeOut' }}
          sx={{ position: 'absolute', width: '100%', zIndex: 1301 }}
        >
          <MiniMenu
            isMobile={isMobile}
            showMenuBar={showMiniMenu}
            activeSection={activeSection}
          />
        </MotionBox>
      </Box>

      {/* Page Content */}
      <Box sx={{ mt: '64px' }}>
        <div ref={topSentinelRef} style={{ height: '1px' }} />

        <MainHero />
        <WhyItMatters sectionRefs={sectionRefs} />
        <PaperBagsCategory sectionRefs={sectionRefs} />
        <PaperBoxesCategory sectionRefs={sectionRefs} />
        <PaperCoversCategory sectionRefs={sectionRefs} />

        <div ref={endSentinelRef} style={{ height: '1px' }} />
        <Footer ref={footerRef} />
        <div ref={endSentinelRef} style={{ height: '1px' }} />
        <Footer2 />
      </Box>
    </main>
  );
}
