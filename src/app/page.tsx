'use client';

import { useEffect, useState, useRef } from 'react';
import { useMediaQuery, useTheme, Box } from '@mui/material';
import { motion } from 'framer-motion';

import AppBar from '@/components/AppBar/AppBar';
import MiniMenu from '@/components/AppBar/MiniMenu';
import MainHero from '../../src/app/Home/MainHero/page';
import WhyItMatters from './Home/WhyItMatters/page';
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
  const [inWhyItMatters, setInWhyItMatters] = useState(false);
  const [inFooter, setInFooter] = useState(false);

  const lastKnownSection = useRef<string | null>(null);

  const whyItMattersRef = useRef<HTMLDivElement | null>(null);
  const footerRef = useRef<HTMLDivElement | null>(null);
  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const endSentinelRef = useRef<HTMLDivElement | null>(null);

  const sectionRefs: Record<'Paper Bags' | 'Paper Boxes' | 'Paper Covers' | 'Footer', React.RefObject<HTMLDivElement | null>> = {
    'Paper Bags': useRef<HTMLDivElement>(null),
    'Paper Boxes': useRef<HTMLDivElement>(null),
    'Paper Covers': useRef<HTMLDivElement>(null),
    'Footer': footerRef,
  };

  const showMiniMenu = Boolean(activeSection) && !inWhyItMatters && !inFooter;
  const showAppBar = !showMiniMenu && (!activeSection || inFooter || inWhyItMatters);

  useEffect(() => {
    console.log(`🔀 showMiniMenu: ${showMiniMenu} | showAppBar: ${showAppBar} | inFooter: ${inFooter} | inWhyItMatters: ${inWhyItMatters} | activeSection: ${activeSection}`);
  }, [showMiniMenu, showAppBar, inFooter, inWhyItMatters, activeSection]);

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
            console.log(`📦 ${section}: isIntersecting=${entry.isIntersecting} ratio=${ratio.toFixed(3)}, y=${y.toFixed(1)}`);
            return { section, y, ratio };
          });

        if (visible.length === 0) return;

        let nextSection: string | null = null;

        if (scrollDown) {
          nextSection = visible.sort((a, b) => b.ratio - a.ratio)[0]?.section ?? lastKnownSection.current;
        } else {
          const aboveFold = visible.filter(v => v.y < window.innerHeight * 0.5);
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
  }, [isMobile, activeSection]);

  // WhyItMatters observer
  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInWhyItMatters(entry.isIntersecting);
        console.log(`🎯 WhyItMatters isIntersecting: ${entry.isIntersecting}`);
      },
      {
        threshold: 0.3,
        rootMargin: '-0% 0px -60% 0px',
      }
    );

    if (whyItMattersRef.current) observer.observe(whyItMattersRef.current);
    return () => observer.disconnect();
  }, [isMobile]);

  // Footer observer (adjusted to delay detection)
  useEffect(() => {
    if (!isMobile || !footerRef.current) return;

    const node = footerRef.current;
    console.log('👣 Observing footer:', node);
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInFooter(entry.isIntersecting);
        console.log(`🦶 Footer isIntersecting: ${entry.isIntersecting}`);
      },
      {
        threshold: 0.9, //good so
        rootMargin: '0px 0px -30% 0px',
      }
    );

    observer.observe(node);
    console.log('👀 Observing footer:', node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [isMobile, footerRef.current]);

  // Sentinel reset
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
          <MiniMenu isMobile={isMobile} showMenuBar={showMiniMenu} activeSection={activeSection} />
        </MotionBox>
      </Box>

      {/* Content */}
      <Box sx={{ mt: '64px' }}>
        <div ref={topSentinelRef} style={{ height: '1px' }} />

        <MainHero />
        <WhyItMatters />
        <PaperBagsCategory sectionRefs={sectionRefs} topSentinelRef={topSentinelRef} />
        <PaperBoxesCategory sectionRefs={sectionRefs} />
        <PaperCoversCategory sectionRefs={sectionRefs} />

        <div ref={whyItMattersRef} style={{ height: '1px' }} />
        <Footer ref={footerRef} />
        <div ref={endSentinelRef} style={{ height: '1px' }} />
        <Footer2 />
      </Box>
    </main>
  );
}
