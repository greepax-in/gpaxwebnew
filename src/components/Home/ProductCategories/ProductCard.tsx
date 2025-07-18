'use client';

import React from 'react';
import { Box, Button, Typography, useMediaQuery, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import Head from 'next/head';

export type ProductCardProps = {
  name: string;
  image: string;
  waText?: string;
  price?: string;
  variants?: string[];
  link?: string;
};

export default function ProductCard({
  name,
  image,
  waText,
  price,
  variants,
  link,
}: ProductCardProps) {
  const isMobile = useMediaQuery('(max-width:600px)');

  const jsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name,
    image,
    description: variants?.join(', ') || '',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: price?.replace(/[^\d.]/g, '') || '0',
      availability: 'https://schema.org/InStock',
    },
  };

  const motionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  if (isMobile) {
    return (
      <motion.div
        variants={motionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
        style={{ width: '100%' }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: '#fff',
            width: '100%',
            boxShadow: 2,
            p: 2,
            minHeight: 280,
            justifyContent: 'center',
            borderRadius: 2,
            position: 'relative',
          }}
        >
          <Box
            component="img"
            src={image}
            alt={name}
            sx={{
              width: 120,
              height: 120,
              objectFit: 'contain',
              borderRadius: 2,
              mb: 1.5,
              boxShadow: 2,
            }}
          />
          <Typography fontWeight={600} fontSize="1.05rem" align="center">
            {name}
          </Typography>
          {Array.isArray(variants) && variants.length > 0 && (
            <Typography fontSize="0.9rem" color="#666" mt={0.5} textAlign="center">
              {variants.join(', ')}
            </Typography>
          )}
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            {price && (
              <Typography fontWeight={600} color="#2e7d32" fontSize="1rem">
                {price}
              </Typography>
            )}
            {waText && link && (
              <Tooltip title="Chat on WhatsApp">
                <Box
                  component="a"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#25D366' }}
                >
                  <WhatsAppIcon fontSize="medium" />
                </Box>
              </Tooltip>
            )}
          </Box>
        </Box>
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </Head>
      </motion.div>
    );
  }

  return (
    <Box sx={{ width: '100%', overflow: 'visible' }}>
      <motion.div
        whileHover={{ scale: 1.04 }}
        initial="hidden"
        animate="visible"
        variants={motionVariants}
        custom={0}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ width: '100%' }}
      >
        <Box
          sx={{
            transformOrigin: 'center',
            willChange: 'transform',
            background: '#fff',
            borderRadius: 2,
            p: 2.5,
            minHeight: 340,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            boxShadow: 3,
            transition: 'box-shadow 0.3s ease-in-out',
            position: 'relative',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <Box
            component="img"
            src={image}
            alt={name}
            sx={{
              width: 140,
              height: 140,
              objectFit: 'contain',
              borderRadius: 2,
              mb: 2,
            }}
          />
          <Typography fontWeight={700} fontSize="1.2rem" align="center">
            {name}
          </Typography>
          {Array.isArray(variants) && variants.length > 0 && (
            <Typography
              fontSize="1rem"
              color="#666"
              mt={0.5}
              textAlign="center"
              sx={{
                maxWidth: '90%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {variants.join(', ')}
            </Typography>
          )}
          <Box display="flex" alignItems="center" gap={1} mt={1}>
            {price && (
              <Typography fontWeight={700} color="#2e7d32" fontSize="1rem">
                {price}
              </Typography>
            )}
            {waText && link && (
              <Tooltip title="Chat on WhatsApp">
                <Box
                  component="a"
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ color: '#25D366' }}
                >
                  <WhatsAppIcon fontSize="medium" />
                </Box>
              </Tooltip>
            )}
          </Box>
        </Box>
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </Head>
      </motion.div>
    </Box>
  );
}
