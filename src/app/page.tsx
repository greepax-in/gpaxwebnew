'use client';
import React from 'react';
import AppBar from '@components/AppBar/AppBar';
import HeroSection from '../app/Home/MainHero/page';
import MiniMenu from '@components/AppBar/MiniMenu';
import FeaturedProducts from '../app/Home/FeaturedProducts/page';
import PaperBags from '../app/Home/ProductCategories/PaperBags/page';
import { useMediaQuery, Box } from '@mui/material';

const HomePage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <main
      style={{
        position: 'relative',
        overflow: 'visible',
        // paddingTop: '56px', // Compensates for fixed AppBar height
      }}
    >
      {/* AppBar is fixed */}
      <AppBar />

      {/* Hero Section */}
      <Box sx={{ mt: isMobile ? 7 : 8 }}>
        <HeroSection />
      </Box>
   <FeaturedProducts />
      {/* 👇 Move MiniMenu right after HeroSection so it can stick early */}
      {isMobile && <MiniMenu />}

      {/* Featured Products & other content */}
   
      <PaperBags />
    </main>
  );
};

export default HomePage;
