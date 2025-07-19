'use client';

import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';

const categories = [
  {
    label: 'Paper Bags',
    icon: '/images/home/productcategories/paperbags/kraft-paper-bag.svg',
  },
  {
    label: 'Paper Covers',
    icon: '/images/home/productcategories/papercovers/10.svg',
  },
  {
    label: 'Paper Boxes',
    icon: '/images/home/productcategories/paperboxes/kraft-cake-boxes.svg',
  },
];

const LazadaStyleMenu: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Box
      component="nav"
      sx={{
        position: 'sticky',
        top: '56px', // Height of your mobile AppBar
        zIndex: 1200, // Ensure it's above other elements
        px: 2,
        pt: 1,
        pb: 1.5,
       backgroundColor: '#fff',
border: '1px solid red',

        // background: 'linear-gradient(to bottom, #fbfbfcff, #8ec0f9ff)',
        overflowX: 'auto',
        whiteSpace: 'nowrap',
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        justifyContent: 'center',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        mt: -3,
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)',
      }}
    >
      {categories.map((item, index) => (
        <motion.div
          key={index}
          whileTap={{ scale: 0.92 }}
          whileHover={{ scale: 1.03 }}
          style={{
            flexShrink: 0,
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setSelectedIndex(index)}
        >
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              backgroundColor: '#fff',
              border:
                selectedIndex === index
                  ? '2px solid #4CAF50'
                  : '2px solid transparent',
              boxShadow:
                selectedIndex === index
                  ? '0 0 0 3px rgba(76, 175, 80, 0.3)'
                  : '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 1,
              transition: 'all 0.3s ease',
              cursor: 'pointer',
            }}
          >
            <Box
              component="img"
              src={item.icon}
              alt={item.label}
              loading="lazy"
              sx={{
                width: 48,
                height: 48,
                objectFit: 'contain',
                fontWeight: 700,
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              fontSize: '0.75rem',
              color: selectedIndex === index ? '#2e7d32' : '#333',
              fontWeight: selectedIndex === index ? '700' : 'normal',
              maxWidth: 80,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {item.label}
          </Typography>
        </motion.div>
      ))}
    </Box>
  );
};

export default LazadaStyleMenu;
