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
  fixedTop?: boolean;
};

const MiniMenu: React.FC<AdditionalMenuBarProps> = ({
  isMobile,
  showMenuBar,
  compact = false,
  fixedTop = true,
}) => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  const handleCategoryClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    category: string
  ) => {
    setActiveCategory(category);
    setAnchorEl(event.currentTarget);
    setSelectedCategory(category);
  };

  const handleClose = () => {
    setActiveCategory(null);
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
              role="navigation"
              position="static"
              style={{
                backgroundColor: '#F1F8E9',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
              }}
            >
              <Toolbar
                variant="dense"
                sx={{ justifyContent: 'center', gap: compact ? 0 : 1, py: 1, minHeight: '48px' }}
              >
                {(compact ? [
                  { label: 'See All Products', link: '#product-categories' },
                ] : [
                  { label: 'Paper Bags', link: '/products/paper-bags' },
                  { label: 'Paper Boxes', link: '/products/cake-boxes' },
                  { label: 'Paper Covers', link: '/products/paper-covers' },
                ]).map((item) => (
                  <Button
                    key={item.label}
                    onClick={(e) => handleCategoryClick(e, item.label)}
                    aria-label={`Navigate to ${item.label}`}
                    sx={{
                      ...buttonStyles,
                      backgroundColor:
                        selectedCategory === item.label ? '#E8F5E9' : 'transparent',
                      border:
                        selectedCategory === item.label
                          ? '2px solid #388E3C'
                          : '1px solid #e0e0e0',
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Toolbar>
            </AppBar>
          </motion.div>
        )}
      </AnimatePresence>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        disableScrollLock
        sx={{ mt: 2 }} // slight margin if needed
      >
        {activeCategory && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Stack
              sx={{
                p: 1,
                backgroundColor: '#f5f5f5',
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                width: '300px',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                {activeCategory}
              </Typography>
              {products
                .filter((p) => p.category === activeCategory)
                .slice(0, 3)
                .map((p) => (
                  <Card
                    key={p.id}
                    sx={{
                      mb: 1,
                      borderRadius: 2,
                      boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
                      py: 0.25,
                      px: 1.25,
                    }}
                  >
                    <CardContent
                      sx={{
                        py: 0.5,
                        px: 1,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        textAlign: 'left',
                        '&:last-child': {
                          pb: 0.5,
                        },
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        {p.icon}
                        <Typography fontWeight={600} fontSize="0.9rem" color="text.primary">
                          {p.name}
                        </Typography>
                      </Stack>
                      <Typography variant="body2" fontSize="0.75rem" color="text.secondary">
                        {p.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              <Stack direction="column" spacing={3} mt={1} mb={1}>
                <Typography
                  fontSize="0.82rem"
                  fontWeight={500}
                  textAlign="center"
                  color="text.primary"
                  sx={{ mt: 1, mb: 0.5, px: 1, lineHeight: 1.4 }}
                >
                  <PrintIcon sx={{ fontSize: '1rem', mr: 0.5 }} />
                  Multilingual printing available on all products
                </Typography>
              </Stack>
              <Stack direction="column" spacing={2}>
                <Button
                  variant="contained"
                  sx={{ backgroundColor: '#25D366' }}
                  href={`https://chat.greenpax.in/?category=${encodeURIComponent(activeCategory)}`}
                  fullWidth
                >
                  Chat via WhatsApp
                </Button>
                <Button
                  variant="outlined"
                  href={`/products#${activeCategory.toLowerCase().replace(/\s+/g, '-')}`}
                  fullWidth
                >
                  Explore All {activeCategory}
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
  color: '#388E3C',
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  textAlign: 'center',
  whiteSpace: 'nowrap',
  background: 'linear-gradient(to bottom, #ffffff, #f8f8f8)',
  border: '1px solid #e0e0e0',
  borderRadius: '24px',
  minWidth: '110px',
  padding: '6px 16px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: '#E8F5E9',
    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.15)',
  },
};

export default MiniMenu;
