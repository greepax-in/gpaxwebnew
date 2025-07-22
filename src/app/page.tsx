'use client';

import React, { useEffect, useState } from 'react';
import { useMediaQuery } from '@mui/material';

import DeskMenu from '@/components/AppBar/DeskMenu';
import MobileMenu from '@/components/Common/MobileMenu';

import HeroSection from '../app/Home/MainHero/page';
import MobileHero from '../app/Home/MobileHero/page';

import FeaturedProducts from '../app/Home/FeaturedProducts/page';
import Products from '../app/Home/Products/page';
import WhyItMatters from '../components/Home/whyitmatters/page';
import Footer from '../app/Home/Footer/page';
import BackToTopButton from '@/components/Common/BacktoTopButton';

const HomePage: React.FC = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    setIsMounted(true);

    // Listen for the beforeinstallprompt event
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault(); // Prevent the default prompt
      setDeferredPrompt(event); // Save the event for later use
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      const promptEvent = deferredPrompt as BeforeInstallPromptEvent;
      promptEvent.prompt(); // Show the install prompt
      promptEvent.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
        setDeferredPrompt(null); // Clear the saved prompt
      });
    }
  };

  // Avoid rendering until client-side hydration completes
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

      {/* Install Prompt Button */}
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#1B5E20',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          }}
        >
          Install App
        </button>
      )}
    </main>
  );
};

export default HomePage;

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}
