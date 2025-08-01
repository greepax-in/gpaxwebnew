'use client';

import React, { useRef } from 'react';
import { Box, useMediaQuery } from '@mui/material';

// import HeroMobile from '@/components/ProductPage/Mobile/HeroMobile';
import HeroDesktop from '@/components/ProductPage/Desktop/HeroDesktop'; // fallback if exists
import ProductDetails from '@/components/ProductPage/ProductDetails';
import ProductSpecifications from './Specifications';
import ProductAssurance from './ProductAssurance';
import ProductFAQ from './ProductFAQs';
import SimilarProducts from './SimilarProducts';
// import products from '@/data/items.json';
import StickyCTA from './StickyCTA';
import IndustriesServed from './IndustryServed';
import TrustedBy from './TrustedBy';
import UseCases from './UseCases';
import { ItemType } from '../../types/itemTypes';
import ProductPageMobile from './Mobile/HeroSection/ProductPageMobile';
// import products from '@/data/items.json';  

type Props = {
  product: ItemType;
};

const ProductLayout = ({ product }: Props) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const heroRef = useRef<HTMLDivElement>(null);



  return (
    <Box sx={{ maxWidth: '1280px', mx: 'auto', px: isMobile ? 2 : 4, mt: isMobile ? 7 : 15 }}>
      <div ref={heroRef}>
        {isMobile ? (
          <ProductPageMobile product={product} />
        ) : (
          <HeroDesktop product={product} />
        )}
      </div>

      <ProductDetails product={product} />
      <ProductSpecifications product={product} />
      <ProductAssurance product={product} />
      <IndustriesServed product={product} />
      <TrustedBy product={product} />
      <UseCases product={product} />
      <ProductFAQ product={product} />
      <SimilarProducts currentProduct={product}  />

      <StickyCTA
        productName={product.name}
        heroRef={heroRef as React.RefObject<HTMLElement>}
      />
    </Box>
  );
};

export default ProductLayout;
