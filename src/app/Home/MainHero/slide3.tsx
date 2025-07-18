'use client';
import React from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  Card,
  CardContent,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import PaletteIcon from '@mui/icons-material/Palette';
import PrintIcon from '@mui/icons-material/Print';

const variants = [
  {
    title: 'Plain Print',
    desc: 'Minimalistic and elegant look for all-purpose packaging.',
    img: '/images/home/hero/bakery-paper-covers.svg',
    color: '#a6a3a3ff',
    icon: <FormatColorFillIcon fontSize="small" />,
  },
  {
    title: 'Single Color Print',
    desc: 'Perfect for brand recognition with one-tone precision.',
    img: '/images/home/hero/color-paper-bags.svg',
    color: '#1976d2',
    icon: <PaletteIcon fontSize="small" />,
  },
  {
    title: 'Multi Color Print',
    desc: 'Vibrant visuals for high impact presentation.',
    img: '/images/home/hero/printed-multi-color.svg',
    color: '#f3e5f5',
    icon: <PrintIcon fontSize="small" />,
  },
];

export default function Slide3() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box
      sx={{
        width: '100vw',
        height: { xs: '25vh', sm: '100vh' },
        mt: 0,
        px: { xs: 1, sm: 4 },
        py: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : 'center',
        overflow: 'hidden',
        position: 'relative',
        backgroundColor: '#fff', // ✅ fixes iOS black bg issue
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '0.95rem', sm: '2.4rem' },
          color: '#1976d2',
          mb: isMobile ? 0.5 : 3,
          textAlign: 'center',
        }}
      >
        Choose Your Print Variant
      </Typography>

      {isMobile ? (
        <>
          {/* ✅ MOBILE VERSION: 3 column images and chips */}
          <Box
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              px: 0.5,
              gap: 0.3,
              backgroundColor: '#fff', // ✅ white bg on iOS
            }}
          >
            {variants.map((v, i) => (
              <Box
                key={i}
                sx={{
                  flex: 1,
                  textAlign: 'center',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mt: -0.8
                }}
              >
                <img
                  src={v.img}
                  alt={v.title}
                  style={{
                    width: 'auto',
                    height: 'clamp(70px, 24vw, 90px)',
                    objectFit: 'contain',
                    marginBottom: 8,
                  }}
                />
                <Chip
                  label={
                    <Box
                      sx={{
                        lineHeight: 1,
                        fontSize: '0.70rem',
                        whiteSpace: 'normal',
                        textAlign: 'center',
                        color: '#fff',
                        px: 0.5,
                       
                        fontWeight: 700,
                      }}
                    >
                      {v.title}
                    </Box>
                  }
                  sx={{
                    height: 'auto',
                    py: 0.5,
                    px: 1,
                    fontSize: '0.65rem',
                    minHeight: 28,
                    backgroundColor: i === 2 ? 'transparent' : v.color,
                    ...(i === 2 && {
                      background:
                        'linear-gradient(135deg, #1976d2 30%, #ff9800 60%, #43a047 40%)',
                      color: '#fff',
                    }),
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* CTA Button */}
          <Box
            sx={{
              mt: 0.2,
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              backgroundColor: '#fff',
            }}
          >
            <Button
              variant="contained"
              color="success"
              size="small"
              sx={{
                fontSize: '0.75rem',
                px: 3,
                py: 0.6,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: 2,
              }}
              onClick={() => {
                window.location.href = 'https://wa.me/916309655384';
              }}
            >
              Get Quote
            </Button>
          </Box>
        </>
      ) : (
        // ✅ DESKTOP VERSION
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            width: '100%',
            maxWidth: '1280px',
            justifyContent: 'center',
          }}
        >
          {variants.map((v, i) => (
            <motion.a
              key={i}
              href={`/products/${v.title.toLowerCase().replace(/ /g, '-')}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.07,
                boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
              }}
              whileTap={{
                scale: 0.97,
                boxShadow: '0 2px 8px rgba(25, 118, 210, 0.10)',
              }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 0.6 }}
              style={{
                display: 'block',
                textDecoration: 'none',
                color: 'inherit',
                borderRadius: 16,
              }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Card
                sx={{
                  p: 3,
                  borderRadius: 4,
                  minWidth: 400,
                  maxWidth: 500,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  cursor: 'pointer',
                }}
                elevation={6}
              >
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 0,
                  }}
                >
                  <motion.img
                    src={v.img}
                    alt={v.title}
                    style={{
                      width: '250px',
                      height: '300px',
                      objectFit: 'contain',
                      marginBottom: 12,
                    }}
                    whileHover={{ scale: 1.12, rotate: 2 }}
                    whileTap={{ scale: 0.95, rotate: -2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  />
                  <Chip
                    icon={v.icon}
                    label={v.title}
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                      ...(i === 1
                        ? { backgroundColor: '#ff9800', color: '#222' }
                        : i === 2
                        ? {
                            background:
                              'linear-gradient(135deg, #1976d2 30%, #ff9800 60%, #43a047 40%)',
                            backgroundColor: 'transparent',
                            color: '#fff',
                          }
                        : { backgroundColor: '#ffffff99', color: '#222' }),
                    }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      mt: 1,
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      color: '#11010199',
                    }}
                  >
                    {v.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </Box>
      )}
    </Box>
  );
}
