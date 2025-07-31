'use client';

import React from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  useMediaQuery,
  Divider,
  Chip,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import AvailableOptions from './AvailableOptions';
import { ProductType } from '../../types/products';

type Props = {
  product: ProductType;
};

const HeroSection = ({ product }: Props) => {
  const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <Box>
      <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={4}>
        {/* Left: Hero Image */}
        <Box flex={1}>
          <Box
            component="img"
            src={product.featuredImage}
            alt={product.name}
            sx={{
              width: '100%',
              height: isMobile ? 280 : 480,
              objectFit: 'contain',
              borderRadius: 2,
              boxShadow: 1,
            }}
          />
        </Box>

        {/* Right: Product Info */}
        <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold">
              {product.name}
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center" mt={1}>
              <Typography variant="h5" color="success.main">
                ₹{product.offeredPrice}
              </Typography>
              {product.offeredPrice !== product.sellingPrice && (
                <Typography
                  variant="body1"
                  sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                >
                  ₹{product.sellingPrice}
                </Typography>
              )}
            </Stack>

            <Typography variant="body2" mt={1} color="text.secondary">
              Guaranteed to arrive by <strong>2 Aug</strong> — Free Shipping
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Get ₹50 voucher if your order arrives late.
            </Typography>

            <Stack spacing={1} direction="row" mt={2}>
              <Chip label="FSC-Certified Paper" color="success" variant="outlined" />
              <Chip label="100% Biodegradable" color="success" variant="outlined" />
              <Chip label="Made in India" color="success" variant="outlined" />
            </Stack>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ height: 48, mt: 2 }}
              startIcon={<WhatsAppIcon />}
              href={`https://wa.me/91xxxxxxxxxx?text=I%20am%20interested%20in%20${encodeURIComponent(product.name)}`}
              target="_blank"
            >
              Currently available via WhatsApp only
            </Button>
          </Box>

          <Box mt={3}>
            <Divider sx={{ mb: 0 }} />
            <AvailableOptions product={product} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;