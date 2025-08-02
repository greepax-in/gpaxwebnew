'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { motion } from 'framer-motion';

interface MiniMenuProps {
  items: string[];
  onItemClick: (item: string) => void;
  selectedItem: string;
  style?: React.CSSProperties;
}

const MiniMenu: React.FC<MiniMenuProps> = ({ items, onItemClick, selectedItem, style }) => {
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [highlightStyle, setHighlightStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const selectedRef = buttonRefs.current[selectedItem];
    if (selectedRef) {
      const rect = selectedRef.getBoundingClientRect();
      const parentRect = selectedRef.parentElement?.parentElement?.getBoundingClientRect();
      if (parentRect) {
        setHighlightStyle({
          left: rect.left - parentRect.left,
          width: rect.width,
        });
      }
    }
  }, [selectedItem, items]);

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
        overflowX: 'auto',
        ...style,
      }}
    >
      {/* Animated highlight pill */}
      <motion.div
        layout
        style={{
          position: 'absolute',
          top: 4,
          bottom: 4,
          borderRadius: 9999,
          backgroundColor: '#FFFFFF',
          zIndex: 0,
        }}
        initial={false}
        animate={highlightStyle}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
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
              ref={(el: HTMLButtonElement | null) => {
                buttonRefs.current[item] = el;
              }}
              component="button"
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
                whiteSpace: 'nowrap',
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
