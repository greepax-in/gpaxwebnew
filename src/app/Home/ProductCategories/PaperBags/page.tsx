import React from "react";
import { Box } from "@mui/material";

const products = [
    {
        name: "Food Delivery Paper Bags",
        image: "/images/food-delivery-paper-bags.jpg",
    },
    {
        name: "Cake Box Paper Bags",
        image: "/images/cake-box-paper-bags.jpg",
    },
    {
        name: "Promotion Paper Bags",
        image: "/images/promotion-paper-bags.jpg",
    },
    {
        name: "Gift Paper Bags",
        image: "/images/gift-paper-bags.jpg",
    },
    {
        name: "Garment Paper Bags",
        image: "/images/garment-paper-bags.jpg",
    },
    {
        name: "Custom Paper Bags",
        image: "/images/custom-paper-bags.jpg",
    },
];

export default function PaperBagsPage() {
    return (
        <Box
            sx={{
                minHeight: 100,
                display: "grid",
                gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, 1fr)",
                    md: "repeat(3, 1fr)",
                },
                gap: 3,
                p: 3,
                maxWidth: 1200,
                margin: "0 auto",
                background: "#f7f7f7",
            }}
        >
            {products.map((product) => (
                <Box
                    key={product.name}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        background: "#fff",
                        borderRadius: 2,
                        boxShadow: 4,
                        p: 2.5,
                        minHeight: 270, // Increased by 50% from 180
                        justifyContent: "center",
                    }}
                >
                    <Box
                        component="img"
                        src={product.image}
                        alt={product.name}
                        sx={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 1.5,
                            mb: 1.5,
                            boxShadow: 2,
                        }}
                    />
                    <Box
                        component="span"
                        sx={{
                            fontWeight: 500,
                            fontSize: "1rem",
                            textAlign: "center",
                        }}
                    >
                        {product.name}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}