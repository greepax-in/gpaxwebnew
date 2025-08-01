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
import PrintVariants from '../../../app/PrintVariants.json';

const ProductVariants = [
  {
    title: 'Plain',
    desc: 'Minimalistic and elegant look for all-purpose packaging.',
    img: '/images/home/hero/bakery-paper-covers.svg',
    icon: <FormatColorFillIcon fontSize="small" />,
  },
  {
    title: 'Single Color',
    desc: 'Perfect for brand recognition with one-tone precision.',
    img: '/images/home/hero/color-paper-bags.svg',
    icon: <PaletteIcon fontSize="small" />,
  },
  {
    title: 'Multi Color',
    desc: 'Vibrant visuals for high impact presentation.',
    img: '/images/home/hero/printed-multi-color.svg',
    icon: <PrintIcon fontSize="small" />,
  },
];

export default function Slide3() {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box
      sx={{
        width: '100vw',
        height: '100%',
        px: { xs: 1, sm: 4 },
        py: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: isMobile ? 'flex-start' : 'center',
        backgroundColor: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          fontSize: { xs: '0.9rem', sm: '2rem' },
          color: '#1976d2',
          mt: { xs: 0.6, sm: 2 },
          mb: { xs: 0.2, sm: 3 },
          textAlign: 'center',
        }}
      >
        Plain, Printed or Full Color – We&apos;ve Got You Covered.
      </Typography>

      {/* ✅ Desktop */}
      {!isMobile ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            gap: 3,
            width: '100%',
            maxWidth: '1280px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          {ProductVariants.map((v, i) => (
            <motion.a
              key={i}
              href={`/products/${v.title.toLowerCase().replace(/ /g, '-')}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                scale: 1.07,
                boxShadow: '0 12px 32px rgba(25, 118, 210, 0.18)',
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
                  width: 360,
                  height: 600,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  background: 'linear-gradient(to top, #f9f9f9, #ffffff)',
                  border: '1px solid #e0e0e0',
                  transition: 'box-shadow 0.2s, transform 0.2s',
                  cursor: 'pointer',
                }}
                elevation={4}
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
                      width: '100%',
                      height: 'calc(100% - 140px)',
                      objectFit: 'contain',
                      marginBottom: 16,
                      marginTop: '10%',
                    }}
                    whileHover={{ scale: 1.12, rotate: 2 }}
                    whileTap={{ scale: 0.95, rotate: -2 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  />

                  <Chip
                    icon={v.icon}
                    label={v.title}
                    sx={{
                      fontWeight: 700,
                      fontSize: '0.95rem',
                      mt: 1,
                      boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                      color: '#000',
                      background:
                        PrintVariants.variants.find(
                          (pv: { name: string; backgroundColor: string }) =>
                            pv.name.trim().toLowerCase() ===
                            v.title.trim().toLowerCase()
                        )?.backgroundColor || '#1976d2',
                    }}
                  />

                  <Typography
                    variant="body2"
                    sx={{
                      mt: 2,
                      textAlign: 'center',
                      fontSize: '0.9rem',
                      color: '#333',
                      fontWeight: 500,
                      lineHeight: 1.4,
                    }}
                  >
                    {v.desc}
                  </Typography>
                </CardContent>
              </Card>
            </motion.a>
          ))}
        </Box>
      ) : (
        // ✅ Mobile (unchanged)
        <>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'flex-start',
              width: '100%',
              flexGrow: 1,
            }}
          >
            {ProductVariants.map((v, i) => (
              <Box
                key={i}
                sx={{
                  width: '30%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={v.img}
                  alt={v.title}
                  style={{
                    width: '100%',
                    height: 'calc(30vh * 0.55)',
                    objectFit: 'contain',
                    marginBottom: 6,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  }}
                />
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    animate={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  >
                    <Chip
                      label={
                        <Box
                          sx={{
                            lineHeight: 1,
                            fontSize: '0.6rem',
                            whiteSpace: 'normal',
                            textAlign: 'center',
                            color: '#fff',
                            fontWeight: 700,
                            overflow: 'hidden',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                          }}
                        >
                          {v.title}
                        </Box>
                      }
                      sx={{
                        height: 25,
                        fontSize: '0.8rem',
                        px: 0.4,
                        color: '#fff',
                        background:
                          PrintVariants.variants.find(
                            (pv: { name: string; backgroundColor: string }) =>
                              pv.name.trim().toLowerCase() ===
                              v.title.trim().toLowerCase()
                          )?.backgroundColor || '#1976d2',
                      }}
                    />
                  </motion.div>
                </motion.div>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              mt: 0.5,
            }}
          >
            <Button
              variant="contained"
              sx={{
                fontWeight: 600,
                fontSize: '0.7rem',
                py: 0,
                lineHeight: 3,
                backgroundColor: '#1e0163ff',
                color: '#fff',
                borderRadius: 1,
                width: '60%',
                minHeight: 'unset',
              }}
            >
              Make Your Brand Unique
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}
