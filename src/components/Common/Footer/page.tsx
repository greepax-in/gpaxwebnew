'use client';

import React from 'react';
import {
  Box,
  Typography,
  Link,
  Stack,
  IconButton,
  useMediaQuery,
  Tooltip,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import FacebookIcon from '@mui/icons-material/Facebook';
import YouTubeIcon from '@mui/icons-material/YouTube';

export default function Footer() {
  const isMobile = useMediaQuery('(max-width:600px)');
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        width: '100%',
        bgcolor: '#f5f5f5',
        color: '#333',
        pt: 4,
        pb: isMobile ? 12 : 6,
        px: 2,
        borderTop: '1px solid #ddd',
        textAlign: 'center',
      }}
    >
      {/* Top Icons */}
      <Stack
        direction="row"
        spacing={2.5}
        justifyContent="center"
        alignItems="center"
        mb={2.5}
      >
        <Tooltip title="WhatsApp">
          <IconButton
            href="https://wa.me/91XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: '#25D366', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.2)' } }}
          >
            <WhatsAppIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Call">
          <IconButton
            href="tel:+91XXXXXXXXXX"
            sx={{ color: '#1976d2', transition: 'all 0.3s', '&:hover': { transform: 'scale(1.2)' } }}
          >
            <PhoneIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Instagram">
          <IconButton
            href="https://instagram.com/greenpax"
            target="_blank"
            sx={{ transition: 'all 0.3s', '&:hover': { transform: 'scale(1.2)' } }}
          >
            <InstagramIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="LinkedIn">
          <IconButton
            href="https://linkedin.com/company/greenpax"
            target="_blank"
            sx={{ transition: 'all 0.3s', '&:hover': { transform: 'scale(1.2)' } }}
          >
            <LinkedInIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Facebook">
          <IconButton
            href="https://facebook.com/greenpax"
            target="_blank"
            sx={{ transition: 'all 0.3s', '&:hover': { transform: 'scale(1.2)' } }}
          >
            <FacebookIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="YouTube">
          <IconButton
            href="https://youtube.com/@greenpax"
            target="_blank"
            sx={{ transition: 'all 0.3s', '&:hover': { transform: 'scale(1.2)' } }}
          >
            <YouTubeIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      {/* Navigation Links - Mobile vs Desktop */}
      {isMobile ? (
        <>
          {/* First Row */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            flexWrap="wrap"
            mb={1}
          >
            {[
              { label: 'Paper Bags', href: '/products/paper-bags' },
              { label: 'Paper Covers', href: '/products/paper-covers' },
              { label: 'Paper Boxes', href: '/products/paper-boxes' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                underline="hover"
                color="inherit"
                sx={{
                  fontWeight: 500,
                  fontSize: '1rem',
                  transition: 'color 0.3s',
                  '&:hover': { color: '#007bff' },
                }}
              >
                {label}
              </Link>
            ))}
          </Stack>

          {/* Second Row */}
          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            mb={2}
          >
            {[
              { label: 'About Us', href: '/about' },
                 { label: 'Blogs', href: '/blogs' },
              { label: 'Contact', href: '/contact' },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                underline="hover"
                color="inherit"
                sx={{
                  fontWeight: 500,
                  fontSize: '1rem',
                  transition: 'color 0.3s',
                  '&:hover': { color: '#007bff' },
                }}
              >
                {label}
              </Link>
            ))}
          </Stack>
        </>
      ) : (
        <Stack
          direction="row"
          spacing={4}
          justifyContent="center"
          alignItems="center"
          mb={2.5}
        >
          {[
            { label: 'Paper Bags', href: '/products/paper-bags' },
            { label: 'Paper Covers', href: '/products/paper-covers' },
            { label: 'Paper Boxes', href: '/products/paper-boxes' },
            { label: 'About Us', href: '/about' },
            { label: 'Blogs', href: '/blogs' },
            { label: 'Contact', href: '/contact' },
          ].map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              underline="hover"
              color="inherit"
              sx={{
                fontWeight: 500,
                fontSize: '1rem',
                transition: 'color 0.3s',
                '&:hover': { color: '#007bff' },
              }}
            >
              {label}
            </Link>
          ))}
        </Stack>
      )}

      {/* Tagline */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        🌿 Sustainable Paper Packaging • Made in India
      </Typography>

      {/* Legal Links */}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        flexWrap="wrap"
        sx={{ fontSize: '0.9rem', mb: 1 }}
      >
        <Link href="/privacy" underline="hover" color="inherit" sx={{ '&:hover': { color: '#007bff' } }}>
          Privacy Policy
        </Link>
        <Link href="/terms" underline="hover" color="inherit" sx={{ '&:hover': { color: '#007bff' } }}>
          Terms of Service
        </Link>
      </Stack>

      {/* Copyright */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontSize: '0.8rem' }}
      >
        © {currentYear} <strong>GREENPAX</strong>. All rights reserved. <br />
        Crafted with care by{' '}
        <Link
          href="https://shiftby.pro"
          target="_blank"
          color="inherit"
          underline="hover"
        >
          shiftby.pro
        </Link>
      </Typography>

      {/* GSTIN */}
      <Typography
        variant="caption"
        color="text.primary"
        sx={{
          fontWeight: 600,
          letterSpacing: 0.5,
          fontSize: '0.8rem',
          mt: 1,
        }}
      >
        GSTIN: <Typography component="span" variant="caption" fontWeight={400}>37EZCPK7404R1ZQ</Typography>
      </Typography>
    </Box>
  );
}
