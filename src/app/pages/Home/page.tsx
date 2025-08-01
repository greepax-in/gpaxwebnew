'use client';

import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';
import { AnimatePresence } from 'framer-motion';

import DeskMenu from '@/components/AppBar/DeskMenu';
import MobileMenu from '@/components/AppBar/MobileMenu';
import PWAPrompt from '@/components/Common/PWAInstall';

import HeroSection from '@/components/Home/MainHero/page';
import MobileHero from '@/components/Home/MobileHero/page';
import FeaturedProducts from '@/components/Home/FeaturedProducts/page';
import Products from '@/components/Home/Products/page';
import MultilanguageCTA from '@/components/Home/CTA/MutliLanguageCTA';
import WhyItMatters from '@/components/Home/whyitmatters/page';
import BackToTopButton from '@/components/Common/BacktoTopButton';
import CustomerLogoSection from '@/components/Home/CustomerLogoSection/page';
import ProductsChips from '@/components/Home/ProductChips/page';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const HomePage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [isMounted, setIsMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    // attempt to trigger minimal-ui (mobile) by scrolling 1px
    setTimeout(() => {
      if (typeof window !== 'undefined' && window.scrollY === 0) {
        window.scrollTo(0, 1);
      }
    }, 100);

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
      {/* Navigation */}
      {isMobile ? <MobileMenu /> : <DeskMenu />}

      {/* Hero Section */}
      {isMobile ? <MobileHero /> : <HeroSection />}

      {/* Why It Matters Section */}
      <WhyItMatters />

      {/* Products */}
      <FeaturedProducts />
      <Products />

      {/* Multilanguage CTA */}
      <MultilanguageCTA />

      {/* Customers & Chips */}
      <CustomerLogoSection />
      {!isMobile && <ProductsChips />}

      {/* Footer */}
      {/* <Footer /> */}
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
