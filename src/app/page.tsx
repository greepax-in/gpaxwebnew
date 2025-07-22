'use client';

import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { AnimatePresence } from 'framer-motion';

import DeskMenu from '@/components/AppBar/DeskMenu';
import MobileMenu from '@/components/Common/MobileMenu';
import PWAPrompt from '@/components/Common/PWAInstall';

import HeroSection from '../app/Home/MainHero/page';
import MobileHero from '../app/Home/MobileHero/page';
import FeaturedProducts from '../app/Home/FeaturedProducts/page';
import Products from '../app/Home/Products/page';
import WhyItMatters from '../components/Home/whyitmatters/page';
import Footer from '../app/Home/Footer/page';
import BackToTopButton from '@/components/Common/BacktoTopButton';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const HomePage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPopup, setShowPopup] = useState(true);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    setIsMounted(true);

    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        console.log('PWA install choice:', choiceResult.outcome);
        setDeferredPrompt(null);
        setShowPopup(false);
      });
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  if (!isMounted) return null;

  return (
    <main style={{ position: 'relative', overflow: 'visible' }}>
      {!isMobile && <DeskMenu />}
      {isMobile && <MobileMenu />}

      {isMobile ? <MobileHero /> : <HeroSection />}
      <FeaturedProducts />
      <Products />
      {!isMobile && <WhyItMatters />}
      <Footer />
      <BackToTopButton />

      {/* ✅ Animated PWA Prompt */}
      <AnimatePresence>
        {showPopup && deferredPrompt && isMobile && (
          <PWAPrompt onInstall={handleInstallClick} onClose={handleClosePopup} />
        )}
      </AnimatePresence>
    </main>
  );
};

export default HomePage;
