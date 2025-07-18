'use client';

import React from "react";
import { Box } from "@mui/material";
import ProductCard from "@components/Home/ProductCategories/ProductCard";
import products from "./products.json";

export default function PaperBagsPage() {
  // const isMobile = useMediaQuery('(max-width:600px)');

  return (
    <>

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
          background: "#fdd7d7ff",
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
