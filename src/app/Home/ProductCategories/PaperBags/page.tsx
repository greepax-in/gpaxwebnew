'use client';

import React from "react";
import { Box, useMediaQuery } from "@mui/material";
import ProductCard from "@components/Home/ProductCategories/ProductCard";
import products from "./products.json";

export default function PaperBagsPage() {
  const isMobile = useMediaQuery('(max-width:899.95px)');

  return (
    <>
    <Box
      sx={{
      textAlign: isMobile ? "left" : "center",
      mt: { xs: -0.1, sm: 0},
      mb: { xs: -0.1, sm: 0 },
     backgroundColor: "#d5eefbff",
      }}
    >
      <Box
        component={isMobile ? "span" : "h2"}
        sx={{
          fontWeight: "bold",
          fontSize: isMobile ? "clamp(0.5rem, 4vw, 2.5rem)" : "4rem",
          color: "#1a237e",
          fontFamily: "inherit",
          mt: isMobile ? 0 : 0, // Increased margin top
        }}
      >
        Paper Bags
      </Box>
    </Box>

      <Box
        sx={{
          // minHeight removed to allow proper flex scroll
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)", // 2 cols on mobile
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(3, 1fr)",
            xl: "repeat(4, 1fr)",
          },
          gap: 2,
          p: 2,
          maxWidth: 1500,
          margin: "0 auto",
          background: "#d5eefbff",
          pt: { xs: "1rem", sm: "3rem", md: "3rem", lg: "3rem" }, // ✅ reduced top padding on mobile
          overflow: "visible",
        }}
      >
        {products.map((product) => (
          <Box key={product.name} sx={{ width: '100%' }}>
            <ProductCard
              name={product.name}
              image={product.image}
              waText={product.waText}
              price={product.price}
              variants={product.variants}
              link={product.pageLink}
            />
          </Box>
        ))}
      </Box>
    </>
  );
}
