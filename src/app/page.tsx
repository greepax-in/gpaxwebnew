'use client'
import React from "react";
import AppBar from "@components/AppBar/AppBar";
import HeroSection from '../app/Home/MainHero/page'

import FeaturedProducts from '../app/Home/FeaturedProducts/page';
import { useMediaQuery } from '@mui/material';

const HomePage: React.FC = () => {
  const isMobile = useMediaQuery('(max-width:600px)');
  return (
    <main>
      <AppBar />
      <div style={isMobile ? { height: '20vh', marginTop: 60 } : {}}>
        <HeroSection />
      </div>
      {/* Show MiniMenu only on mobile devices */}
      {/* {isMobile && <MiniMenu />} */}
      {/* Other components can be added here */}
      <FeaturedProducts />
    </main>
  );
};

export default HomePage;