'use client';

import React from 'react';
import { Box, useMediaQuery } from '@mui/material';

import HeroSection from '@/components/ProductPage/HeroSection';
import ProductDetails from '@/components/ProductPage/ProductDetails';


export type ProductType = {
  name: string;
  slug: string;
  category: string;
  description: string;
  industry: string;
  image: string;
  featuredImage: string;
  productImages: string[];
  pageLink: string;
  printvariants: string[];
  papervariant: string[];
  featuredProduct: string;
  offeredPrice: number;
  sellingPrice: number;
  tagtext: string;
  highlights: string[];
  specifications: Record<string, string>;
  faqs: { q: string; a: string }[];
  sizes: string[];  
};

type Props = {
  product: ProductType;
};

const ProductLayout = ({ product }: Props) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ maxWidth: '1280px', mx: 'auto', px: isMobile ? 2 : 4, mt: isMobile ? 7 : 15 }}>
      <HeroSection product={product} />
      <ProductDetails product={product} />
    </Box>
  );
};

export default ProductLayout;
