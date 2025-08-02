// app/components/ProductMobileUI.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, Stack, Select, MenuItem, FormControl, InputLabel, ToggleButtonGroup, ToggleButton } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { ItemType, UnitType, SizeUnit } from '@/types/itemTypes';
import { FormControlLabel, Switch } from '@mui/material';

interface Props {
  product: ItemType;
}

export default function ProductMobileUI({ product }: Props) {
  const [sizeUnit, setSizeUnit] = useState<SizeUnit>('in');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [selectedUnit, setSelectedUnit] = useState<UnitType>(product.sizes[0].availableUnits[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const availableUnits = selectedSize.availableUnits;
    if (!availableUnits.includes(selectedUnit)) {
      setSelectedUnit(availableUnits[0]);
    }
  }, [selectedSize]);

  const unitData = product.units.find(u => u.unitType === selectedUnit);
  const derivedPrice = unitData?.contains
    ? (unitData.price / unitData.contains).toFixed(2)
    : undefined;

  const productImages = product.productImages || [product.image];

  return (
    <Box sx={{ p:0, maxWidth: 400, mx: 'auto' }}>
      {/* Image + Thumbnail Overlay */}
      <Box sx={{ position: 'relative', width: '100%', height: 260, borderRadius: 2, mb: 1 }}>
        <Box
          component="img"
          src={productImages[selectedImageIndex]}
          alt="product"
          sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2 }}
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
          {productImages.slice(0, 2).map((thumb, index) => (
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

     <Stack direction="row" spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
  {/* Size Dropdown — wide */}
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

  {/* Unit Dropdown — fixed width */}
  <FormControl size="small" sx={{ width: 80 }}>
    <InputLabel>Unit</InputLabel>
    <Select
      value={selectedUnit}
      label="Unit"
      onChange={e => setSelectedUnit(e.target.value as UnitType)}
    >
      {selectedSize.availableUnits.map(unit => (
        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
      ))}
    </Select>
  </FormControl>

  {/* IN/CM pill toggle bar with both texts inside */}
  <Box sx={{ display: 'flex', alignItems: 'center', height: 28, px: 0 }}>
    <Box
      sx={{
        display: 'flex',
        borderRadius: 999,
        bgcolor: '#f5f5f5',
        border: '1px solid #e0e0e0',
        overflow: 'hidden',
        height: 24,
        minWidth:65,
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
      <Typography variant="h6">₹{unitData?.price} / {unitData?.unitType}</Typography>
      {derivedPrice && (
        <Typography variant="body2" color="text.secondary">
          Approx. ₹{derivedPrice} per {unitData?.containsLabel} ({unitData?.contains} per {unitData?.unitType})
        </Typography>
      )}
      <Typography variant="caption">MOQ: {unitData?.moq} {unitData?.unitType}</Typography>

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