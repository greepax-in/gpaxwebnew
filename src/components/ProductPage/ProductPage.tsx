'use client';

import React, { useRef } from 'react';
import { Box} from '@mui/material';
import useIsMobile from '@/components/Common/isMobile';

// import HeroMobile from '@/components/ProductPage/Mobile/HeroMobile';
import HeroDesktop from '@/components/ProductPage/Desktop/HeroDesktop'; // fallback if exists
import BackToTopButton from '../Common/BacktoTopButton';
import ProductDetails from '@/components/ProductPage/ProductDetails';
import ProductSpecifications from './Specifications';
import ProductAssurance from './ProductAssurance';
import ProductFAQ from './ProductFAQs';
import SimilarProducts from './SimilarProducts';
// import products from '@/data/items.json';
// import StickyCTA from './StickyCTA';
import IndustriesServed from './IndustryServed';
import TrustedBy from './TrustedBy';
import UseCases from './UseCases';
import { ItemType } from '../../types/itemTypes';
// import ProductPageMobile from './Mobile/HeroSection/ProductPageMobile';
import ProductPageMobile3 from './Mobile/HeroSection/page'
// import DesktopWACTA from '../Common/DesktopWACTA';
// import products from '@/data/items.json';  

type Props = {
  product: ItemType;
};

const ProductLayout = ({ product }: Props) => {


const isMobile = useIsMobile();
  const heroRef = useRef<HTMLDivElement>(null);

  if (isMobile === null) return null; // or loading skeleton


  return (
    <Box sx={{ maxWidth: '1280px', mx: 'auto', px: isMobile ? 2 : 4, mt: isMobile ? 7 : 15 }}>
      

      <div ref={heroRef}>
        {isMobile ? (
          <>
            <ProductPageMobile3  product={product}/>
            <BackToTopButton />
          </>
        ) : (
          <>
            <HeroDesktop product={product} />
            <BackToTopButton  />
          </>
        )}
      </div>

      {/* <ProductDetails product={product} />
      <ProductSpecifications product={product} />
      <ProductAssurance product={product} />
      <IndustriesServed product={product} />
      <TrustedBy product={product} />
      <UseCases product={product} />
      <ProductFAQ product={product} />
      <SimilarProducts currentProduct={product}  /> */}



    </Box>
  );
};

export default ProductLayout;
