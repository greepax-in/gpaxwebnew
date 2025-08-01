'use client';

import React from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import LayersIcon from '@mui/icons-material/Layers';
import InventoryIcon from '@mui/icons-material/Inventory';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { WHATSAPP_NUMBER  } from '@/components/constants/whatsapp';

const navItems = [
  { label: 'Home', icon: HomeIcon, href: '/' },
  { label: 'Paper Bags', icon: LocalMallIcon, href: '/products/paper-bags' },
  { label: 'Paper Covers', icon: LayersIcon, href: '/products/paper-covers' },
  { label: 'Paper Boxes', icon: InventoryIcon, href: '/products/paper-boxes' },
];

export default function MobileMenu() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const pathname = usePathname();

  // ✅ Hide WhatsApp icon on product detail pages
  const isProductPage =
    pathname?.includes('/paper-bags/') ||
    pathname?.includes('/paper-covers/') ||
    pathname?.includes('/paper-boxes/');

  if (!isMobile) return null;

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          background: '#1B5E20',
          borderTopLeftRadius: '16px',
          borderTopRightRadius: '16px',
          boxShadow: '0 -2px 12px rgba(0,0,0,0.2)',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          px: 1,
          py: 0.5,
          zIndex: 1400,
        }}
      >
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const IconComponent = item.icon;
          return (
            <motion.a
              key={item.label}
              href={item.href}
              whileTap={{ scale: 0.92 }}
              style={{ textDecoration: 'none' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 1,
                  py: 0.5,
                  borderRadius: '12px',
                  backgroundColor: isActive ? '#A5D6A7' : 'transparent',
                  color: isActive ? '#1B5E20' : '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  minWidth: 50,
                  transition: 'all 0.3s ease-in-out',
                }}
              >
                <IconComponent fontSize="small" sx={{ color: isActive ? '#1B5E20' : '#ffffff' }} />
                {item.label}
              </Box>
            </motion.a>
          );
        })}

        {/* ✅ Conditional WhatsApp Button */}
        {!isProductPage && (
          <motion.a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            whileTap={{ scale: 0.92 }}
            style={{ textDecoration: 'none' }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                px: 1,
                py: 0.5,
                borderRadius: '12px',
                fontSize: '0.7rem',
                fontWeight: 500,
                minWidth: 50,
                color: '#25D366',
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <WhatsAppIcon fontSize="small" sx={{ color: '#25D366' }} />
              Chat
            </Box>
          </motion.a>
        )}
      </Box>
    </motion.div>
  );
}
