'use client';
import React from 'react';
import AppBar from '@components/AppBar/AppBar';
import HeroSection from '../app/Home/MainHero/page';
import MiniMenu from '@components/AppBar/MiniMenu';
import FeaturedProducts from '../app/Home/FeaturedProducts/page';
import PaperBags from '../app/Home/ProductCategories/PaperBags/page';
import PaperCovers from '../app/Home/ProductCategories/PaperCovers/page'; 
import { Box } from '@mui/material';

const HomePage: React.FC = () => {
  // const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <main
      style={{
        position: 'relative',
        overflow: 'visible',
        // paddingTop: '56px', // Compensates for fixed AppBar height
      }}
    >

      <AppBar />

      <Box
        sx={{
          mt: { xs: '56px', sm: '80px' }, // Match your AppBar height
        }}
      >
        <HeroSection />
      </Box>
      <FeaturedProducts />

      <MiniMenu />



      <PaperBags />
      <PaperCovers />
    </main>
  );
};

export default HomePage;
