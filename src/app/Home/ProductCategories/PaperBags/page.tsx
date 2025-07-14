'use client';
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
        image: '/images/productcategories/paperbags/1.svg',
        name: 'Food Delivery Paper Bags',
        description: 'Sturdy paper bags designed for safe and convenient food delivery.',
        industry: 'Food Delivery, Restaurants & Cafes',
        variants: ['Plain', 'Single Color', 'Multicolor'],
    },
    {
        image: '/images/productcategories/paperbags/7.svg',
        name: 'Bakery Paper Bags',
        description: 'Elegant bakery bags perfect for breads, pastries, and baked goods.',
        industry: 'Bakery & Confectionery',
        variants: ['Plain', 'Single Color'],
    },
    {
        image: '/images/productcategories/paperbags/13.svg',
        name: 'Gift Paper Bags',
        description: 'Attractive gift bags suitable for retail, events, and gifting purposes.',
        industry: 'Retail, Birthdays & Events',
        variants: ['Plain', 'Single Color', 'Multicolor'],
    },
];

const variantColors = {
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

export default function PaperBagSection() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                backgroundColor: '#f9f9f9',
            }}
        >
            <Container maxWidth="xl">
                <Typography
                    variant="h2"
                    fontWeight={700}
                    textAlign="center"
                    mb={6}
                >
                    Paper Bags
                </Typography>

                <Stack
                    direction="row"
                    spacing={{ xs: 2, md: 4 }}
                    justifyContent="center"
                    alignItems="stretch"
                    flexWrap="wrap"
                >
                    {products.map((product, index) => (
                        <MotionBox
                            key={index}
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
                                width: { xs: '100%', sm: 320, md: 450 },
                                p: 3,
                                borderRadius: 4,
                                backgroundColor: '#fff',
                                textAlign: 'center',
                                boxShadow: 6,
                                height: { xs: 'auto', md: '70vh' },
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                            }}
                        >
                            <Box
                                component="img"
                                src={product.image}
                                alt={product.name}
                                sx={{
                                    width: '100%',
                                    height: '400px',
                                    objectFit: 'contain',
                                    mb: 2,
                                }}
                            />
                            <Typography variant="h4" fontWeight={600} mb={1}>
                                {product.name}
                            </Typography>
                            <Typography variant="body1" mb={3} color="text.secondary">
                                {product.description}
                            </Typography>
                            <Typography variant="body1" mb={3} color="text.secondary">
                                <Box component="span" fontWeight="bold">Industry:</Box> {product.industry}
                            </Typography>

                            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                                {product.variants.map((variant) => {
                                    const variantStyle = variantColors[variant];
                                    return (
                                        <Button
                                            key={variant}
                                            variant={variantStyle.variant}
                                            size="small"
                                            sx={{
                                                textTransform: 'none',
                                                borderRadius: '20px',
                                                px: 2,
                                                fontWeight: 500,
                                                color: variantStyle.color,
                                                borderColor: variantStyle.borderColor,
                                                background: variantStyle.background,
                                                '&:hover': {
                                                    backgroundColor: variantStyle.hoverBackgroundColor,
                                                    opacity: variantStyle.hoverOpacity,
                                                },
                                            }}
                                        >
                                            {variant}
                                        </Button>
                                    );
                                })}
                            </Stack>

                            <Stack spacing={1}>
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    size="medium"
                                    startIcon={<InfoOutlinedIcon />}
                                >
                                    View Details
                                </Button>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    size="medium"
                                    color="success"
                                    startIcon={<WhatsAppIcon />}
                                    sx={{
                                        backgroundColor: '#25D366',
                                        '&:hover': { backgroundColor: '#1ebe5c' },
                                    }}
                                >
                                    Chat on WhatsApp
                                </Button>
                            </Stack>
                        </MotionBox>
                    ))}
                </Stack>

                <Box textAlign="center" mt={5}>
                    <Button variant="contained" size="large">
                        Explore Paper Bags
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
