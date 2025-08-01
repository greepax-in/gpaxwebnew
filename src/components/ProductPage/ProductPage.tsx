'use client';

import React, { useRef } from 'react';
import { Box, useMediaQuery } from '@mui/material';

import HeroSection from '@/components/ProductPage/HeroSection';
import ProductDetails from '@/components/ProductPage/ProductDetails';
import ProductSpecifications from './Specifications';
import ProductAssurance from './ProductAssurance';
import ProductFAQ from './ProductFAQs';
import SimilarProducts from './SimilarProducts';
import products from '@/data/items.json';
import StickyCTA from './StickyCTA';
import IndustriesServed from './IndustryServed';
import TrustedBy from './TrustedBy';
import UseCases from './UseCases';

import { ItemType } from '../../types/itemTypes';

type Props = {
  product: ItemType;
};


const ProductLayout = ({ product }: Props) => {
  const isMobile = useMediaQuery('(max-width:600px)');
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <Box sx={{ maxWidth: '1280px', mx: 'auto', px: isMobile ? 2 : 4, mt: isMobile ? 7 : 15 }}>
      <div ref={heroRef}>
        <HeroSection product={product} />
      </div>
      <ProductDetails product={product} />
      <ProductSpecifications product={product} />
      <ProductAssurance product={product} />
      <IndustriesServed product={product} />
      <TrustedBy product={product} />
      <UseCases product={product} />
      <ProductFAQ product={product} />
      <SimilarProducts
        currentProduct={product}
        allProducts={products.map((p) => ({
          ...p,
          slug: p.slug || '',
          subcategorySlug: p.subcategorySlug || '',
          sizes: Array.isArray(p.sizes) ? p.sizes : [],
          sizeImages: p.sizeImages
            ? Object.fromEntries(
                Object.entries(p.sizeImages).map(([k, v]) => [k, Array.isArray(v) ? v : []])
              )
            : {},
          sizePrices: p.sizePrices
            ? Object.fromEntries(
                Object.entries(p.sizePrices).map(([k, v]) => [k, typeof v === 'number' ? v : 0])
              )
            : {},
          variantPrices: p.variantPrices && typeof p.variantPrices === 'object'
            ? Object.fromEntries(
                Object.entries(p.variantPrices).map(([size, unitObj]) => [
                  size,
                  unitObj && typeof unitObj === 'object'
                    ? Object.fromEntries(
                        Object.entries(unitObj).map(([unit, qtyObj]) => [
                          unit,
                          qtyObj && typeof qtyObj === 'object'
                            ? Object.fromEntries(
                                Object.entries(qtyObj).map(([minQty, price]) => [
                                  minQty,
                                  typeof price === 'number' ? price : 0
                                ])
                              )
                            : {}
                        ])
                      )
                    : {}
                ])
              )
            : {},
          usecases: Array.isArray(p.usecases) ? p.usecases : [],
          assurance: Array.isArray(p.assurance) ? p.assurance : [],
          customers: Array.isArray(p.customers) ? p.customers : [],
          units: Array.isArray(p.units) ? p.units : [],
          minimumQuantities: Array.isArray(p.minimumQuantities) ? p.minimumQuantities : [],
        }))}
      />
      

      <StickyCTA productName={product.name} heroRef={heroRef as React.RefObject<HTMLElement>} />
    </Box>
  );
};

export default ProductLayout;
