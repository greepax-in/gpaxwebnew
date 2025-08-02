'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { ItemType, UnitType, SizeUnit } from '@/types/itemTypes';

interface Props {
  product: ItemType;
}

export default function ProductMobileUI({ product }: Props) {
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('in');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedUnit, setSelectedUnit] = useState<UnitType>(product.sizes[0].units[0].unitType);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const availableUnits = selectedSize.units.map(u => u.unitType);
    if (!availableUnits.includes(selectedUnit)) {
      setSelectedUnit(availableUnits[0]);
    }
  }, [selectedSize]);

  const selectedUnitData = selectedSize.units.find(u => u.unitType === selectedUnit);

  const offeredPrice = selectedUnitData?.offeredPrice ||  0;
  const sellingPrice = selectedUnitData?.sellingPrice ||  0;

  const discountPercentage = offeredPrice > sellingPrice
    ? Math.round(((offeredPrice - sellingPrice) / offeredPrice) * 100)
    : 0;

  const derivedPrice = selectedUnitData?.contains
    ? (sellingPrice / selectedUnitData.contains).toFixed(2)
    : undefined;

  const getImagesArray = (images: string | string[] | undefined): string[] => {
    if (!images) return [];
    return Array.isArray(images) ? images : [images];
  };

  const productImages: string[] = getImagesArray(selectedSize.sizeImages && selectedSize.sizeImages.length > 0 ? selectedSize.sizeImages : undefined);
  if (productImages.length === 0) {
    const fallbackImages = getImagesArray(product.productImages && (Array.isArray(product.productImages) ? product.productImages.length > 0 : !!product.productImages) ? product.productImages : undefined);
    productImages.push(...(fallbackImages.length > 0 ? fallbackImages : [product.image]));
  }

  return (
    <Box sx={{ p: 0, maxWidth: 400, mx: 'auto' }}>
      {/* Image + Thumbnail Overlay */}
      <Box sx={{ position: 'relative', width: '100%', height: 260, borderRadius: 2, mb: 1 }}>
        <Box
          component="img"
          src={productImages[selectedImageIndex]}
          alt="product"
          sx={{ width: '100%', height: '100%', borderRadius: 2 }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: 8,
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          {productImages.slice(0, 2).map((thumb: string, index: number) => (
            <Box
              key={index}
              component="img"
              src={thumb}
              alt={`thumb-${index}`}
              onClick={() => setSelectedImageIndex(index)}
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                border: selectedImageIndex === index ? '2px solid #4caf50' : '1px solid #ccc',
                cursor: 'pointer',
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Title + Subtitle */}
      <Typography variant="h6" fontWeight={600}>{product.name}</Typography>
      {product.subtitle && (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{product.subtitle}</Typography>
      )}

      {/* Size, Unit, and SizeUnit Toggle */}
      <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
        <FormControl size="small" sx={{ flexGrow: 2 }}>
          <InputLabel>Size</InputLabel>
          <Select
            value={selectedSize.sizeIn}
            label="Size"
            onChange={e => {
              const newSize = product.sizes.find(s => s.sizeIn === e.target.value);
              if (newSize) setSelectedSize(newSize);
            }}
          >
            {product.sizes.map(size => (
              <MenuItem key={size.sizeIn} value={size.sizeIn}>
                {sizeUnit === 'in' ? size.sizeIn : size.sizeCm}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: 80 }}>
          <InputLabel>Unit</InputLabel>
          <Select
            value={selectedUnit}
            label="Unit"
            onChange={e => setSelectedUnit(e.target.value as UnitType)}
          >
            {selectedSize.units.map(unit => (
              <MenuItem key={unit.unitType} value={unit.unitType}>{unit.unitType}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', height: 28, px: 0 }}>
          <Box
            sx={{
              display: 'flex',
              borderRadius: 999,
              bgcolor: '#f5f5f5',
              border: '1px solid #e0e0e0',
              overflow: 'hidden',
              height: 24,
              minWidth: 65,
              width: 56,
            }}
          >
            <Box
              onClick={() => setSizeUnit('in')}
              sx={{
                flex: 1,
                px: 1,
                py: 0.25,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '0.85em',
                color: sizeUnit === 'in' ? '#fff' : '#888',
                background: sizeUnit === 'in' ? '#4caf50' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              IN
            </Box>
            <Box
              onClick={() => setSizeUnit('cm')}
              sx={{
                flex: 1,
                px: 1,
                py: 0.25,
                textAlign: 'center',
                fontWeight: 700,
                fontSize: '0.85em',
                color: sizeUnit === 'cm' ? '#fff' : '#888',
                background: sizeUnit === 'cm' ? '#4caf50' : 'transparent',
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
            >
              CM
            </Box>
          </Box>
        </Box>
      </Stack>

      {/* Pricing Section */}
      <Stack direction="row" spacing={1} alignItems="baseline" sx={{ mb: 0.5 }}>
        <Typography variant="h6" color="success.main">
          ₹{sellingPrice} / {selectedUnit}
        </Typography>
        {offeredPrice > sellingPrice && (
          <>
            <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.secondary' }}>
              ₹{offeredPrice}
            </Typography>
            <Chip
              label={`${discountPercentage}% OFF`}
              size="small"
              sx={{ bgcolor: '#e53935', color: '#fff', height: 20, fontSize: '0.75rem' }}
            />
          </>
        )}
      </Stack>

      {derivedPrice && (
        <Typography variant="body2" color="text.secondary">
          Approx. ₹{derivedPrice} per {selectedUnitData?.containsLabel} ({selectedUnitData?.contains} per {selectedUnit})
        </Typography>
      )}
      <Typography variant="caption">MOQ: {selectedUnitData?.moq} {selectedUnit}</Typography>

      {/* Features */}
      <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
        {product.features.map((f, i) => (
          <Chip key={i} label={f} size="small" />
        ))}
      </Stack>

      {/* Shipping Info */}
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {product.shippingInfo || 'Ships in 3–5 days'}
      </Typography>

      {/* CTA */}
      <Button
        fullWidth
        variant="contained"
        color="success"
        sx={{ mt: 2 }}
        startIcon={<WhatsAppIcon />}
      >
        Buy via WhatsApp
      </Button>
    </Box>
  );
}
