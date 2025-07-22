'use client';

import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import PaletteIcon from '@mui/icons-material/Palette';
import PrintIcon from '@mui/icons-material/Print';

const subTexts = [
    "All Indian Language designs",
    "भारत में निर्मित",
    "இந்தியாவில் தயாரிக்கப்பட்டது",
    "ఇండియాలో తయారు చేయబడింది",
    "🖌️ Plain 🎨 Single Color 🖨️ Multi Color"
];

const MobileHero: React.FC = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % subTexts.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Box
            component="section"
            sx={{
                position: 'relative',
                height: '15vh',
                minHeight: 110,
                px: 2,
                py: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'flex-start',
                background: 'linear-gradient(120deg, #1B5E20 0%, #A5D6A7 100%)',
                color: '#fff',
                overflow: 'hidden',
            }}
        >
            {/* Logo & Brand */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 8,
                    left: 12,
                    display: 'flex',
                    alignItems: 'center',
                }}
            >
                <img
                    src="/images/greenpax-logo.svg"
                    alt="GreenPax Logo"
                    style={{ width: 30, height: 30, marginRight: 6 }}
                />
                <Typography variant="subtitle1" sx={{ fontWeight: 700, fontSize: '0.95rem' }}>
                    GREENPAX
                </Typography>
            </Box>

            {/* Static Heading */}
            <Typography variant="subtitle2" sx={{ fontSize: '0.95rem', mt: '30px', fontWeight: 600 }}>
                Sustainable Packaging – Made in India
            </Typography>

            {/* Animated Subtext */}
            <Typography variant="caption" sx={{
                fontSize: '0.8rem',
                mt: 1,
                minHeight: '18px', // adjust as needed to fit your tallest language
                display: 'flex',
                alignItems: 'center',
            }}>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={subTexts[index]}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.4 }}
                    >
                        {subTexts[index]}
                    </motion.span>
                </AnimatePresence>
            </Typography>

            {/* Bottom-Right Print Variant Tags */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 8,
                    right: 12,
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'center',
                }}
            >
                {/* Plain */}

            </Box>
        </Box>
    );
};

export default MobileHero;
