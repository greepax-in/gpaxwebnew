'use client';

import React from 'react';
import { Box, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface MiniMenuProps {
  items: string[];
  onItemClick: (item: string) => void;
  selectedItem: string;
  style?: React.CSSProperties;
}

// const MotionBox = motion(Box);

const MiniMenu: React.FC<MiniMenuProps> = ({ items, onItemClick, selectedItem, style }) => {
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        gap: 1.2,
        background: '#1B5E20',
        borderRadius: '50px',
        padding: '0.3rem 0.8rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
        top: '-10%',
        ...style,
      }}
    >
      {/* Animated Highlight Pill */}
      <motion.div
        layoutId="miniMenuHighlight"
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          left: 0,
          borderRadius: 9999,
          backgroundColor: '#FFFFFF',
          zIndex: 0,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        initial={false}
        animate={{
          left: `${items.findIndex(i => i === selectedItem) * 100}px`, // Assumes roughly 100px per button
          width: 'auto',
        }}
      />

      {items.map((item) => {
        const isSelected = selectedItem === item;
        return (
          <motion.div
            key={item}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ zIndex: 1 }}
          >
            <Button
              onClick={() => onItemClick(item)}
              sx={{
                color: isSelected ? '#1B5E20' : '#E8F5E9',
                fontSize: '1rem',
                fontWeight: 'bold',
                padding: '0.3rem 1rem',
                borderRadius: '50px',
                background: isSelected ? '#FFFFFF' : 'transparent',
                textTransform: 'none',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: isSelected ? '#FFFFFF' : '#2E7D32',
                  color: isSelected ? '#1B5E20' : '#FFFFFF',
                },
              }}
            >
              {item}
            </Button>
          </motion.div>
        );
      })}
    </Box>
  );
};

export default MiniMenu;
