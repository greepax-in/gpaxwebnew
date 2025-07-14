'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Popover,
  Stack,
  Card,
  CardContent,
  Box,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';

import CakeIcon from '@mui/icons-material/Cake';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import MedicationIcon from '@mui/icons-material/Medication';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import PrintIcon from '@mui/icons-material/Print';

const products = [
  {
    id: 1,
    name: 'Food Delivery Paper Bags',
    category: 'Paper Bags',
    description: 'Restaurants, Fast Food',
    icon: <FastfoodIcon sx={{ color: 'rgb(255, 167, 38)' }} fontSize="small" />,
  },
  {
    id: 2,
    name: 'Cake Box Paper Bags',
    category: 'Paper Bags',
    description: 'Bakery, Cake Shops',
    icon: <CakeIcon sx={{ color: 'rgb(186, 104, 200)' }} fontSize="small" />,
  },
  {
    id: 3,
    name: 'Gift Paper Bags',
    category: 'Paper Bags',
    description: 'Celebrations, Marketing',
    icon: <CardGiftcardIcon sx={{ color: 'rgb(56, 142, 60)' }} fontSize="small" />,
  },
  {
    id: 4,
    name: 'Cake Boxes',
    category: 'Paper Boxes',
    description: 'Bakery, Cake Shops',
    icon: <CakeIcon sx={{ color: 'rgb(186, 104, 200)' }} fontSize="small" />,
  },
  {
    id: 5,
    name: 'Burger Boxes',
    category: 'Paper Boxes',
    description: 'Bakery, Cake Shops, Fast Food',
    icon: <FastfoodIcon sx={{ color: 'rgb(255, 167, 38)' }} fontSize="small" />,
  },
  {
    id: 6,
    name: 'Medical Paper Covers',
    category: 'Paper Covers',
    description: 'Medical, Pharmacy Shops',
    icon: <MedicationIcon sx={{ color: 'red' }} fontSize="small" />,
  },
  {
    id: 7,
    name: 'Grocery Paper Covers',
    category: 'Paper Covers',
    description: 'Bakery, Grocery Shops',
    icon: <BlurCircularIcon sx={{ color: 'rgb(56, 142, 60)' }} fontSize="small" />,
  },
  {
    id: 8,
    name: 'Laundry Paper Covers',
    category: 'Paper Covers',
    description: 'Laundry, Dry Cleaning Shops',
    icon: <LocalLaundryServiceIcon sx={{ color: 'rgb(33, 150, 243)' }} fontSize="small" />,
  },
];

type AdditionalMenuBarProps = {
  isMobile: boolean;
  showMenuBar: boolean;
  compact?: boolean;
  activeSection?: string | null;
};

const sectionColors: Record<string, string> = {
  'Paper Bags': '#cd9af7ff',       // Green
  'Paper Boxes': '#f0a038ff',      // Purple
  'Paper Covers': '#382aefff',     // Dark Green
};


const MiniMenu: React.FC<AdditionalMenuBarProps> = ({
  isMobile,
  showMenuBar,
  compact = false,
  activeSection,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleCategoryClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    category: string
  ) => {
    if (selectedCategory === category) {
      // If the same category is clicked again, close the popover
      handleClose();
    } else {
      // Otherwise, open the popover for the new category
      setAnchorEl(event.currentTarget);
      setSelectedCategory(category);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedCategory(null);
  };

  if (!isMobile || !showMenuBar) return null;

  return (
    <>
      <AnimatePresence>
        {showMenuBar && (
          <motion.div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              zIndex: 1301,
            }}
            initial={!hasAnimated ? { opacity: 0, y: 50 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            onAnimationComplete={() => setHasAnimated(true)}
          >
            <AppBar
              position="static"
              sx={{
                backgroundColor: '#F1F8E9',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              }}
            >
              <Box sx={{ position: 'relative', width: '100%' }}>
                <Toolbar
                  variant="dense"
                  sx={{
                    justifyContent: 'center',
                    gap: compact ? 0 : 1,
                    py: 1,
                    minHeight: '48px',
                  }}
                >
                  {(compact
                    ? [{ label: 'See All Products', link: '#product-categories' }]
                    : [
                        { label: 'Paper Bags', link: '/products/paper-bags' },
                        { label: 'Paper Boxes', link: '/products/cake-boxes' },
                        { label: 'Paper Covers', link: '/products/paper-covers' },
                      ]
                  ).map((item) => {
                    const isSelected = selectedCategory === item.label;

                    return (
                      <Button
                        key={item.label}
                        onClick={(e) => handleCategoryClick(e, item.label)}
                        sx={{
                          ...buttonStyles,
                          backgroundColor: isSelected
                            ? 'rgba(156, 39, 176, 0.08)'
                            : 'transparent',
                          color: isSelected ? '#9c27b0' : '#388E3C',
                          border: isSelected
                            ? '2px solid #9c27b0'
                            : '1px solid #c8e6c9',
                          '&:active': {
                            backgroundColor: '#E1BEE7',
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    );
                  })}
                </Toolbar>
{activeSection && (
  <Box
    sx={{
      position: 'absolute',
      bottom: 0,
      left: `calc(${['Paper Bags', 'Paper Boxes', 'Paper Covers'].indexOf(activeSection)} * 33.33%)`,
      width: '33.33%',
      height: '4px',
      backgroundColor: sectionColors[activeSection] || '#25D366',
      borderRadius: '2px',
      transition: 'left 0.3s ease, background-color 0.3s ease',
    }}
  />
)}
              </Box>
            </AppBar>
          </motion.div>
        )}
      </AnimatePresence>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        disableScrollLock
        PaperProps={{
          sx: {
            backdropFilter: 'blur(12px)',
            backgroundColor: 'rgba(255, 255, 255, 0.75)',
            borderRadius: 2,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
            p: 2,
          },
        }}
      >
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Stack spacing={2}>
              <Typography variant="h6">{selectedCategory}</Typography>
              {products
                .filter((p) => p.category === selectedCategory)
                .slice(0, 3)
                .map((p) => (
                  <Card key={p.id} sx={{ borderRadius: 2, boxShadow: 1 }}>
                    <CardContent
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        '&:last-child': { pb: 1 },
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        {p.icon}
                        <Typography fontWeight={600} fontSize="0.9rem">
                          {p.name}
                        </Typography>
                      </Stack>
                      <Typography fontSize="0.75rem" color="text.secondary">
                        {p.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              <Typography fontSize="0.82rem" textAlign="center">
                <PrintIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                Multilingual printing available on all products
              </Typography>
              <Stack spacing={1.5}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#25D366' }}
                  href={`https://chat.greenpax.in/?category=${encodeURIComponent(selectedCategory)}`}
                  fullWidth
                >
                  Chat via WhatsApp
                </Button>
                <Button
                  variant="outlined"
                  href={`/products#${selectedCategory.toLowerCase().replace(/\s+/g, '-')}`}
                  fullWidth
                >
                  Explore All {selectedCategory}
                </Button>
                <Button
                  variant="text"
                  color="error"
                  onClick={handleClose}
                  startIcon={<HighlightOffIcon />}
                >
                  Close
                </Button>
              </Stack>
            </Stack>
          </motion.div>
        )}
      </Popover>
    </>
  );
};

const buttonStyles = {
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  borderRadius: '24px',
  minWidth: '110px',
  padding: '6px 16px',
  transition: 'all 0.2s ease-in-out',
  boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
};

export default MiniMenu;
