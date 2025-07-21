'use client';

import React from 'react';
import { Box, useMediaQuery } from '@mui/material';

import DeskMenu from '@/components/AppBar/DeskMenu';
// import MobileMenu from '@/components/AppBar/MobileMenu';

import HeroSection from '../app/Home/MainHero/page';
import MobileHero from '../app/Home/MobileHero/page';

import FeaturedProducts from '../app/Home/FeaturedProducts/page';
import Products from '../app/Home/Products/page';
import Footer from '../app/Home/Footer/page';
import BackToTopButton from '@/components/Common/BacktoTopButton';


const HomePage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <main style={{ position: 'relative', overflow: 'visible' }}>
      <DeskMenu />
      {/* <MobileMenu /> */}

      <Box mt={{ xs: '56px', sm: '80px' }}>
        {isMobile ? <MobileHero /> : <HeroSection />}
        <FeaturedProducts />
        <Products />
        <Footer />
      </Box>
        <BackToTopButton />
    </main>
  );
};

export default HomePage;
