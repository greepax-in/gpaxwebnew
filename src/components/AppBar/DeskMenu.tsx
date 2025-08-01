'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import WhatsappIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import CloseIcon from '@mui/icons-material/Close';
import MainMenu from './MainMenu'; // Assuming MainMenu is a separate component
import { WHATSAPP_NUMBER  } from '@/components/constants/whatsapp'; // Adjust the import path as necessary

const MotionA = motion('a');

export default function AppBar() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerOpen = () => setDrawerOpen(true);
  const handleDrawerClose = () => setDrawerOpen(false);

  return (
    <>
      {/* Main AppBar */}
      <Box
        sx={{
          position: 'fixed',
          top: isMobile ? 0 : 16,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1400,
          display: 'flex',
          backgroundColor: '#113B2E',
          width: isMobile ? '100%' : { xs: '90%', md: '92%' },
          maxWidth: '1200px',
          borderRadius: isMobile ? '0px' : '64px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
          px: 1,
          py: isMobile ? 0.6 : 1, // Reduced padding-y to decrease height
        }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            pl: 0, // left aligned
            pr: isMobile ? 1 : 2,
          }}
        >
          {/* Logo + Brand */}
          <MotionA
            href="/"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
          >
            <motion.img
              src="/images/greenpax-logo.svg"
              alt="Greenpax Logo"
              style={{ height: isMobile ? 40 : 48 }}
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            <Typography
              sx={{
                color: '#fff',
                fontFamily: 'var(--font-poppins, Poppins, Arial, sans-serif)',
                fontWeight: 700,
                fontSize: isMobile ? 20 : 28,
                pl: 1,
                letterSpacing: 2,
                textTransform: 'uppercase',
                display: 'block',
              }}
            >
              GreenPax
            </Typography>
          </MotionA>

          {/* Desktop: Main Menu */}
          {!isMobile && <MainMenu />}    {/* Right side actions */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              justifyContent: isMobile ? 'flex-end' : 'initial',
            }}
          >

            {/* WhatsApp */}
            <MotionA
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#25D366',
                color: '#fff',
                borderRadius: 9999,
                minWidth: isMobile ? 28 : 70,
                height: isMobile ? 28 : 32,
                padding: isMobile ? '0 4px' : '0.2rem 0.7rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                gap: 4,
                fontSize: isMobile ? 11 : 13,
                transition: 'background 0.2s, box-shadow 0.2s',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'visible',
              }}
              whileHover={{
                scale: 1.12,
                boxShadow: [
                  '0 2px 8px rgba(0,0,0,0.12)',
                  '0 0 0 0 #25D36644',
                  '0 0 0 12px #25D36633',
                  '0 2px 8px rgba(0,0,0,0.12)'
                ],
                filter: [
                  'brightness(1)',
                  'brightness(1.18)',
                  'brightness(0.92)',
                  'brightness(1)'
                ],
                transition: {
                  duration: 0.7,
                  repeat: 1,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  times: [0, 0.3, 0.7, 1]
                }
              }}
              whileTap={{ scale: 0.97 }}
            >
              <WhatsappIcon style={{ fontSize: isMobile ? 14 : 16, marginRight: isMobile ? 0 : 4 }} />
              {!isMobile && <span style={{ fontWeight: 600, letterSpacing: 0.2 }}>WhatsApp</span>}
            </MotionA>


            {/* Call */}
            <MotionA
              href="tel:+917207905222"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF6F00',
                color: '#fff',
                borderRadius: 9999,
                minWidth: isMobile ? 28 : 56,
                height: isMobile ? 28 : 32,
                padding: isMobile ? '0 4px' : '0.2rem 0.7rem',
                fontWeight: 600,
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                gap: 4,
                fontSize: isMobile ? 11 : 13,
                transition: 'background 0.2s, box-shadow 0.2s',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'visible',
              }}
              whileHover={{
                scale: 1.12,
                boxShadow: [
                  '0 2px 8px rgba(0,0,0,0.12)',
                  '0 0 0 0 #FF6F0044',
                  '0 0 0 12px #FF6F0033',
                  '0 2px 8px rgba(0,0,0,0.12)'
                ],
                filter: [
                  'brightness(1)',
                  'brightness(1.18)',
                  'brightness(0.92)',
                  'brightness(1)'
                ],
                transition: {
                  duration: 0.7,
                  repeat: 1,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                  times: [0, 0.3, 0.7, 1]
                }
              }}
              whileTap={{ scale: 0.97 }}
            >
              <PhoneIcon style={{ fontSize: isMobile ? 14 : 16, marginRight: isMobile ? 0 : 4 }} />
              {!isMobile && <span style={{ fontWeight: 600, letterSpacing: 0.2 }}>Call</span>}
            </MotionA>

            {/* Mobile: Menu Button */}
            {isMobile && (
              <motion.button
                onClick={handleDrawerOpen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 36,
                  height: 36,
                }}
                aria-label="Open menu"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect y="7" width="32" height="3" rx="1.5" fill="#fff" />
                  <rect y="14" width="32" height="3" rx="1.5" fill="#fff" />
                  <rect y="21" width="32" height="3" rx="1.5" fill="#fff" />
                </svg>
              </motion.button>
            )}
          </Box>
        </Box>
      </Box>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box
          sx={{
            width: 250,
            pt: 2,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
          }}
        >
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6" fontWeight={600}>
              Menu
            </Typography>
            <IconButton onClick={handleDrawerClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <List>
            {['Home', 'Categories', 'Bulk Enquiry', 'About Us', 'WhatsApp Support'].map(
              (text) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton
                    onClick={() => {
                      handleDrawerClose();
                    }}
                  >
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
