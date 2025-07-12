'use client';

import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";
import MainMenu from "./MainMenu";


import WhatsappIcon from '@mui/icons-material/WhatsApp';

const MotionA = motion("a");

export default function AppBar() {
  return (
    <Box sx={{ position: 'fixed', top: 0, zIndex: 1400, backgroundColor: '#fff', width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          maxWidth: '1200px',
          mx: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          overflow: 'visible', // Ensure no clipping
        }}
      >
        {/* Desktop: Logo & GREENPAX */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <MotionA
            href="/"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
          >
            <motion.img
              src="/images/logo.png"
              alt="Greenpax Logo"
              style={{ height: 40 }}
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
            <Typography
              variant="h6"
              sx={{
                display: { xs: 'none', md: 'block' },
                fontFamily: 'var(--font-poppins)',
                fontWeight: 700,
                fontSize: 28,
                color: '#2E3A2E',
                pl: 0.5,
                letterSpacing: 2,
              }}
            >
              GREENPAX
            </Typography>
          </MotionA>
        </Box>

        {/* Desktop: Main Menu */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <MainMenu />
        </Box>

        {/* Desktop: WhatsApp Chat Button */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <MotionA
            href="https://wa.me/919999999999"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#023a3bff',
              color: '#fff',
              borderRadius: '50px',
              padding: '0.5rem 1.2rem',
              fontWeight: 'bold',
              textDecoration: 'none',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              gap: 8,
            }}
          >
            <WhatsappIcon />
            WhatsApp
          </MotionA>
        </Box>

        {/* Mobile: Logo, Title (center), Hamburger */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            width: '100%',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* Logo (left) */}
          <MotionA
            href="/"
            style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.96 }}
          >
            <motion.img
              src="/images/logo.png"
              alt="Greenpax Logo"
              style={{ height: 36 }}
              whileHover={{ scale: 1.15 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            />
          </MotionA>

          {/* Title (center) */}
          <Typography
            variant="h6"
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-poppins)',
              fontWeight: 700,
              fontSize: 22,
              color: '#2E8C3A',
              letterSpacing: 2,
              display: { xs: 'block', md: 'none' },
            }}
          >
            GREENPAX
          </Typography>

          {/* Menu Button (right) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              marginLeft: 8,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            aria-label="Open menu"
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect y="7" width="32" height="3" rx="1.5" fill="#2E3A2E" />
              <rect y="14" width="32" height="3" rx="1.5" fill="#2E3A2E" />
              <rect y="21" width="32" height="3" rx="1.5" fill="#2E3A2E" />
            </svg>
          </motion.button>
        </Box>
      </Box>
    </Box>
  );
}
