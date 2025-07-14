'use client';
// import {useState} from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  useMediaQuery,
  Container,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';

const MotionBox = motion(Box);

const products = [
  {
    image: '/images/productcategories/paperboxes/18.svg',
    name: 'Food Delivery Paper Bags',
    description: 'Sturdy paper bags designed for safe and convenient food delivery.',
    industry: 'Food Delivery, Restaurants & Cafes',
    variants: ['Plain', 'Single Color', 'Multicolor'],
  },
  {
    image: '/images/productcategories/paperboxes/burger-boxes.svg',
    name: 'Bakery Paper Bags',
    description: 'Elegant bakery bags perfect for breads, pastries, and baked goods.',
    industry: 'Bakery & Confectionery',
    variants: ['Plain', 'Single Color'],
  }
];

type VariantType = 'Plain' | 'Single Color' | 'Multicolor';

const variantColors: Record<
  VariantType,
  {
    variant: 'outlined' | 'contained';
    color?: string;
    borderColor?: string;
    backgroundColor?: string;
    hoverBackgroundColor?: string;
    background?: string;
    hoverOpacity?: number;
  }
> = {
  Plain: {
    variant: 'outlined',
    color: 'text.primary',
    borderColor: 'primary.main',
  },
  'Single Color': {
    variant: 'contained',
    backgroundColor: 'primary.main',
    hoverBackgroundColor: 'primary.dark',
  },
  Multicolor: {
    variant: 'contained',
    background: 'linear-gradient(90deg, #2196F3, #9C27B0, #FF5722, #FFEB3B)',
    color: 'white',
    hoverOpacity: 0.9,
  },
};

type SectionKey = 'Paper Bags' | 'Paper Boxes' | 'Paper Covers';

type PaperBoxCategoriesProps = {
  sectionRefs: Record<SectionKey, React.RefObject<HTMLDivElement | null>>;
};


export default function PaperBoxesCategory({ sectionRefs }: PaperBoxCategoriesProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box
      ref={sectionRefs['Paper Boxes'] }
      data-section="Paper Boxes"
      sx={{
        minHeight: '100vh',
        py: 6,
        backgroundColor: '#fcfab2ff',
      }}
    >
      <Container maxWidth="xl">
        {/* Section Heading (optional) */}
        <Typography
          variant="h2"
          fontWeight={700}
          textAlign="center"
          mb={4}
          sx={{ fontSize: { xs: '2rem', sm: '2.2rem' } }}
        >
          Paper Boxes
        </Typography>

        {/* Product Cards */}
        <Stack
          direction="row"
          spacing={{ xs: 0, md: 3 }}
          justifyContent="center"
          alignItems="stretch"
          flexWrap="wrap"
        >
          {products.map((product, index) => (
            <Box
              key={index}
              sx={{
                width: { xs: '100%', sm: 320, md: 480 },
                mb: { xs: 1, md: 4 },
                mt: { xs: 8, md: 0 },
              }}
            >
              <MotionBox
                custom={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={!isMobile ? { scale: 1.05 } : {}}
                sx={{
                  minHeight: { xs: 'auto', md: 480 },
                  width: '100%',
                  p: 3,
                  mb: { xs: 1, md: 0 },
                  borderRadius: 4,
                  backgroundColor: '#fff',
                  textAlign: 'center',
                  boxShadow: 6,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  sx={{
                    width: '100%',
                    height: '200px',
                    objectFit: 'contain',
                    mb: 2,
                  }}
                />
                <Typography variant={isMobile ? 'h5' : 'h4'} fontWeight={600} mb={1}>
                  {product.name}
                </Typography>
                <Typography
                  variant="body2"
                  mb={2}
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '1rem' } }}
                >
                  {product.description}
                </Typography>
                <Typography
                  variant="body2"
                  mb={2}
                  color="text.secondary"
                  sx={{ fontSize: { xs: '0.70rem', sm: '1rem' } }}
                >
                  <Box component="span" fontWeight="bold">
                    Industry:
                  </Box>{' '}
                  {product.industry}
                </Typography>

                <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                  {product.variants.map((variant) => {
                    const style = variantColors[variant as VariantType];
                    return (
                      <Button
                        key={variant}
                        variant={style.variant}
                        size="small"
                        sx={{
                          textTransform: 'none',
                          borderRadius: '20px',
                          px: 2,
                          fontWeight: 500,
                          color: style.color,
                          borderColor: style.borderColor,
                          background: style.background,
                          backgroundColor: style.backgroundColor,
                          '&:hover': {
                            backgroundColor: style.hoverBackgroundColor,
                            opacity: style.hoverOpacity,
                          },
                        }}
                      >
                        {variant}
                      </Button>
                    );
                  })}
                </Stack>

                <Stack
                  direction={isMobile ? 'row' : 'column'}
                  spacing={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Button variant="outlined" fullWidth={!isMobile} size="medium" startIcon={<InfoOutlinedIcon />}>
                    {isMobile ? 'Details' : 'View Product Details'}
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth={!isMobile}
                    size="medium"
                    startIcon={<WhatsAppIcon />}
                    sx={{ backgroundColor: '#25D366', '&:hover': { backgroundColor: '#1ebe5c' } }}
                  >
                    {isMobile ? 'WhatsApp' : 'Chat via WhatsApp'}
                  </Button>
                </Stack>
              </MotionBox>
            </Box>
          ))}
        </Stack>

        {/* Footer CTA */}
        <Box textAlign="center" mt={5}>
          <Button variant="contained" size="large">
            Explore Paper Boxes
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
