'use client';
import React from 'react';
import AppBar from '@components/AppBar/AppBar';
import HeroSection from '../app/Home/MainHero/page';
import MiniMenu from '@components/AppBar/MiniMenu';
import FeaturedProducts from '../app/Home/FeaturedProducts/page';
import PaperBags from '../app/Home/ProductCategories/PaperBags/page';
import PaperCovers from '../app/Home/ProductCategories/PaperCovers/page'; 
import PaperBoxes from '../app/Home/ProductCategories/PaperBoxes/page';
import { Box } from '@mui/material';

const HomePage: React.FC = () => {
  return (
    <main
      style={{
        position: 'relative',
        overflow: 'visible',
      }}
    >
      <AppBar />

      {/* Hero Section */}
      <Box mt={{ xs: '56px', sm: '80px' }}>
        <HeroSection />
      </Box>

      {/* Featured Products */}
    
        <FeaturedProducts />
    

      {/* MiniMenu */}
    
        <MiniMenu />
    

      {/* Product Categories */}
    
        <PaperBags />
    

    
        <PaperCovers />
    

    
        <PaperBoxes />
    
    </main>
  );
};

export default HomePage;
