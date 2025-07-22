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
  const isMobile = useMediaQuery('(max-width:600px)');

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    </main>
  );
};

export default HomePage;
