'use client';

import React, { useEffect, useState } from 'react';
import {
  Button,
  Fade,
  useMediaQuery,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function StickyCTA({
  productName,
  heroRef,
}: {
  productName: string;
  heroRef: React.RefObject<HTMLElement>;
}) {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  // Removed unused showScrollTop state
  const [scrollTopVisible, setScrollTopVisible] = useState(false);

  // Track HeroSection visibility
  useEffect(() => {
    if (!heroRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsHeroVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, [heroRef]);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const show = window.scrollY > 300;
      setScrollTopVisible(show);
      if (show) {
        const timer = setTimeout(() => setScrollTopVisible(false), 5000);
        return () => clearTimeout(timer);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const whatsappMessage = `Hi, I'm interested in ${productName}. Please share details.`;
  const whatsappLink = `https://wa.me/919999999999?text=${encodeURIComponent(whatsappMessage)}`;

  const shouldShowCTA = !isHeroVisible;

  return (
    <>
      {shouldShowCTA && (
        <>
          {/* WhatsApp CTA */}
          {!isMobile && (
            <Fade in={true}>
              <Button
                href={whatsappLink}
                target="_blank"
                variant="contained"
                startIcon={<WhatsAppIcon />}
                sx={{
                  position: 'fixed',
                  bottom: 40,
                  right: 20,
                  zIndex: 1200,
                  backgroundColor: '#25D366',
                  color: '#fff',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  '&:hover': { backgroundColor: '#1DA851' },
                }}
              >
                Chat on WhatsApp
              </Button>
            </Fade>
          )}

          {/* Scroll to top */}
          <Fade in={scrollTopVisible}>
            <Button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              variant="contained"
              sx={{
                position: 'fixed',
                bottom: 100,
                right: 20,
                minWidth: 'auto',
                borderRadius: '50%',
                backgroundColor: '#333',
                width: 42,
                height: 42,
                zIndex: 1300,
                p: 0,
                '&:hover': { backgroundColor: '#555' },
              }}
            >
              <KeyboardArrowUpIcon sx={{ fontSize: 22, color: '#fff' }} />
            </Button>
          </Fade>
        </>
      )}
    </>
  );
}
