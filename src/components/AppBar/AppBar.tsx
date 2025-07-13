'use client';

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import MainMenu from "./MainMenu";
import WhatsappIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import useMediaQuery from "@mui/material/useMediaQuery";

const MotionA = motion("a");

export default function AppBar() {
  // Use MUI's useMediaQuery to detect mobile view
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box
      sx={{
        position: 'fixed',
        top: isMobile ? 0 : 16, // Top is 0 for mobile, 16 for desktop
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1400, // Ensure it stays above other elements
        backgroundColor: '#113B2E',
        width: isMobile ? '90%' : { xs: '90%', md: '92%' }, // Full width for mobile
        maxWidth: '1200px',
        borderRadius: isMobile ? '16px' : '64px', // Rounded rectangle for mobile
        boxShadow: '0 8px 16px rgba(0,0,0,0.12)',
        px: 2,
        py: 1.2,
        '& .appbar-text': {
          color: '#fff',
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          overflow: 'visible',
        }}
      >
        {/* Desktop: Logo & GREENPAX */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MotionA
              href="/"
              style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.img
                src="/images/greenpax-logo.svg"
                alt="Greenpax Logo"
                style={{ height: 40 }}
                whileHover={{ scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
              <Typography
                className="appbar-text"
                variant="h6"
                sx={{
                  fontFamily: 'var(--font-poppins)',
                  fontWeight: 700,
                  fontSize: 28,
                  pl: 0.5,
                  letterSpacing: 2,
                }}
              >
                GREENPAX
              </Typography>
            </MotionA>
          </Box>
        )}

        {/* Desktop: Main Menu */}
        {!isMobile && (
          <Box>
            <MainMenu />
          </Box>
        )}

        {/* Desktop: WhatsApp Chat Button */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <MotionA
              href="https://wa.me/919999999999"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.1, backgroundColor: '#1DA851', rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#25D366',
                color: '#fff',
                borderRadius: '50px',
                padding: '0.5rem 1.2rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                gap: 8,
                transition: 'background 0.3s ease-in-out',
              }}
            >
              <WhatsappIcon />
              WhatsApp
            </MotionA>

            <MotionA
              href="tel:+917207905222"
              whileHover={{ scale: 1.1, backgroundColor: '#1976D2', rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#FF6F00',
                color: '#fff',
                borderRadius: '50px',
                padding: '0.5rem 1.2rem',
                fontWeight: 'bold',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                gap: 8,
                transition: 'background 0.3s ease-in-out',
              }}
            >
              <PhoneIcon />
            </MotionA>
          </Box>
        )}

        {/* Mobile: Logo, Title (center), Hamburger */}
        {isMobile && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              justifyContent: 'space-between',
              height: 40,
              px: 1,
              backgroundColor: '#113B2E',
              borderRadius: '16px', // Rounded rectangle for mobile
              boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
              zIndex: 1500,
            }}
          >
            {/* Logo on the left */}
            <MotionA
              href="/"
              style={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                position: 'absolute', // Position the logo absolutely
                left: '10px', // Move the logo to the extreme left with an offset of +10px
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
            >
              <motion.img
                src="/images/greenpax-logo.svg"
                alt="Greenpax Logo"
                style={{ height: 48 }}
                whileHover={{ scale: 1.15 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              />
            </MotionA>

            {/* Buttons on the right */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end', // Align buttons to the right
                gap: 1,
                position: 'absolute', // Position the buttons absolutely
                right: '10px', // Move the buttons to the extreme right with an offset of +10px
              }}
            >
              {/* WhatsApp Button */}
              <MotionA
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#25D366',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 35.2, // Increased by 10% (32 * 1.1)
                  height: 35.2, // Increased by 10% (32 * 1.1)
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <WhatsappIcon style={{ fontSize: 22 }} /> {/* Increased font size by 10% */}
              </MotionA>

              {/* Call Button */}
              <MotionA
                href="tel:+917207905222"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#FF6F00',
                  color: '#fff',
                  borderRadius: '50%',
                  width: 35.2, // Increased by 10% (32 * 1.1)
                  height: 35.2, // Increased by 10% (32 * 1.1)
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <PhoneIcon style={{ fontSize: 22 }} /> {/* Increased font size by 10% */}
              </MotionA>

              {/* Menu Button */}
              <motion.button
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
                  width: 32,
                  height: 32,
                }}
                aria-label="Open menu"
              >
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect y="7" width="32" height="3" rx="1.5" fill="#fff" />
                  <rect y="14" width="32" height="3" rx="1.5" fill="#fff" />
                  <rect y="21" width="32" height="3" rx="1.5" fill="#fff" />
                </svg>
              </motion.button>
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
