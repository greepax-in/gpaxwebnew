// components/ProductPage/HeroMobile.tsx
'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Chip,
    useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { ItemType } from '@/types/itemTypes';
import StickyVariantBar from './StickyVariantBar';

const HeroMobile = ({ product }: { product: ItemType }) => {
    const isMobile = useMediaQuery('(max-width:600px)');

    const [selectedSize, setSelectedSize] = useState<string>(product.sizes?.[0] || '');
    const [selectedQty, setSelectedQty] = useState<string>(
        (product.minimumQuantities?.[0] || '').toString()
    );
    const [selectedUnit, setSelectedUnit] = useState<string>(product.units?.[0] || '');

    const selectedImage =
        product.sizeImages?.[selectedSize]?.[0] ||
        product.productImages?.[0] ||
        '/fallback.webp';

    const price =
        product.variantPrices?.[selectedSize]?.[selectedUnit]?.[selectedQty] ??
        product.offeredPrice ??
        0;

    const sellingPrice = product.sellingPrice ?? null;
    const discountPercentage =
        sellingPrice && price < sellingPrice
            ? Math.round(((sellingPrice - price) / sellingPrice) * 100)
            : null;

    const images = product.sizeImages?.[selectedSize] || product.productImages || [];

    return (
        <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 400, px: 2 }}>
                {/* Image + Overlay */}
                <Box
                    sx={{
                        width: '100%',
                        height: '40vh',
                        minHeight: 180,
                        maxHeight: 400,
                        position: 'relative',
                        mx: 'auto',
                    }}
                >
                    <motion.img
                        key={selectedImage}
                        src={selectedImage}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />

                    {/* Overlay Chips */}
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            display: 'flex',
                            gap: 1,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Chip label={`🎨 ${product.printvariants?.[0] || ''}`} color="primary" size="small" />
                        <Chip label={`📄 ${product.papervariant?.[0] || ''}`} color="success" size="small" />
                    </Box>
                </Box>

                {/* Thumbnails (always shown) */}
                <Box
                    sx={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mt: 1,
                        overflowX: 'auto',
                        scrollbarWidth: 'none',
                        '&::-webkit-scrollbar': { display: 'none' },
                    }}
                >
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        {images.map((img, idx) => (
                            <Box
                                key={img}
                                component="img"
                                src={img}
                                alt={`thumb-${idx}`}
                                onClick={() => {
                                    // Future enhancement: trigger image switch state
                                }}
                                sx={{
                                    width: 56,
                                    height: 56,
                                    objectFit: 'cover',
                                    borderRadius: 1,
                                    border: img === selectedImage ? '2px solid #1976d2' : '1px solid #ccc',
                                    cursor: 'pointer',
                                    transition: 'border 0.2s',
                                }}
                            />
                        ))}
                    </Box>
                </Box>

                {/* Title + Price */}
                <Box sx={{ pt: 2 }}>
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        color="text.primary"
                        sx={{
                            // backgroundColor: '#f0d1d1',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1,
                        }}
                    >
                        {`${product.name} – ${selectedSize}`}
                    </Typography>
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Typography variant="h6" fontWeight={700} color="primary">
                            ₹{price}
                        </Typography>
                        {sellingPrice && price < sellingPrice && (
                            <>
                                <Typography
                                    variant="body2"
                                    sx={{ textDecoration: 'line-through', color: 'text.secondary' }}
                                >
                                    ₹{sellingPrice}
                                </Typography>
                                <Chip
                                    label={`-${discountPercentage}%`}
                                    size="small"
                                    color="success"
                                    sx={{ fontWeight: 600 }}
                                />
                            </>
                        )}
                        <Typography variant="body2" color="text.secondary">
                            / {selectedQty}
                        </Typography>
                    </Box>
                </Box>

                {/* Sticky Variant Section */}
                <Box mt={2}>
                    <StickyVariantBar
                        sizes={product.sizes || []}
                        selectedSize={selectedSize}
                        onSizeSelect={setSelectedSize}
                        qtyOptions={(product.minimumQuantities || []).map(String)}
                        selectedQty={selectedQty}
                        onQtySelect={setSelectedQty}
                        unitOptions={product.units || []}
                        selectedUnit={selectedUnit}
                        onUnitSelect={setSelectedUnit}
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default HeroMobile;
