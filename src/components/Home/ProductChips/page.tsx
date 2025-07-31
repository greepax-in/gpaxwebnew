'use client';

import React from 'react';
import products from '@/data/items.json';
import Link from 'next/link';
import {
  Box,
  Chip,
  Avatar,
  Typography,
  useMediaQuery,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { motion } from 'framer-motion';

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const chipVariants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
  whileHover: { scale: 1.05 },
};

const groupProducts = (groupName: string): Array<{ name: string; pageLink: string; image: string }> => {
  return products.filter((product: { name: string; pageLink: string; image: string }) => {
    const lower = product.name.toLowerCase();
    return lower.includes(groupName);
  });
};

const ProductGroup = ({
  title,
  items,
}: {
  title: string;
  items: Array<{ name: string; pageLink: string; image: string }>;
}) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box sx={{ mb: 6, width: '100%' }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 600,
          textAlign: 'center',
          mb: 2,
          fontSize: isMobile ? '1.2rem' : '1.5rem',
        }}
      >
        {title}
      </Typography>

      <motion.div variants={containerVariants} initial="initial" animate="animate">
        <Grid container spacing={isMobile ? 2 : 3} justifyContent="center">
          {items.map((product) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={product.name}>
              <Link href={product.pageLink} passHref style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
                <motion.div variants={chipVariants} whileHover="whileHover">
                  <Chip
                    component="span"
                    avatar={<Avatar src={product.image} alt={product.name} sx={{ width: 28, height: 28 }} />}
                    label={product.name}
                    clickable
                    aria-label={`Go to ${product.name}`}
                    sx={{
                      fontSize: isMobile ? 13 : 15,
                      px: 2,
                      py: 1,
                      borderRadius: 3,
                      bgcolor: '#ffffff',
                      border: '1px solid #e0e0e0',
                      boxShadow: '0px 1px 3px rgba(0,0,0,0.08)',
                      '&:hover': {
                        bgcolor: '#f1f1f1',
                        boxShadow: '0px 3px 8px rgba(0,0,0,0.15)',
                      },
                      transition: 'all 0.3s ease-in-out',
                    }}
                  />
                </motion.div>
              </Link>
            </Grid>
          ))}
        </Grid>
      </motion.div>
    </Box>
  );
};

const ProductChips = () => {
  const bags = groupProducts('bag');
  const covers = groupProducts('cover');
  const boxes = groupProducts('box');

  return (
    <Box
      sx={{
        background: 'linear-gradient(to right, #ffffff, #f9f9f9)',
        borderRadius: 4,
        px: 2,
        py: { xs: 5, md: 7 },
        maxWidth: 1200,
        mx: 'auto',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontSize: { xs: '1.6rem', md: '2rem' },
          mb: 4,
          fontWeight: 700,
        }}
      >
        Explore Our Paper Packaging Products
      </Typography>

      <ProductGroup title="🛍️ Paper Bags" items={bags} />
      <Divider sx={{ my: 4 }} />
      <ProductGroup title="📦 Paper Covers" items={covers} />
      <Divider sx={{ my: 4 }} />
      <ProductGroup title="🍰 Boxes & Custom" items={boxes} />
    </Box>
  );
};

export default ProductChips;
