'use client';

import React from 'react';
import {
  Box,
  Typography,
  useMediaQuery,

} from '@mui/material';
// import { motion } from 'framer-motion';
// import PrintVariants from '../../../app/PrintVariants.json';

// const typedPrintVariants = PrintVariants.variants as {
//   name: string;
//   backgroundColor: string;
// }[];

export type ProductCardProps = {
  name: string;
  image: string;
  desc: string;
  offeredPrice?: number;
  sellingPrice?: number;
  link?: string;
  variants?: string | string[];
};

export default function ProductCard({
  name

}: ProductCardProps) {
  const isMobile = useMediaQuery('(max-width:600px)');



  return (
    <Box sx=
    {{ width: '100%',
      mt: 2,
     }}>
        

          {/* Product Name */}
          <Typography
            fontWeight={700}
            fontSize={isMobile ? '0.6rem' : '1.17rem'}
            lineHeight={1.3}
            sx={{
              textAlign: 'center',
              color: '#212121',
              mb: 0.5,
              whiteSpace: 'break-spaces',
              px: 1,
            }}
          >
            {name}
          </Typography>
 
    </Box>
  );
}